const User = require('../models/user');
const auths = require('express').Router();

const apikey = require('uuid-apikey');

auths.use('/newkey', (req, res, next) => {
    user = User();
    user.key = apikey.create({'noDashes': true}).apiKey.toLowerCase();
    user
        .save()
        .then(user => {
            res.status(200);
            res.send(user.key);
        });
});

module.exports = auths;