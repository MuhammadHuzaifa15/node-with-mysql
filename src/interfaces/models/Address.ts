import { Instance } from "sequelize";

export interface IAddressAttributes {
  id?: string;
  deliveryAddress: string;
  type: string;
  area: string;
  city: string;
  additionalInfo: string;
  isDeleted: boolean;
}

export interface IAddressInstance extends Instance<IAddressAttributes> {
  dataValues: IAddressAttributes;
}
