import { IUserAttributes, IUserInstance } from "../interfaces/models/User";
import { Models } from "../models/index";

const User = Models.users;

export const create = async (
  payload: IUserAttributes
): Promise<IUserInstance> => {
  return User.create(payload);
};

export const updateUserVerification = async (id: string) => {
  return User.update({ isVerified: true }, { where: { id } });
};

export const getByCredentialId = async (
  id: string | undefined
): Promise<IUserInstance | null> => {
  return User.findOne({
    where: { credentialId: id },
  });
};

export const getById = async (
  id: string | undefined
): Promise<IUserInstance | null> => {
  return User.findOne({
    include: [{ model: Models.credential, as: "credential" }],
    where: { id: id },
  });
};
