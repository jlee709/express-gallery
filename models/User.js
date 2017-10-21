//jshint esversion: 6

module.exports = function(sequelize, DataTypes){
  const User = sequelize.define('user', {
    username: {type: DataTypes.STRING, unique: true},
    link: DataTypes.STRING,
    description: DataTypes.STRING,
    password: DataTypes.STRING,
    email:{
      type: DataTypes.STRING,
      validate:{
        isEmail:true
      }
    }
  },{
    tableName: 'users'
  });
    User.associate = function(models){
    User.hasMany(models.photo);
  };
  return User;
};