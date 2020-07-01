import { IUserAttributes, IUserInstance } from "../interfaces/models/User";
import { Models } from "../models/index";

const User = Models.users;

export const create = async (
  payload: IUserAttributes
): Promise<IUserInstance> => {
  return User.create(payload);
};
