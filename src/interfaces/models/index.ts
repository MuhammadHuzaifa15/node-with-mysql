import * as Sequelize from "sequelize";
import { IUserInstance, IUserAttributes } from "./User";
import { ICredentialInstance, ICredentialAttributes } from "./Credential";
import { IAddressInstance, IAddressAttributes } from "./Address";
import { IOTPInstance, IOTPAttributes } from "./OTP";
import { IFileInstance, IFileAttributes } from "./File";

export interface IModelFactory extends Sequelize.Models {
  user: Sequelize.Model<IUserInstance, IUserAttributes>;
  credential: Sequelize.Model<ICredentialInstance, ICredentialAttributes>;
  address: Sequelize.Model<IAddressInstance, IAddressAttributes>;
  otp: Sequelize.Model<IOTPInstance, IOTPAttributes>;
  file: Sequelize.Model<IFileInstance, IFileAttributes>;
}
