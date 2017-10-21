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

















module.exports = route;