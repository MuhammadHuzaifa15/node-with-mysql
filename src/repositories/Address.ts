import {
  IAddressAttributes,
  IAddressInstance,
} from "../interfaces/models/Address";
import { Models } from "../models/index";

const Address = Models.address;

export const create = async (
  payload: IAddressAttributes
): Promise<IAddressInstance> => {
  return Address.create(payload);
};

export const getAll = async (id: string): Promise<IAddressInstance[]> => {
  return Address.findAll({
    attributes: [
      "id",
      "deliveryAddress",
      "city",
      "type",
      "area",
      "additionalInfo",
    ],
    where: { userId: id, isDeleted: false },
  });
};

export const getById = async (
  id: string,
  userId?: string
): Promise<IAddressInstance | null> => {
  let criteria: any = {};
  criteria = { id };
  criteria.isDeleted = false;
  if (userId) criteria.userId = userId;
  return Address.findOne({
    attributes: [
      "id",
      "deliveryAddress",
      "city",
      "type",
      "area",
      "additionalInfo",
    ],
    where: criteria,
  });
};

export const update = async (payload: IAddressAttributes) => {
  //@ts-ignore
  return Address.update(payload, { where: { id: payload.id } });
};

export const deleteById = async (id: string) => {
  //@ts-ignore
  return Address.update({ isDeleted: true }, { where: { id } });
};
