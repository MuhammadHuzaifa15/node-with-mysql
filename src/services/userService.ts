import * as UserRepository from "../repositories/User";
import * as AddressRepository from "../repositories/Address";
import * as CredentialRepository from "../repositories/Credential";
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

interface IUpdateImage {
  user: { id: string };
  imgUrl: string;
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

interface IUpdateUser {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
}

interface IGetAll {
  name: string;
  type: string;
  size: string;
  page: string;
  sort: string;
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

// Update User Address
const updateUserAsync = async (params: IUpdateUser) => {
  const { id, firstName, lastName, dateOfBirth, gender, phoneNumber } = params;

  const user = await UserRepository.getById(id);

  // Response
  if (!user) {
    return new response(404).setMsg("User not found!");
  }

  await UserRepository.update({
    id,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phoneNumber,
    type: user.dataValues.type,
  });

  return new response(200);
};

// Update User Image
const updateImageAsync = async (params: IUpdateImage) => {
  // Get user
  let { user, imgUrl } = params;
  const userObj = await UserRepository.getById(user.id);

  if (!userObj) {
    return new response(404).setMsg("User not found!");
  }

  // Update user img in database
  await UserRepository.updateImageUrl(user.id, imgUrl);

  // Response
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

// Delete User Address
const deleteByIdAsync = async (params: IGetById) => {
  const { id } = params;

  const user = await UserRepository.getById(id);

  // Response
  if (!user) {
    return new response(404).setMsg("User not found!");
  }

  const userCredential = await UserRepository.getUserCredentialId(id);

  await UserRepository.deleteById(id);
  await CredentialRepository.deleteById(
    // @ts-ignore
    userCredential?.dataValues.credentialId
  );

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

// Get Users
const getAllAsync = async (params: IGetAll) => {
  let { name, type, size, page, sort } = params;

  if (!size) {
    size = "10";
  }
  if (!page) {
    page = "1";
  }
  if (!sort) {
    sort = `updatedAt,desc`;
  }

  let limit = Number(size);
  let offset = (Number(page) - 1) * limit;

  let users = await UserRepository.getAll({
    name,
    type,
    limit,
    offset,
    sort: sort.split(","),
  });

  // Response
  const pageable = { totalElements: users.count, page, size };

  return new response(200, { users: users.rows, pageable });
};

export {
  getByIdAsync,
  createAddressAsync,
  getAllAddressesAsync,
  getAddressByIdAsync,
  updateAddressAsync,
  deleteAddressByIdAsync,
  deleteByIdAsync,
  updateUserAsync,
  getAllAsync,
  updateImageAsync,
};
