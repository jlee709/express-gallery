//jshint esversion: 6

const express = require('express');
const app = express();
const route = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../models');
const User = db.user;
const Photo = db.photo;

route.get('/' , (req, res) =>{
  return User.findAll()
  .then((users)=>{
    return res.json(users);
  });
});
//REGISTER ROUTE
app.get('/register',(req,res)=>{
  res.render('edit');
});

app.post('/register', (req,res) =>{
  bcrypt.genSalt(saltRounds, function(err,salt){
    bcrypt.hash(req.body.password, salt, function(err, hash){
      db.users.create({
        username: req.body.username,
        password: hash
      })
      .then( (user) => {
        console.log(user);
        res.redirect('/');
      })
      .catch((err) => {
        return res.send('Stupid Username'); 
      });
    });
  });
});

//LOGIN ROUTE
app.get('/login',(req,res)=>{
  res.render('home');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/'
  }));

app.get('/logout', (req,res) =>{
  req.logout();
  req.sendStatus(200);
});

//SECRET ROUTE
function isAuthenticated(req, res, next){
  console.log(req.isAuthenticated());
  if(req.isAuthenticated()){next();}
  else{res.redirect('/');}
}
app.get('/secret', isAuthenticated, (req,res)=>{
  console.log('req.user: ', req.user);
  console.log('req.user id: ', req.user.id);
  console.log('req.username: ', req.user.username);
  console.log('req.user.password: ', req.user.password);
  res.send('you found the secret');
});


//ID ROUTE
route.get('/:id' , (req, res) =>{
  const userId = req.params.id;
  return User.findById(userId, {
    include: [{model: Photo }]
  }).then(userWithPhotos => {
    return res.json(userWithPhotos);
  });
});






module.exports = route;