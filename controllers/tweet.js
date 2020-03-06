const Tweet = require('../models/tweet');
const Handle = require('../models/handle');
const tweets = require('express').Router({mergeParams: true});

var {PythonShell} = require('python-shell');

// tweet index
tweets.get('/', (req, res, next) => {
    Handle.findOne({name: req.params.handle}).populate('tweets')
        .then( tweets => {
            res.send(tweets);
        })
});

//Generate new tweet from handle
tweets.get('/generate', (req, res) => {
    console.log(req.params);
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
                res.redirect(`/${handle.name}/twatted/${tweet._id}`);
            })
            .catch(err => {
                console.log(err.message);
            });
    });     
});

//Specific handle's tweet
tweets.get('/:tweetId', (req, res, next) => {
    console.log("Specific handle route")
    let handle = req.handle;
    let tweetId = req.params.tweetId;
    tweet = Tweet.findById(req.params.tweetId)
        .then(tweet => {
            if(tweet !== null){
                res.send(`${req.params.handle}: "${tweet.text}"`);
            } else {
                res.status(404);
            }
        });
});


module.exports = tweets;