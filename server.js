//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const db = require('./models');
// const User = db.user;
// const Gallery = db.gallery;
const app = express();
const PORT = process.env.PORT || 3000;
const photosRoute = require('./routes/photos');


app.use(bodyParser.urlencoded({extended: true}));
app.engine('.hbs', exphbs({defaultLayout: 'main', extName: '.hbs'}));
app.set('view engine', '.hbs');

app.get('/' , (req, res) =>{
  res.json('SMOKE TESTTTTT');
});

// app.use('/photos', photosRoute);

const server = app.listen(PORT, () => {
  console.log(`Server is Listening on port: ${PORT}`);
});