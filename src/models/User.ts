import * as bcrypt from "bcryptjs";
const jwt = require("jsonwebtoken");
const { TE, to } = require("../utils/serviceUtil");
const CONFIG = require("../../config/config");

module.exports = (sequelize: any, DataTypes: any) => {
  const Model = sequelize.define("User", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: { isEmail: { msg: "Email invalid." } },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        len: { args: [7, 20], msg: "Phone number invalid, too short." },
        isNumeric: { msg: "not a valid phone number." },
      },
    },
    password: DataTypes.STRING,
  });

  Model.beforeSave(async (user: any, options: any) => {
    let err;
    if (user.changed("password")) {
      let salt, hash;
      [err, salt] = await to(bcrypt.genSalt(10));
      if (err) TE(err.message, true);

      [err, hash] = await to(bcrypt.hash(user.password, salt));
      if (err) TE(err.message, true);

      user.password = hash;
    }
  });

  Model.prototype.comparePassword = async function (pw: any) {
    let err, pass;
    if (!this.password) TE("password not set");

    [err, pass] = await to(bcrypt.compare(pw, this.password));
    if (err) TE(err);

    if (!pass) TE("invalid password");

    return this;
  };

  Model.prototype.getJWT = function () {
    let expiration_time = parseInt(CONFIG.jwt_expiration);
    return (
      "Bearer " +
      jwt.sign({ user_id: this.id }, CONFIG.jwt_encryption, {
        expiresIn: expiration_time,
      })
    );
  };

  Model.prototype.toWeb = function (pw: any) {
    let json = this.toJSON();
    return json;
  };

  return Model;
};
