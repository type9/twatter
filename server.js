//REQUIREMENTS
require('dotenv').config();
const express = require('express');
const environment = process.env.NODE_ENV; // development
const logger = require('morgan');
const hbs  = require('express-handlebars');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const jwt = require('jsonwebtoken');

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

//CONTROLLERS
const handleRoutes = require('./controllers/handle');
const userRoutes = require('./controllers/user');
const authRoutes = require('./controllers/auth')

//these routes are for creating accounts
app.use('/user', authRoutes);
//these routes require valid API key
app.use('/user', userRoutes);
//these are primary feature routes
app.use(handleRoutes);

//LISTENER
app.listen(3030, () => {
    console.log('Twatter listening on port localhost:3030');
});