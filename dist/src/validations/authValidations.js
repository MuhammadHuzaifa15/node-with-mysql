"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validate_1 = __importDefault(require("../middleware/validate"));
const constants_1 = require("../constants");
const signUpValidation = [
    express_validator_1.check("email", "Email address is invalid.").isEmail(),
    express_validator_1.check("password", "Password must be 6 or more characters.").isLength({
        min: 6,
        max: 18,
    }),
    express_validator_1.check("firstName", "First name is required").not().isEmpty(),
    express_validator_1.check("lastName", "Last name is required").not().isEmpty(),
    express_validator_1.check("dateOfBirth", "Date of birth is required").not().isEmpty(),
    express_validator_1.check("gender", "Gender is required").not().isEmpty(),
    express_validator_1.check("type", "Account type is required")
        .not()
        .isEmpty()
        .custom((value) => value &&
        (value.toLowerCase() == constants_1.USER_TYPES.MERCHANT ||
            value.toLowerCase() == constants_1.USER_TYPES.CONSUMER ||
            value.toLowerCase() == constants_1.USER_TYPES.ADMIN))
        .withMessage("Account type must be admin, merchant or consumer."),
    express_validator_1.check("phoneNumber", "Phone number is invalid.")
        .not()
        .isEmpty()
        .custom((value) => new RegExp(/^(\d{3}[-]?)(\d{3}[-]?)(\d{4})$/).test(value))
        .withMessage("Phone number must be of format i.e. 312-1234567"),
    validate_1.default,
];
exports.signUpValidation = signUpValidation;
const signInValidation = [
    express_validator_1.check("email", "Email address is invalid").isEmail(),
    express_validator_1.check("password", "Password is required").not().isEmpty(),
    validate_1.default,
];
exports.signInValidation = signInValidation;
const verifyOTPValidation = [
    express_validator_1.check("code", "Code is required").not().isEmpty(),
    express_validator_1.check("userId", "UserId is required").not().isEmpty(),
    validate_1.default,
];
exports.verifyOTPValidation = verifyOTPValidation;
const forgotPasswordValidation = [
    express_validator_1.check("email", "Email address is invalid").isEmail(),
    validate_1.default,
];
exports.forgotPasswordValidation = forgotPasswordValidation;
const forgotPasswordVerifyValidation = [
    express_validator_1.buildCheckFunction(["headers"])("otp-token", "OTP is required")
        .not()
        .isEmpty(),
    validate_1.default,
];
exports.forgotPasswordVerifyValidation = forgotPasswordVerifyValidation;
const resetPasswordValidation = [
    express_validator_1.check("password", "New password is required.").not().isEmpty(),
    express_validator_1.check("resetToken", "Token is required.").not().isEmpty(),
    validate_1.default,
];
exports.resetPasswordValidation = resetPasswordValidation;
