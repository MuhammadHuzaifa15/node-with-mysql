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
    where: { credentialId: id, isDeleted: false },
  });
};

export const getById = async (
  id: string | undefined
): Promise<IUserInstance | null> => {
  return User.findOne({
    attributes: [
      "id",
      "firstName",
      "lastName",
      "imgUrl",
      "dateOfBirth",
      "gender",
      "phoneNumber",
      "type",
    ],
    include: [
      {
        model: Models.credential,
        as: "credential",
        attributes: ["email", "provider"],
      },
    ],
    where: { id: id, isDeleted: false },
  });
};

export const getUserCredentialId = async (
  id: string | undefined
): Promise<IUserInstance | null> => {
  return User.findOne({
    attributes: ["id", "credentialId"],
    where: { id: id, isDeleted: false },
  });
};

export const getUserRole = async (
  id: string
): Promise<IUserInstance | null> => {
  return User.findOne({
    attributes: ["type"],
    where: { id: id, isDeleted: false },
  });
};
