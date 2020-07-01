import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { response } from "../helpers/models";
import * as CredentialRepository from "../repositories/Credential";
import * as UserRepository from "../repositories/User";
import { Email } from "./emailService";
import { EMAIL_TEMPLATES } from "../constants/emailTemplates";
const CONFIG = require("../../config/config");

interface ISignUp {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  type: string;
}

//SignUp
const signUp = async (params: ISignUp) => {
  const {
    firstName,
    lastName,
    email,
    type,
    password,
    dateOfBirth,
    gender,
    phoneNumber,
  } = params;

  // check if email already exists
  const existingUserWithEmail = await CredentialRepository.getByEmail(email);

  if (existingUserWithEmail) {
    return new response(400).setMsg("Email address already exists");
  }

  // encrypt password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const credential = await CredentialRepository.create({
    email,
    password: hashedPassword,
  });

  // Create user
  const user = await UserRepository.create({
    firstName,
    lastName,
    type,
    dateOfBirth,
    gender,
    phoneNumber,
    credentialId: credential.dataValues.id,
  });

  const payload = {
    user: {
      id: user.dataValues.id,
    },
  };

  // response

  const token = await new Promise((resolve: Function, reject: Function) =>
    jwt.sign(
      payload,
      CONFIG.jwt_secret,
      {
        expiresIn: CONFIG.identity_token_temporary_age,
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );

  let profile = {
    firstName: user.dataValues.firstName,
    lastName: user.dataValues.lastName,
    email: credential.dataValues.email,
    type: user.dataValues.type,
  };

  const emailService: any = new Email(
    EMAIL_TEMPLATES.WELCOME,
    {
      to: email,
      subject: "Welcome",
    },
    { username: firstName }
  );

  emailService.send();
  return new response(200, { profile, token });
};

export { signUp };
