import * as Sequelize from "sequelize";
import {
  ICredentialInstance,
  ICredentialAttributes,
} from "../interfaces/models/Credential";

/**
 * Defining main sequelize function for binding on the model index
 *
 * @param {Sequelize.Sequelize} sequelize
 * @returns
 */
export default function (
  sequelize: Sequelize.Sequelize
): Sequelize.Model<ICredentialInstance, ICredentialAttributes> {
  const credential = sequelize.define<
    ICredentialInstance,
    ICredentialAttributes
  >("credential", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return credential;
}
