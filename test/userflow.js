const mongoose = require('mongoose');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const chaiHttp = require("chai-http");

const assert = chai.assert

const User = ('../models/user');
const Auth = ('../models/auth');
const Handle = ('../models/handle');
const Tweet = ('../models/tweet');

chai.should();
chai.use(chaiHttp);