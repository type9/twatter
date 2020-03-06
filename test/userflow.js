const mongoose = require('mongoose');
const app = require('../server.js');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const chaiHttp = require("chai-http");
const apikey = require('uuid-apikey');

const expect = chai.expect;
const assert = chai.assert;

const User = ('../models/user');
const Auth = ('../models/auth');
const Handle = ('../models/handle');
const Tweet = ('../models/tweet');

chai.use(chaiHttp);

after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done();
});

describe('User flow', () => {
    user = {
        key: null,
    }
    request = {
        handle: 'elonmusk',
        retweet_target: null,
    }

    it('should create an api key', (done) => {
        chai.request(app)
            .get('/user/newkey')
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                user.key = res.text;
                assert.equal(res.status, 200);
                assert.equal(apikey.isAPIKey(user.key), true); // checks server returned valid key

                return done();
            })
    });
    it('should return a generated tweet from handle', (done) => {
        chai.request(app)
            .get('/' + request.handle + '/generate')
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                
                assert.equal(res.status, 200);

                request.retweet_target = JSON.parse(res.text)._id;
                console.log(request);
                return done();
            });
    }).timeout(5000);
    it('should let us retweet the tweet that has been generated', (done) => {
        chai.request(app)
            .get(`/user/retweet/${request.retweet_target}/?key=${user.key}`)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                console.log(`/user/retweet/${request.retweet_target}/?key=${user.key}`);
                assert.equal(res.status, 200);

                return done();
            });
    }).timeout(5000);
    it('should show the retweet on our retweets', (done) => {
        chai.request(app)
            .get(`/user/retweets/?key=${user.key}`)
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                assert.equal(res.status, 200);
                assert.isAtLeast(res.text.length, 1); //has 1 retweet
                
                return done();
            })
    });
})