import { check } from "express-validator";

import validate from "../middleware/validate";

const updateUserValidation = [
  check("id", "User Id is required").not().isEmpty(),
  check("firstName", "First name is required").not().isEmpty(),
  check("lastName", "Last name is required").not().isEmpty(),
  check("dateOfBirth", "Date of birth is required").not().isEmpty(),
  check("gender", "Gender is required").not().isEmpty(),
  check("phoneNumber", "Phone number is invalid.")
    .not()
    .isEmpty()
    .custom((value) =>
      new RegExp(/^(\d{3}[-]?)(\d{3}[-]?)(\d{4})$/).test(value)
    )
    .withMessage("Phone number must be of format i.e. 312-1234567"),
  validate,
];

const updateUserImageValidation = [
  check("imgUrl", "Image is required.").not().isEmpty(),
  validate,
];

export { updateUserValidation, updateUserImageValidation };
