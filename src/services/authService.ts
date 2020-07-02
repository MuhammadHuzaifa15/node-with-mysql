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

interface ISignIn {
  email: string;
  password: string;
}

interface IVerifyOTP {
  code: string;
  userId: string;
}

interface IForgotPassword {
  email: string;
}

interface IForgotPasswordVerify {
  code: string;
}

interface IResetPassword {
  resetToken: string;
  password: string;
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
    id: user.dataValues.id,
    firstName: user.dataValues.firstName,
    lastName: user.dataValues.lastName,
    email: credential.dataValues.email,
    type: user.dataValues.type,
  };

  let code = codeGenerator();

  await OTPRepository.create({
    code,
    userId: user.dataValues.id,
    expiredUTC: (
      new Date().getTime() + parseInt(CONFIG.otp_expiry_age, 10)
    ).toString(),
    type: "email-verification",
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

  const token = await OTPRepository.getByToken(
    code,
    "email-verification",
    userId
  );

  if (!token) {
    return new response(404).setMsg("Invalid code or userId");
  }

  let currTime = new Date().getTime();
  let expiresAt = parseInt(token.dataValues.expiredUTC, 10);

  if (currTime <= expiresAt) {
    await OTPRepository.update(code, "email-verification");
    await UserRepository.updateUserVerification(userId);
  } else {
    return new response(406).setMsg("Code expired");
  }

  return new response(200);
};

//SignIn
const signIn = async (params: ISignIn) => {
  const { email, password } = params;

  const credential = await CredentialRepository.getByEmail(email);
  if (!credential) {
    return new response(404).setMsg("No user found for this email");
  }

  const user = await UserRepository.getByCredentialId(credential.dataValues.id);

  if (!user) {
    return new response(404).setMsg("User not found");
  }
  // check password
  const isPasswordMatch = await bcrypt.compare(
    password,
    credential.dataValues.password
  );
  if (!isPasswordMatch) {
    return new response(401).setMsg("Invalid password.");
  }

  const payload = {
    user: {
      id: user.dataValues.id,
    },
  };

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
    id: user.dataValues.id,
    firstName: user.dataValues.firstName,
    lastName: user.dataValues.lastName,
    email: credential.dataValues.email,
    type: user.dataValues.type,
  };

  return new response(200, { profile, token });
};

//Forgot Password
const forgotPasswordAsync = async (params: IForgotPassword) => {
  const { email } = params;

  // check if email already exists
  const credential = await CredentialRepository.getByEmail(email);
  if (!credential) {
    return new response(404).setMsg("No user found for this email");
  }

  const user = await UserRepository.getByCredentialId(credential.dataValues.id);

  if (!user) {
    return new response(404).setMsg("User not found");
  }

  let code = codeGenerator();

  await OTPRepository.create({
    code,
    userId: user?.dataValues.id,
    expiredUTC: (
      new Date().getTime() + parseInt(CONFIG.otp_expiry_age, 10)
    ).toString(),
    type: "reset-password",
  });

  const emailService: any = new Email(
    EMAIL_TEMPLATES.RESET_PASSWORD,
    {
      to: email,
      subject: "Reset Password",
    },
    { username: user?.dataValues.firstName, code }
  );

  emailService.send();

  // response

  return new response(200);
};

//Forgot Password Verify
const forgotPasswordVerifyAsync = async (params: IForgotPasswordVerify) => {
  const { code } = params;
  // check if token exists
  const token = await OTPRepository.getByToken(code, "reset-password");

  if (!token) {
    return new response(404).setMsg("Invalid code or userId");
  }

  let currTime = new Date().getTime();
  let expiresAt = parseInt(token.dataValues.expiredUTC, 10);
  if (currTime > expiresAt) {
    return new response(406).setMsg("Code expired");
  }

  return new response(200);
};

//Reset Password
const resetPasswordAsync = async (params: IResetPassword) => {
  const { password, resetToken } = params;
  // check if token exists
  const token = await OTPRepository.getByToken(resetToken, "reset-password");

  if (!token) {
    return new response(404).setMsg("Invalid code");
  }

  let currTime = new Date().getTime();
  let expiresAt = parseInt(token.dataValues.expiredUTC, 10);
  if (currTime <= expiresAt) {
    await OTPRepository.update(resetToken, "reset-password");
  } else {
    return new response(406).setMsg("Code expired");
  }

  // encrypt password
  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(password, salt);

  // Get user
  const user = await UserRepository.getUserCredentialId(
    token.dataValues.userId
  );

  if (!user) {
    return new response(404).setMsg("User not found");
  }

  await CredentialRepository.updatePassword(
    user.dataValues.credentialId,
    hashedNewPassword
  );

  return new response(200);
};

export {
  signUp,
  verifyOTP,
  forgotPasswordAsync,
  forgotPasswordVerifyAsync,
  resetPasswordAsync,
  signIn,
};
