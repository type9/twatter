const Tweet = require('../models/tweet');
const Handle = require('../models/handle');
const tweets = require('express').Router({mergeParams: true});

//
const users = require('./user');

var {PythonShell} = require('python-shell');

//Tweet index
tweets.get('/', (req, res, next) => {
    Handle.findOne({name: req.params.handle}).populate('tweets')
        .then( tweets => {
            res.status(200);
            res.send(tweets);
        })
});

//Generate new tweet from handle
tweets.get('/generate', (req, res) => {
    console.log("Generation route")
    let gen_options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: './dependencies',
        args: [req.params.handle, '1000', '2', false]
    };
    PythonShell.run('tweet_markov_gen.py', gen_options, (err, results) => {
        if (err) throw err;

        let tweet = new Tweet();
        tweet.text = results[0];
        tweet
            .save()
            .then(tweet => {
                return Promise.all([Handle.findOne({name: req.params.handle}), tweet]);
            })
            .then(([handle, tweet]) => { // bind the tweet to the handle and redirect
                console.log("HANDLE: " + handle.name);
                handle.tweets.unshift(tweet._id);
                handle.save();
                res.status(201);
                res.redirect(`/${handle.name}/twatted/${tweet._id}`);
            })
            .catch(err => {
                console.log(err.message);
            });
    });     
});

//Specific handle's tweet
tweets.get('/:tweetId', (req, res, next) => {
    console.log("Specific tweet route");
    let handle = req.params.handle;
    let tweetId = req.params.tweetId;
    tweet = Tweet.findById(req.params.tweetId)
        .then(tweet => {
            if(tweet !== null){
                res.status(200);
                console.log(handle);
                res.render('partials/tweet', {
                    handle: handle,
                    tweet: tweet.text,
                });
            } else {
                res.status(404);
            }
        });
});

// tweets.get('/:tweetId/retweet', (req, res, next) => {
//     console.log("Retweet route");
//     tweet = Tweet.findById(req.params.tweetId)
//         .then(tweet => {
//             req.tweet = tweet;
//             next();
//         });
// });


module.exports = tweets;