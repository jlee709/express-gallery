//jshint esversion: 6

module.exports = function(sequelize, DataTypes){
  const Photo = sequelize.define('photo', {
    title: DataTypes.STRING,
    link: DataTypes.STRING
  },{
    tableName: 'photos'
  });
  Photo.associate = function(models){
    Photo.belongsTo(models.user);
  };
  return Photo;
};