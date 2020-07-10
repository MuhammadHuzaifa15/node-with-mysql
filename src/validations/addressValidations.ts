import { check } from "express-validator";

import validate from "../middleware/validate";
import { CITIES, ADDRESS_TYPES } from "../constants";

const createAddressValidation = [
  check("deliveryAddress", "Delivery Address is required").not().isEmpty(),
  check("area", "Area is required").not().isEmpty(),
  check("type", "Address type is required")
    .not()
    .isEmpty()
    .custom((value) => value && value.toUpperCase() in ADDRESS_TYPES)
    .withMessage("Address type must be home, work or other."),
  check("city", "City is required")
    .not()
    .isEmpty()
    .custom((value) => value && value.toUpperCase() in CITIES)
    .withMessage("City must be karachi, lahore, islamabad or hyderabad."),
  validate,
];

const updateAddressValidation = [...createAddressValidation];

export { createAddressValidation, updateAddressValidation };
