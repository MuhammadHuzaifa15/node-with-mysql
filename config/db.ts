const models = require("../src/models");
const CONFIG = require("../config/config");

const connectDB = async () => {
  models.sequelize
    .authenticate()
    .then(() => {
      console.log("Connected to SQL database:", CONFIG.db_name);
    })
    .catch((err: any) => {
      console.error("Unable to connect to SQL database:", CONFIG.db_name, err);
      process.exit(1);
    });
  if (CONFIG.app === "dev") {
    models.sequelize.sync();
  }
};

export default connectDB;
