//jshint esversion: 6

module.exports = function(sequelize, DataTypes){
  const Photo = sequelize.define('photo', {
    title: DataTypes.STRING,
    link: DataTypes.STRING,
    // likes: DataTypes.INTEGER - @Justin update your db table for this column:
    //this psql syntax: ALTER TABLE photos ADD COLUMN likes integer; - then uncomment the new addition
  },{
    tableName: 'photos'
  });
  Photo.associate = function(models){
    Photo.belongsTo(models.user);
  };
  return Photo;
};