const Tweet = require('../models/tweet');
const Handle = require('../models/handle');
const tweets = require('express').Router({mergeParams: true});

var {PythonShell} = require('python-shell');

//Generate new tweet from handle
tweets.get('/generate', (req, res) => {
    let gen_options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: './dependencies',
        args: [req.params.handle, '1000', '2', false]
    };
    PythonShell.run('tweet_markov_gen.py', gen_options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution

        let tweet = new Tweet();
        tweet.text = results[0];
        tweet
            .save()
            .then(tweet => { //initial check if we already have the handle
                return Promise.all([Handle.find({name: req.params.handle}), tweet]);
            })
            .then(([handle, tweet]) => {
                console.log(handle);
                if (handle.length == 0){ //if we don't have the handle we make a new one
                    handle = new Handle();
                    handle.name = req.params.handle;
                    return Promise.all([handle.save(), tweet]);

                } else { // if we do we return it
                    return [handle, tweet];
                }
            }) 
            .then(([handle, tweet]) => { // query for the handle object
                console.log("Handle query");
                return Promise.all([Handle.findOne({name: req.params.handle}), tweet]);
            })
            .then(([handle, tweet]) => { // bind the tweet to the handle and redirect
                console.log(handle)
                handle.tweets.unshift(tweet._id);
                handle.save()
                res.redirect(`/${handle.name}/twatted/${tweet._id}`);
            })
            .catch(err => {
                console.log(err.message);
            });
    });     
});

//tweet index
tweets.get('/', (req, res, next) => {
    let handle = req.handle;
});

//Specific handle's tweet
tweets.get('/:tweetId', (req, res, next) => {
    let handle = req.handle;
    let tweetId = req.params.tweetId;
    tweet = Tweet.findById(req.params.tweetId)
        .then(tweet => {
            res.send(`${req.params.handle}: "${tweet.text}"`);
        });
});

module.exports = tweets;