// Models
const { User } = require("../models");

// Helpers
import { response } from "../helpers/models";

interface IGetById {
  id: string;
}

// Get User By Id

const getByIdAsync = async (params: IGetById) => {
  const { id } = params;

  // Response
  if (!id) {
    return new response(404).setMsg("User not found!");
  }
  return new response(200, "User found!");
};

export { getByIdAsync };
