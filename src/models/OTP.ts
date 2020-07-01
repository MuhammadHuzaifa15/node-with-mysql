import * as Sequelize from "sequelize";
import { IOTPInstance, IOTPAttributes } from "../interfaces/models/OTP";
import { generateId } from "../helpers/generalHelper";

/**
 * Defining main sequelize function for binding on the model index
 *
 * @param {Sequelize.Sequelize} sequelize
 * @returns
 */
export default function (
  sequelize: Sequelize.Sequelize
): Sequelize.Model<IOTPInstance, IOTPAttributes> {
  const otp = sequelize.define<IOTPInstance, IOTPAttributes>("otp", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: function () {
        return generateId();
      },
      allowNull: false,
    },
    code: Sequelize.STRING,
    expiredUTC: Sequelize.STRING,
    userId: Sequelize.STRING,
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return otp;
}
