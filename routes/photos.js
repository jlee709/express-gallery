//jshint esversion: 6

const express = require('express');
const app = express();
const route = express.Router();
const db = require('../models');
const User = db.user;
const Photo = db.photo;

route.get('/' , (req, res) =>{
  res.json('Photos page');
});

route.post('/', (req, res) => {
  let body = req.body;
  return User.create({
    username: body.username,
    link: body.link,
    description: body.description
  })
  .then((newUser) => {
    return res.json(newUser);
  }); 
});

module.exports = route;