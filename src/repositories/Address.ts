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
