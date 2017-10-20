//jshint esversion: 6

const express = require('express');
const app = express();
const route = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../models');
const User = db.user;
const Photo = db.photo;
const saltRounds = 12;

route.get('/' , (req, res) =>{
  return User.findAll()
  .then((users)=>{
    return res.render('users', {userWithPhotos: users});
  });
});
//REGISTER ROUTE
route.get('/register',(req,res)=>{
  res.render('register');
});

route.post('/register', (req,res) =>{
  bcrypt.genSalt(saltRounds, function(err,salt){
    bcrypt.hash(req.body.password, salt, function(err, hash){
      db.user.create({
        username: req.body.username,
        password: hash
        // link: req.body.link,
        // description: req.body.description
      })
      .then( (user) => {
        console.log(user);
        res.redirect('/users/login');
      })
      .catch((err) => {
        return res.send('Username has been taken'); 
      });
    });
  });
});

//LOGIN ROUTE
route.get('/login',(req,res)=>{
  res.render("login");
});

route.post('/login', passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/'
  }));

route.get('/logout', (req,res) =>{
  req.logout();
  req.sendStatus(200);
});

//SECRET ROUTE
function isAuthenticated(req, res, next){
  console.log(req.isAuthenticated());
  if(req.isAuthenticated()){next();}
  else{res.redirect('/');}
}
route.get('/secret', isAuthenticated, (req,res)=>{
  console.log('req.user: ', req.user);
  console.log('req.user id: ', req.user.id);
  console.log('req.username: ', req.user.username);
  console.log('req.user.password: ', req.user.password);
  res.json('you found the secret');
});


// ID ROUTE
route.get('/:id' , (req, res) =>{
  const userId = req.params.id;
  return User.findById(userId, {
    include: [{model: Photo }]
  }).then(userWithPhotos => {
    return res.render('users', {userWithPhotos: userWithPhotos});
  });
});






module.exports = route;