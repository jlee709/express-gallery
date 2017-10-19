//jshint esversion: 6

const express = require('express');
const app = express();
const route = express.Router();
const db = require('../models');
const User = db.user;
const Photo = db.photo;

route.get('/' , (req, res) =>{
  return User.findAll()
  .then((users)=>{
    return res.json(users);
  });
});

route.get('/:id' , (req, res) =>{
  const userId = req.params.id;
  return User.findById(userId, {
    include: [{model: Photo }]
  }).then(userWithPhotos => {
    return res.json(userWithPhotos);
  });
});

route.get('/new' , (req, res) =>{
  //res.render page to submit new user
  //render form with username input, text field for description
  res.json('Add New User page');
});

route.post('/new', (req, res) => {
  let username = req.body.username;
  let link = req.body.link;
  let description = req.body.description;

  return User.create({username: username, link: link, description: description})
  .then((newUser) =>{
    return res.json(newUser);
  });
 });




module.exports = route;