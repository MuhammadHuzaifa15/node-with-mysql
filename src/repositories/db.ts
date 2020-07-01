import { Database } from "../models/index";
import { Transaction } from "sequelize";

export const getTransaction = async (): Promise<Transaction> => {
  return Database.transaction();
};
