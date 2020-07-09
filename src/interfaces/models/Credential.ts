import { Instance } from "sequelize";

export interface ICredentialAttributes {
  id?: string;
  email: string;
  password: string;
  provider: string;
  isDeleted?: boolean;
}

export interface ICredentialInstance extends Instance<ICredentialAttributes> {
  dataValues: ICredentialAttributes;
}
