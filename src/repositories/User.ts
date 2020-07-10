import { IUserAttributes, IUserInstance } from "../interfaces/models/User";
import { Models, Operators as Op } from "../models/index";

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

export const deleteById = async (id: string) => {
  return User.update({ isDeleted: true }, { where: { id } });
};

export const update = async (payload: IUserAttributes) => {
  //@ts-ignore
  return User.update(payload, { where: { id: payload.id } });
};

export const getAll = async (obj: {
  name?: string;
  type?: string;
  limit: number;
  offset: number;
  sort: string[];
}): Promise<{ count: number; rows: IUserInstance[] }> => {
  let criteria: any = {};
  if (obj.name || obj.type) {
    if (obj.name) {
      criteria[Op.or] = [
        { firstName: { [Op.like]: `%${obj.name}%` } },
        { lastName: { [Op.like]: `%${obj.name}%` } },
      ];
    }
    if (obj.type) {
      criteria.type = obj.type;
    }
  }
  criteria.isDeleted = false;
  return User.findAndCountAll({
    attributes: ["id", "firstName", "lastName", "gender", "type"],
    where: criteria,
    limit: obj.limit,
    offset: obj.offset,
    order: [[obj.sort[0], obj.sort[1]]],
  });
};
