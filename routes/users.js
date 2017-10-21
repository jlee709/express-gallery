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
    return res.render('users', {users: users});
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

  let userId = req.user.id;
  let ID = parseInt(req.params.id);

  console.log(userId,"XXXXZZZZZZXXXXXXZZZXXXX");
  console.log(ID,"XXXXZZZZZZXXXXXXZZZXXXX");
  console.log(ID === userId, 'XXXXXXXXXXXX');
  if(userId === ID){
  console.log(req.isAuthenticated());
  if(req.isAuthenticated()){next();}
  else{res.redirect('/');}
  }
}
 
route.get('/secret', isAuthenticated, (req,res)=>{
  // console.log('req.user: ', req.user);
  // console.log('req.user id: ', req.user.id);
  // console.log('req.username: ', req.user.username);
  // console.log('req.user.password: ', req.user.password);
  res.json('you found the secret');
});

// ID ROUTE
route.get('/:id' , (req, res) =>{
  const userId = req.params.id;
  return User.findById(userId, {
    include: [{model: Photo }]
  }).then(userWithPhotos => {
    return res.render('registeredUsers', {userWithPhotos: userWithPhotos});
  });
});

//user adding photo route page 
route.get('/:id/new' , isAuthenticated, (req, res) =>{
  const userId = req.params.id;
  res.render('addNewPhoto', {userId: userId});
});


// user commiting photo page 
route.post('/:id/new', (req, res) => {
  
  let userId = req.params.id;
  let title = req.body.title;
  let link = req.body.link;

  return User.findById(userId)
  .then( (user) => {
    return Photo.create({title: title, userId: user.id, link: link});
  })
  .then( newPhoto => {
    return res.redirect(`http://localhost:3000/users/${userId}`);
  });
});

module.exports = route;