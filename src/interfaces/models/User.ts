import { Instance } from "sequelize";

export interface IUserAttributes {
  id?: number;
  firstName: string;
  lastName: string;
  imgUrl?: string;
  dateOfBirth: string;
  gender: string;
  isVerified?: boolean;
  phoneNumber: string;
  type: string;
  credentialId?: number;
  addressId?: number;
  isDeleted?: boolean;
}

export interface IUserInstance extends Instance<IUserAttributes> {
  dataValues: IUserAttributes;
}
