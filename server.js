// jshint esversion:6
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('./models');
const User = db.user;
const Photo = db.photo;
const photosRoute = require('./routes/photos');
const redis = require('connect-redis')(session);
const usersRoute = require('./routes/users');
const LocalStrategy = require('passport-local').Strategy;
const saltRounds = 12;
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.engine('.hbs', exphbs({defaultLayout: 'main', extName: '.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static('assets'));

//PASSPORT - AUTHORIZATION
app.use(session({
  store: new redis(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user,done) => {
  console.log("serializing");
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser((user, done) => {
  console.log('deserializing');
  User.findOne({where: { id: user.id}})
  .then(user => {
    return done(null, {
      id: user.id,
      username: user.username
    });
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({where: { username: username } })
    .then( user => {
      if(user === null) {
        return done(null, false, {message: 'bad username or password'});
      }
      else { 
        bcrypt.compare(password, user.password)
        .then (res => {
          console.log(res);
          if (res) {return done(null, user); }
          else {
            return done(null, false, {message: 'bad username or password'});
          }
        });
      }
    })
    .catch(err => {
      console.error('error: ', err);
  });
}));

app.get('/' , (req, res) =>{
  console.log("***********************",req.user);
  return Photo.findAll({raw:true})
  .then((data)=>{
    return res.render('home',{photos: data});
  });
});

app.get('/home' , (req, res) =>{
  return Photo.findAll({raw:true})
  .then((data)=>{
    return res.render('home',{photos: data});
  });
});

app.use('/photos', photosRoute);
app.use('/users', usersRoute);

app.get('/takingyoubackhome', function(req, res){
  res.render('takingYouHome');
});

app.get('*', function(req, res){
  res.render('notfound');
});


const server = app.listen(PORT, () => {
  db.sequelize.sync({force: false});
  console.log(`Server is Listening on port: ${PORT}`);
});