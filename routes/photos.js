//jshint esversion: 6

const express = require('express');
const app = express();
const route = express.Router();
const db = require('../models');
const User = db.user;
const Photo = db.photo;

route.get('/' , (req, res) =>{
  return Photo.findAll()
  .then((photos)=>{
    return res.json(photos);
  });
});

route.get('/:id' , (req, res) =>{
  const userId = req.params.id;
  return Photo.findById(userId,{
    include: [{ model: User }]
  })
  .then(photosByUser => {
    return res.json(photosByUser);
  });
});

route.get('/:id/new' , (req, res) =>{
  //res.render page to submit new photo
  //render form with username input, text field for description
  res.json('Add New Photo page');
});

route.post('/:id/new', (req, res) => {
  let userId = req.params.id;
  let title = req.body.title;
  let link = req.body.link;

  return User.findById(userId)
  .then( (user) => {
    return Photo.create({title: title, userId: user.id, link: link});
  })
  .then( newPhoto => {
    return res.json(newPhoto);
  });
});

module.exports = route;