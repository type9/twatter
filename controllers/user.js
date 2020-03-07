const User = require('../models/user');
const Tweet = require('../models/tweet');
const users = require('express').Router();

const url = require('url');
const querystring = require('querystring');
const apikey = require('uuid-apikey');

//Authentication step
let checkAuth = (req, res, next) => {
    queries = querystring.parse(url.parse(req.url).query);
    key = queries.key;
    if(key == undefined || key == null) {
        console.log("Key missing");
        res.message = "Key missing";
        res.status(400).end();
        return;
    }
    if(!apikey.isAPIKey(key)){ //checks for invalid key format
        console.log("Key invalid");
        res.message = "Invalid key format";
        res.status(400).end();
        return;
    }
    User.findOne({key: key})
        .then(user => { // if we find the user by the key, they're now authenticated
            if (user) {
                next();
            } else { // else we called unauthorized
                res.status(401);
            }
        })
        .catch(err => {
            console.log(err.message);
        });
};
users.use(checkAuth);

users.get('/retweets', (req, res, next) => {
    User.findOne({key: key}).populate('retweets')
        .then(user => {
            res.status(200);
            res.send(user.retweets);
        });
});

//Retweet route
users.post('/retweet/:tweetId', (req, res, next) => {
    if(req.params.tweetId == null || req.params.tweetId == undefined) {
        res.message = "Invalid tweet id";
        res.status(400).end();
        return;
    }
    Promise.all([User.findOne({key: key}), Tweet.findById(req.params.tweetId)])
        .then(([user, tweet]) => {
            console.log("FOUND STUFF");
            user.retweets.addToSet(tweet._id);
            tweet.retweets.addToSet(user._id);
            Promise.all([user.save(), tweet.save()])
                .then(data => {
                    res.status(200).end()
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