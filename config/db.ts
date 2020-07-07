import { Database } from "../src/models";
const CONFIG = require("../config/config");

const connectDB = async () => {
  Database.authenticate()
    .then(() => {
      console.log("Connected to SQL database:", CONFIG.db_name);
    })
    .catch((err: any) => {
      console.error("Unable to connect to SQL database:", CONFIG.db_name, err);
      process.exit(1);
    });

  Database.sync({ force: true });
};

export default connectDB;
