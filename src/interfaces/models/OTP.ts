import { Instance } from "sequelize";

export interface IOTPAttributes {
  id?: string;
  code: string;
  expiredUTC: string;
  type: string;
  userId?: string;
  isDeleted?: boolean;
}

export interface IOTPInstance extends Instance<IOTPAttributes> {
  dataValues: IOTPAttributes;
}
