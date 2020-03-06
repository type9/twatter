//REQUIREMENTS
require('dotenv').config();
const express = require('express');
const router = express.Router();
const environment = process.env.NODE_ENV; // development
const logger = require('morgan');
const session = require('express-session')
const hbs  = require('express-handlebars');
const {check, validationResult} = require('express-validator');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

//Database
require('./data/twatter-db');

//APP CONFIG
const app = express()

app.use(cookieParser());

app.engine('handlebars', hbs({defaultLayout: 'main'}));
app.engine( 'hbs', hbs( {
    extname: 'hbs',
    defaultView: 'default',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
if (environment !== 'production') {
    app.use(logger('dev'));
}

//AUTHENTICATION
var checkAuth = (req, res, next) => {
    console.log("Checking authentication");
    if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
      req.user = null;
    } else {
      var token = req.cookies.nToken;
      var decodedToken = jwt.decode(token, { complete: true }) || {};
      req.user = decodedToken.payload;
    }
  
    next();
  };
// app.use(checkAuth);

//CONTROLLERS
const handleRoutes = require('./controllers/handle.js');
const tweetRoutes = require('./controllers/tweet.js');

app.use(handleRoutes);

//LISTENER
app.listen(3030, () => {
    console.log('Twatter listening on port localhost:3030');
});