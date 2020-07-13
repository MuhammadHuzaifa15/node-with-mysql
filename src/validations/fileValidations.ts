import { check } from "express-validator";

import validate from "../middleware/validate";

const uploadFileValidation = [
  check("files", "At least a file is required.").not().isEmpty(),
  validate,
];
const getFileValidation = [
  check("id", "This is not a valid id.").not().isEmpty(),
  validate,
];

export { uploadFileValidation, getFileValidation };
