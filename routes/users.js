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
  let val = req.isAuthenticated();
  return Photo.findAll()
  .then((photos)=>{
    let username = req.user ? req.user.username : null;
    let locals = {
    photos: photos,
    id: username,
    auth: val
    };
    return res.render('allphotos', locals);
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
  //console.log("***********************",req.user);
  res.render("login");
});

route.post('/login', passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/'
  }));

route.get('/logout', (req,res) =>{
  req.logout();
  res.sendStatus(200);
});

//SECRET ROUTE
function isAuthenticated(req, res, next){
  //console.log("***********************",req.user.id,"***********************");
  let id = parseInt(req.params.id);
  let userId = parseInt(req.user.id);
  //console.log(id === userId);
  if(id === req.user.id){
    req.isAuthenticated();
    next();
  }
  else{
    res.redirect('/');
    console.log('denied');}
}


// ID ROUTE
route.get('/:id' ,(req, res) =>{
  let value = req.isAuthenticated();
  console.log(value);
  const userId = req.params.id;
  return User.findById(userId, {
    include: [{model: Photo }]
  }).then(userCollection => {
    console.log(userCollection);
    let username = req.user ? req.user.username : null;
    let id = req.user ? req.user.id : null;
    let locals = {
      photos: userCollection.photos,
      id: username,
      user: id,
      auth: ((parseInt(id)===parseInt(req.params.id))===value)
    };
    console.log(locals);
    return res.render('registeredUsers', locals);
  });
});

//user adding photo route page 
route.get('/:id/new' ,isAuthenticated, (req, res) =>{
  const userId = req.params.id;
  res.render('addNewPhoto', {userId: userId});
});

// user commiting photo page 
route.post('/:id/new',isAuthenticated, (req, res) => {
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


route.get('/:id/edit', (req, res) =>{
  return Photo.findAll()
  .then((photos)=>{
    return res.render('edit', {photos: photos});
  });
});


route.put('/:id/edit', (req,res) => {
  let userId = req.params.id;
  let title = req.body.title;
  let link = req.body.link;

  return User.findById(userId)
  .then((user)=>{
    return Photo.update({title: title, link: link}, {where:{userId: user.id}})
  .then((updatedPhoto) => {
    return res.json("updatedPhoto");
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