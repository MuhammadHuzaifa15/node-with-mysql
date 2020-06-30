module.exports = (sequelize: any, DataTypes: any) => {
  const address = sequelize.define("address", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
    },
    deliveryAddress: DataTypes.STRING,
    type: DataTypes.ENUM("home", "work", "other"),
    area: DataTypes.STRING,
    city: DataTypes.ENUM("karachi", "lahore", "islamabad", "hyderabad"),
    additionalInfo: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN,
  });

  return address;
};
