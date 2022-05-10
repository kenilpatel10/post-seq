module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "d"
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "d"
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "name"
      },

    });


    Users.associate = (models) => {
      Users.hasMany(models.Posts,{
        onDelete: "cascade",
      });
    
        Users.hasMany(models.Likes, {
          onDelete: "cascade",
        });
      
    };
    return Users;
  };
  