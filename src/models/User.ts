const jwt = require("jsonwebtoken");

module.exports = (sequelize: any, DataTypes: any) => {
  const user = sequelize.define("user", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    gender: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN,
    type: DataTypes.ENUM("merchant", "consumer", "admin"),
    credentialId: {
      type: DataTypes.UUID,
      references: {
        model: "credentials",
        key: "id",
      },
    },
    addressId: {
      type: DataTypes.UUID,
      references: {
        model: "addresses",
        key: "id",
      },
    },
    isDeleted: DataTypes.BOOLEAN,
  });

  user.associate = function (models: any) {
    user.belongsTo(models.credential, {
      foreignKey: "credentialId",
      as: "credential",
    });
    user.belongsTo(models.address, {
      foreignKey: "addressId",
      as: "address",
    });
  };

  user.prototype.getJWT = function () {
    let expiration_time = parseInt(CONFIG.jwt_expiration);
    return (
      "Bearer " +
      jwt.sign({ user_id: this.id }, CONFIG.jwt_encryption, {
        expiresIn: expiration_time,
      })
    );
  };

  user.prototype.toWeb = function (pw: any) {
    let json = this.toJSON();
    return json;
  };

  return user;
};
