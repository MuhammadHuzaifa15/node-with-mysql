import { IOTPAttributes, IOTPInstance } from "../interfaces/models/OTP";
import { Models } from "../models/index";
import { where } from "sequelize";
const CONFIG = require("../../config/config");
const OTP = Models.otp;

export const getByToken = async (
  code: string,
  userId: string
): Promise<IOTPInstance | null> => {
  return OTP.findOne({ where: { code, userId, isDeleted: false } });
};

export const create = async (
  payload: IOTPAttributes
): Promise<IOTPInstance> => {
  return OTP.create(payload);
};

export const update = async (code: string) => {
  return OTP.update({ isDeleted: true }, { where: { code } });
};
