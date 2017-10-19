//jshint esversion: 6

module.exports = function(sequelize, DataTypes){
  const User = sequelize.define('user', {
    username: DataTypes.STRING,
    link: DataTypes.STRING,
    description: DataTypes.STRING
  },{
    tableName: 'users'
  });
    User.associate = function(models){
    User.hasMany(models.photo);
  };
  return User;
};