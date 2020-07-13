import * as Sequelize from "sequelize";
import { IFileInstance, IFileAttributes } from "../interfaces/models/File";
import { generateId } from "../helpers/generalHelper";

/**
 * Defining main sequelize function for binding on the model index
 *
 * @param {Sequelize.Sequelize} sequelize
 * @returns
 */
export default function (
  sequelize: Sequelize.Sequelize
): Sequelize.Model<IFileInstance, IFileAttributes> {
  const file = sequelize.define<IFileInstance, IFileAttributes>("file", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: function () {
        return generateId();
      },
      allowNull: false,
    },
    path: Sequelize.STRING,
    contentType: Sequelize.STRING,
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return file;
}
