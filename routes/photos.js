//jshint esversion: 6

const express = require('express');
const app = express();
const route = express.Router();
const db = require('../models');
const User = db.user;
const Photo = db.photo;

//home route
route.get('/' , (req, res) =>{
  let value = req.isAuthenticated();
  console.log(value);
  return Photo.findAll()
  .then((photos)=>{
    let username = req.user ? req.user.username : null;
    let locals = {
    photos: photos,
    id: username,
    auth: value
    };
    return res.render('allphotos', locals);
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

route.get('/:id/edit', (req, res) =>{
  let photoId = req.params.id;

  return Photo.findById(photoId, {raw: true})
  .then((photo) => {
    console.log(photo, 'HA{OF:H:AH:AB:ABG:AH"LAN:AOHF:HF');
    return res.render('edit', {photo: photo});
  });
});

//UNDER MAINTAITNNCE - updates too many photos

route.put('/:id/edit', (req,res) => {
  let photoId = req.params.id;
  let photoTitle = req.body.title;
  let photoLink = req.body.link;

  return Photo.update({title: photoTitle, link: photoLink}, {where:{id: photoId}})
  .then((updatedPhoto) => {
    console.log(updatedPhoto, " XXXXXXXXX******XXXXXXXXXX");
  return res.json("updatedPhoto");
  });
 });

route.delete('/:id/delete', isAuthenticated, (req, res) => {
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