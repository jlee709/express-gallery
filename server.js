//jshint esversion:6
// http://167.216.21.3:3000/ - justin ip 
// 167.216.15.198:3000 - baseems ip

const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const db = require('./models');
const User = db.user;
const Photo = db.photo;
const photosRoute = require('./routes/photos');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.engine('.hbs', exphbs({defaultLayout: 'main', extName: '.hbs'}));
app.set('view engine', '.hbs');

app.get('/' , (req, res) =>{
  res.json('SMOKE TESTTTTT');
});

app.use('/photos', photosRoute);

const server = app.listen(PORT, () => {
  db.sequelize.sync({force: false});
  console.log(`Server is Listening on port: ${PORT}`);
});