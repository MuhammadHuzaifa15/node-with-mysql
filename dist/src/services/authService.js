"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const models_1 = require("../helpers/models");
const CredentialRepository = __importStar(require("../repositories/Credential"));
const UserRepository = __importStar(require("../repositories/User"));
const OTPRepository = __importStar(require("../repositories/OTP"));
const emailService_1 = require("./emailService");
const emailTemplates_1 = require("../constants/emailTemplates");
const generalHelper_1 = require("../helpers/generalHelper");
const CONFIG = require("../../config/config");
//SignUp
const signUp = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, type, password, dateOfBirth, gender, phoneNumber, } = params;
    // check if email already exists
    const existingUserWithEmail = yield CredentialRepository.getByEmail(email);
    if (existingUserWithEmail) {
        return new models_1.response(400).setMsg("Email address already exists");
    }
    // encrypt password
    const salt = yield bcrypt.genSalt(10);
    const hashedPassword = yield bcrypt.hash(password, salt);
    const credential = yield CredentialRepository.create({
        email,
        password: hashedPassword,
    });
    // Create user
    const user = yield UserRepository.create({
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
    const token = yield new Promise((resolve, reject) => jwt.sign(payload, CONFIG.jwt_secret, {
        expiresIn: CONFIG.identity_token_temporary_age,
    }, (err, token) => {
        if (err)
            reject(err);
        resolve(token);
    }));
    let profile = {
        id: user.dataValues.id,
        firstName: user.dataValues.firstName,
        lastName: user.dataValues.lastName,
        email: credential.dataValues.email,
        type: user.dataValues.type,
    };
    let code = generalHelper_1.codeGenerator();
    yield OTPRepository.create({
        code,
        userId: user.dataValues.id,
        expiredUTC: (new Date().getTime() + parseInt(CONFIG.otp_expiry_age, 10)).toString(),
        type: "email-verification",
    });
    const emailService = new emailService_1.Email(emailTemplates_1.EMAIL_TEMPLATES.WELCOME, {
        to: email,
        subject: "Welcome",
    }, { username: firstName, code });
    emailService.send();
    return new models_1.response(200, { profile, token });
});
exports.signUp = signUp;
//verifyOTP
const verifyOTP = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, userId } = params;
    const token = yield OTPRepository.getByToken(code, "email-verification", userId);
    if (!token) {
        return new models_1.response(404).setMsg("Invalid code or userId");
    }
    let currTime = new Date().getTime();
    let expiresAt = parseInt(token.dataValues.expiredUTC, 10);
    if (currTime <= expiresAt) {
        yield OTPRepository.update(code, "email-verification");
        yield UserRepository.updateUserVerification(userId);
    }
    else {
        return new models_1.response(406).setMsg("Code expired");
    }
    return new models_1.response(200);
});
exports.verifyOTP = verifyOTP;
//SignIn
const signIn = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = params;
    const credential = yield CredentialRepository.getByEmail(email);
    if (!credential) {
        return new models_1.response(404).setMsg("No user found for this email");
    }
    const user = yield UserRepository.getByCredentialId(credential.dataValues.id);
    if (!user) {
        return new models_1.response(404).setMsg("User not found");
    }
    // check password
    const isPasswordMatch = yield bcrypt.compare(password, credential.dataValues.password);
    if (!isPasswordMatch) {
        return new models_1.response(401).setMsg("Invalid password.");
    }
    const payload = {
        user: {
            id: user.dataValues.id,
        },
    };
    const token = yield new Promise((resolve, reject) => jwt.sign(payload, CONFIG.jwt_secret, {
        expiresIn: CONFIG.identity_token_temporary_age,
    }, (err, token) => {
        if (err)
            reject(err);
        resolve(token);
    }));
    let profile = {
        id: user.dataValues.id,
        firstName: user.dataValues.firstName,
        lastName: user.dataValues.lastName,
        email: credential.dataValues.email,
        type: user.dataValues.type,
    };
    return new models_1.response(200, { profile, token });
});
exports.signIn = signIn;
//GoogleSignIn
const signInWithGoogle = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, onBoarding } = params;
    let resBody = { profile: user, onBoarding };
    if (!onBoarding) {
        const payload = {
            user: {
                id: user.id,
            },
        };
        // response
        const token = yield new Promise((resolve, reject) => jwt.sign(payload, CONFIG.jwt_secret, {
            expiresIn: CONFIG.identity_token_temporary_age,
        }, (err, token) => {
            if (err)
                reject(err);
            resolve(token);
        }));
        let profile = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            // @ts-ignore
            email: user.email,
            type: user.type,
        };
        resBody.profile = profile;
        resBody.token = token;
    }
    return new models_1.response(200, resBody);
});
exports.signInWithGoogle = signInWithGoogle;
//Forgot Password
const forgotPasswordAsync = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = params;
    // check if email already exists
    const credential = yield CredentialRepository.getByEmail(email);
    if (!credential) {
        return new models_1.response(404).setMsg("No user found for this email");
    }
    const user = yield UserRepository.getByCredentialId(credential.dataValues.id);
    if (!user) {
        return new models_1.response(404).setMsg("User not found");
    }
    let code = generalHelper_1.codeGenerator();
    yield OTPRepository.create({
        code,
        userId: user === null || user === void 0 ? void 0 : user.dataValues.id,
        expiredUTC: (new Date().getTime() + parseInt(CONFIG.otp_expiry_age, 10)).toString(),
        type: "reset-password",
    });
    const emailService = new emailService_1.Email(emailTemplates_1.EMAIL_TEMPLATES.RESET_PASSWORD, {
        to: email,
        subject: "Reset Password",
    }, { username: user === null || user === void 0 ? void 0 : user.dataValues.firstName, code });
    emailService.send();
    // response
    return new models_1.response(200);
});
exports.forgotPasswordAsync = forgotPasswordAsync;
//Forgot Password Verify
const forgotPasswordVerifyAsync = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = params;
    // check if token exists
    const token = yield OTPRepository.getByToken(code, "reset-password");
    if (!token) {
        return new models_1.response(404).setMsg("Invalid code or userId");
    }
    let currTime = new Date().getTime();
    let expiresAt = parseInt(token.dataValues.expiredUTC, 10);
    if (currTime > expiresAt) {
        return new models_1.response(406).setMsg("Code expired");
    }
    return new models_1.response(200);
});
exports.forgotPasswordVerifyAsync = forgotPasswordVerifyAsync;
//Reset Password
const resetPasswordAsync = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, resetToken } = params;
    // check if token exists
    const token = yield OTPRepository.getByToken(resetToken, "reset-password");
    if (!token) {
        return new models_1.response(404).setMsg("Invalid code");
    }
    let currTime = new Date().getTime();
    let expiresAt = parseInt(token.dataValues.expiredUTC, 10);
    if (currTime <= expiresAt) {
        yield OTPRepository.update(resetToken, "reset-password");
    }
    else {
        return new models_1.response(406).setMsg("Code expired");
    }
    // encrypt password
    const salt = yield bcrypt.genSalt(10);
    const hashedNewPassword = yield bcrypt.hash(password, salt);
    // Get user
    const user = yield UserRepository.getUserCredentialId(token.dataValues.userId);
    if (!user) {
        return new models_1.response(404).setMsg("User not found");
    }
    yield CredentialRepository.updatePassword(user.dataValues.credentialId, hashedNewPassword);
    return new models_1.response(200);
});
exports.resetPasswordAsync = resetPasswordAsync;
