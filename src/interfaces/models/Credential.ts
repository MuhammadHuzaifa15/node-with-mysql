import { Instance } from "sequelize";

export interface ICredentialAttributes {
  id?: number;
  email: string;
  password: string;
  isDeleted?: boolean;
}

export interface ICredentialInstance extends Instance<ICredentialAttributes> {
  dataValues: ICredentialAttributes;
}
