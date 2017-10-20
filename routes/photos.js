//jshint esversion: 6

const express = require('express');
const app = express();
const route = express.Router();
const db = require('../models');
const User = db.user;
const Photo = db.photo;
//home route
route.get('/' , (req, res) =>{
  return Photo.findAll()
  .then((photos)=>{
    return res.render('allphotos', {photos: photos});
  });
});


function isAuthenticated(req, res, next){
  console.log("***********************",req.user.id,"***********************");
  let id = parseInt(req.params.id);
  let userId = parseInt(req.user.id);
  console.log(id === userId);
  if(id === req.user.id){
    req.isAuthenticated();
    next();
  }
  else{
    res.redirect('/');
    console.log('denied');}
}

//show all photos from user id
route.get('/:id' , (req, res) =>{
  const userId = req.params.id;
  return Photo.findById(userId,{
    include: [{ model: User }]
  })
  .then(photosByUser => {
    return res.json(photosByUser);
  });
});

route.get('/:id/edit' ,isAuthenticated, (req, res) =>{
  //res.render page to submit new photo
  //render form with username input, text field for description
  res.json('Edit Photo Page');
});


route.put('/:id/edit',isAuthenticated, (req,res) => {
  let userId = req.params.id;
  let title = req.body.title;
  let link = req.body.link;

  return User.findById(userId)
  .then((user)=>{
    return Photo.update({title: title, link: link}, {where:{userId: id}})
  .then((updatedPhoto) => {
    return res.json(updatedPhoto);
  });
});
});

route.delete('/:id/edit',isAuthenticated, (req, res) => {
  let userId = req.params.id;

  return Photo.findById(userId)
  .then((user) => {
    return Photo.destroy({where:{userId: user.id}})
    .then(()=>{
      return res.redirect('/:id');
    });
  });
});
















module.exports = route;