module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user", {
    user_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    user_nickname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    user_password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    user_phone: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    user_profile_image: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  });
};
