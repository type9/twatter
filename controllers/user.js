const User = require('../models/user');
const Tweet = require('../models/tweet');
const users = require('express').Router();

const url = require('url');
const querystring = require('querystring');
const apikey = require('uuid-apikey');

//Authentication step
let checkAuth = (req, res, next) => {
    queries = querystring.parse(url.parse(req.url).query);
    key = queries.key
    if(!key) {
        res.code(400);
        res.send("Key missing");
    }
    if(!apikey.isAPIKey(key)){ //checks for invalid key format
        res.code(400);
        res.send("Not a valid API key");
    }
    User.findOne({key: key})
        .then(user => { // if we find the user by the key, they're now authenticated
            if (user) {
                next();
            } else { // else we called unauthorized
                res.status(401);
            }
        });
    return;
};
users.use(checkAuth);

users.get('/retweets', (req, res, next) => {
    User.findOne({key: key}).populate('retweets')
        .then(user => {
            res.send(user.retweets);
        });
});

//Retweet route
users.get('/retweet/:tweetId', (req, res, next) => {
    Promise.all([User.findOne({key: key}), Tweet.findById(req.params.tweetId)])
        .then(([user, tweet]) => {
            user.retweets.addToSet(tweet._id);
            tweet.retweets.addToSet(user._id);
            Promise.all([user.save(), tweet.save()])
                .then(data => {
                    res.status(403).end()
                });
        })
        .catch(err => {
            console.log(err.message);
        });
});

users.get('/delete', (req, res, next) => { //TODO: Implement cascading object delete
    res.status(404);
});
module.exports = users;