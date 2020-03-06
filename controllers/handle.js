const Handle = require('../models/handle');
const handles = require('express').Router();
const tweets = require('./tweet');

//Handle index
handles.get('/', (req, res, next) => {
    res.statusCode(200);
});

//Forwarding route to tweet
handles.use('/:handle/twatted', (req, res, next) => {
    Handle.findOne({name: req.params.handle})
        .then(handle => {
            if (handle == null){ //handle has no tweets or doesn't exist
                res.status(204);
            }else {
                next();
            }
        })
}, tweets);

//Generate new tweet from handle
handles.use('/:handle', (req, res, next) => {
    console.log("Tweet generation routes")
    Handle.findOne({name: req.params.handle})
        .then(handle => {
            if(handle){ // if we already have that handle
                console.log("Go to tweet router");
                next();
            } else {
                console.log("Make new handle");
                newHandle = new Handle();
                newHandle.name = req.params.handle;
                newHandle
                    .save()
                    .then(newHandle => {
                        next();
                    });
            }
        })
        .catch(err => {
            console.log(err.message);
        });
}, tweets);


module.exports = handles;