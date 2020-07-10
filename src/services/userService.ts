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

interface IDeleteAddress {
  user: { id: string };
  id: string;
}

interface IUpdateAddress {
  user: { id: string };
  id: string;
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

// Get Address By Id
const getAddressByIdAsync = async (params: IGetById) => {
  const { id } = params;

  const address = await AddressRepository.getById(id);

  // Response
  if (!address) {
    return new response(404).setMsg("Address not found!");
  }
  return new response(200, address);
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

// Update User Address
const updateAddressAsync = async (params: IUpdateAddress) => {
  const {
    id,
    deliveryAddress,
    city,
    type,
    additionalInfo,
    area,
    user,
  } = params;

  const addressExist = await AddressRepository.getById(id, user.id);

  // Response
  if (!addressExist) {
    return new response(404).setMsg("Address not found!");
  }

  await AddressRepository.update({
    id,
    deliveryAddress,
    city,
    type,
    additionalInfo,
    area,
  });

  return new response(200);
};

// Delete User Address
const deleteAddressByIdAsync = async (params: IDeleteAddress) => {
  const { id, user } = params;

  const addressExist = await AddressRepository.getById(id, user.id);

  // Response
  if (!addressExist) {
    return new response(404).setMsg("Address not found!");
  }

  await AddressRepository.deleteById(id);

  return new response(200);
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

export {
  getByIdAsync,
  createAddressAsync,
  getAllAddressesAsync,
  getAddressByIdAsync,
  updateAddressAsync,
  deleteAddressByIdAsync,
};
