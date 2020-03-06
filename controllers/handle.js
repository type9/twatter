const Handle = require('../models/handle');
const handles = require('express').Router();
const tweets = require('./tweets').Router();

//Handle index
handles.get('/', (req, res, next) => {

});

//Get all tweets under a handle
handles.get('/:handle', (req, res, next) => {
    handle = req.params.handle;
});

//Forwarding route to tweet
handle.use('/:handle/twatted', (req, res, next) => {
    Handle.findOne({name: req.params.handle})
        .then(handle => {
            if (handle == null){
                res.status(204);
            }else {
                next(handle);
            }
        })
}, tweets);

//Generate new tweet from handle
handle.use('/:handle/generate', (req, res, next) => {

    Handle.findOne({name: req.params.handle})
        .then(handle => {
            if(handle !== null){ // if we already have that handle
                req.handle = handle;
                next();
            } else { // if we need to make it
                newHandle = new Handle();
                newHandle.name = req.params.handle;
                newHandle.save()
                    .then(newHandle => {
                        req.handle = newHandle;
                        next();
                    });
            }
        })
}, tweets);



module.exports = handles;