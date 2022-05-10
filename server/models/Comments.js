module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define("Comments", {
      commentText: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "name"
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    });
    
    return Comments;
  };
  