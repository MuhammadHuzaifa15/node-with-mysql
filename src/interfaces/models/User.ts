import { Instance } from "sequelize";

export interface IUserAttributes {
  id?: string;
  firstName: string;
  lastName: string;
  imgUrl?: string;
  dateOfBirth: string;
  gender: string;
  isVerified?: boolean;
  phoneNumber: string;
  type: string;
  credentialId?: string;
  addressId?: string;
  isDeleted?: boolean;
}

export interface IUserInstance extends Instance<IUserAttributes> {
  dataValues: IUserAttributes;
}
