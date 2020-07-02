import {
  ICredentialAttributes,
  ICredentialInstance,
} from "../interfaces/models/Credential";
import { Models } from "../models/index";

const Credential = Models.credential;

export const getByEmail = async (
  email: string
): Promise<ICredentialInstance | null> => {
  return Credential.findOne({ where: { email } });
};

export const create = async (
  payload: ICredentialAttributes
): Promise<ICredentialInstance> => {
  return Credential.create(payload);
};

export const updatePassword = async (id: any, password: string) => {
  return Credential.update({ password }, { where: { id, isDeleted: false } });
};
