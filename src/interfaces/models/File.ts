import { Instance } from "sequelize";

export interface IFileAttributes {
  id?: string;
  path: string;
  contentType: string;
  isDeleted?: boolean;
}

export interface IFileInstance extends Instance<IFileAttributes> {
  dataValues: IFileAttributes;
}
