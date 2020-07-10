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
    where: { userId: id },
  });
};
