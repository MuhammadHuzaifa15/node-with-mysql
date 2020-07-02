import { IOTPAttributes, IOTPInstance } from "../interfaces/models/OTP";
import { Models } from "../models/index";
const OTP = Models.otp;

export const getByToken = async (
  code: string,
  type: string,
  userId?: string
): Promise<IOTPInstance | null> => {
  let criteria: any = {};
  criteria = { code, type };
  criteria.isDeleted = false;
  if (userId) criteria.userId = userId;
  return OTP.findOne({ where: criteria });
};

export const create = async (
  payload: IOTPAttributes
): Promise<IOTPInstance> => {
  return OTP.create(payload);
};

export const update = async (code: string, type: string) => {
  return OTP.update({ isDeleted: true }, { where: { code, type } });
};
