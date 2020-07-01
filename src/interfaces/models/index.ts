import * as Sequelize from "sequelize";
import { IUserInstance, IUserAttributes } from "./User";
import { ICredentialInstance, ICredentialAttributes } from "./Credential";
import { IAddressInstance, IAddressAttributes } from "./Address";

export interface IModelFactory extends Sequelize.Models {
  user: Sequelize.Model<IUserInstance, IUserAttributes>;
  credential: Sequelize.Model<ICredentialInstance, ICredentialAttributes>;
  address: Sequelize.Model<IAddressInstance, IAddressAttributes>;
}
