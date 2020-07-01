import { check } from "express-validator";

import validate from "../middleware/validate";
import { USER_TYPES } from "../constants";

const signUpValidation = [
  check("email", "Email address is invalid.").isEmail(),
  check("password", "Password must be 6 or more characters.").isLength({
    min: 6,
    max: 18,
  }),
  check("firstName", "First name is required").not().isEmpty(),
  check("lastName", "Last name is required").not().isEmpty(),
  check("dateOfBirth", "Date of birth is required").not().isEmpty(),
  check("gender", "Gender is required").not().isEmpty(),
  check("type", "Account type is required")
    .not()
    .isEmpty()
    .custom(
      (value) =>
        value &&
        (value.toLowerCase() == USER_TYPES.MERCHANT ||
          value.toLowerCase() == USER_TYPES.CONSUMER ||
          value.toLowerCase() == USER_TYPES.ADMIN)
    )
    .withMessage("Account type must be admin, merchant or consumer."),
  check("phoneNumber", "Phone number is invalid.")
    .not()
    .isEmpty()
    .custom((value) =>
      new RegExp(/^(\d{3}[-]?)(\d{3}[-]?)(\d{4})$/).test(value)
    )
    .withMessage("Phone number must be of format i.e. 312-1234567"),
  validate,
];

const verifyOTPValidation = [
  check("code", "Code is required").not().isEmpty(),
  check("userId", "UserId is required").not().isEmpty(),
  validate,
];

export { signUpValidation, verifyOTPValidation };
