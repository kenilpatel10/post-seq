module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "d"
      },
      password: {
        type: DataTypes.STRING(64),
        allowNull: true,
        defaultValue: "d",
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "name",
        unique: true
      },

    });


    Users.associate = (models) => {

    
        Users.hasMany(models.Likes, {
          onDelete: "cascade",
        });
        Users.hasMany(models.Comments, {
          onDelete: "cascade",
        });
      
      
    };
    return Users;
  };
  