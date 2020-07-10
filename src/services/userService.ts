import * as UserRepository from "../repositories/User";
import * as AddressRepository from "../repositories/Address";
import { response } from "../helpers/models";

interface IGetById {
  id: string;
}

interface ICreateAddress {
  user: { id: string };
  deliveryAddress: string;
  area: string;
  type: string;
  city: string;
  additionalInfo: string;
}

// Get User By Id

const getByIdAsync = async (params: IGetById) => {
  const { id } = params;

  const user = await UserRepository.getById(id);

  // Response
  if (!user) {
    return new response(404).setMsg("User not found!");
  }
  return new response(200, user);
};

// Create User Address
const createAddressAsync = async (params: ICreateAddress) => {
  const { user, deliveryAddress, city, type, additionalInfo, area } = params;

  const address = await AddressRepository.create({
    deliveryAddress,
    city,
    type,
    additionalInfo,
    area,
    userId: user.id,
  });

  return new response(200, address);
};

// Get User Address
const getAllAddressesAsync = async (params: IGetById) => {
  const { id } = params;

  const user = await UserRepository.getById(id);

  // Response
  if (!user) {
    return new response(404).setMsg("User not found!");
  }

  const addresses = await AddressRepository.getAll(id);

  return new response(200, addresses);
};

export { getByIdAsync, createAddressAsync, getAllAddressesAsync };
