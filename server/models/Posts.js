module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define("Posts", {
      title: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "name"
      },
      postText: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "name"
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "name"
      },
      
    });
    
    Posts.associate = (models) => {
      Posts.hasMany(models.Comments, {
        onDelete: "cascade",
      });
 
    Posts.hasMany(models.Likes, {
        onDelete: "cascade",
      });
    
    };
    return Posts;
  };
