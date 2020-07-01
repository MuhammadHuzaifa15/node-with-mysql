import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { response } from "../helpers/models";
import * as CredentialRepository from "../repositories/Credential";
import * as UserRepository from "../repositories/User";
import * as OTPRepository from "../repositories/OTP";
import { Email } from "./emailService";
import { EMAIL_TEMPLATES } from "../constants/emailTemplates";
import { codeGenerator } from "../helpers/generalHelper";
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

interface IVerifyOTP {
  code: string;
  userId: string;
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

  let code = codeGenerator();

  await OTPRepository.create({
    code,
    userId: user.dataValues.id,
    expiredUTC: (Date.now() + parseInt(CONFIG.otp_expiry_age, 10)).toString(),
  });

  const emailService: any = new Email(
    EMAIL_TEMPLATES.WELCOME,
    {
      to: email,
      subject: "Welcome",
    },
    { username: firstName, code }
  );

  emailService.send();

  return new response(200, { profile, token });
};

//verifyOTP
const verifyOTP = async (params: IVerifyOTP) => {
  const { code, userId } = params;

  const token = await OTPRepository.getByToken(code, userId);

  if (!token) {
    return new response(404).setMsg("Invalid code or userId");
  }

  if (parseInt(token.dataValues.expiredUTC, 10) > Date.now()) {
    await OTPRepository.update(code);
    await UserRepository.update(userId);
  } else {
    return new response(401).setMsg("Code expired");
  }

  return new response(200);
};

export { signUp, verifyOTP };
