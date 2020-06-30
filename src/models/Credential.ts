import * as bcrypt from "bcryptjs";
const { TE, to } = require("../utils/serviceUtil");

module.exports = (sequelize: any, DataTypes: any) => {
  const credential = sequelize.define("credential", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN,
  });

  credential.beforeSave(async (param: any, options: any) => {
    let err;
    if (param.changed("password")) {
      let salt, hash;
      [err, salt] = await to(bcrypt.genSalt(10));
      if (err) TE(err.message, true);

      [err, hash] = await to(bcrypt.hash(param.password, salt));
      if (err) TE(err.message, true);

      param.password = hash;
    }
  });

  credential.prototype.comparePassword = async function (pw: any) {
    let err, pass;
    if (!this.password) TE("password not set");

    [err, pass] = await to(bcrypt.compare(pw, this.password));
    if (err) TE(err);

    if (!pass) TE("invalid password");

    return this;
  };

  return credential;
};
