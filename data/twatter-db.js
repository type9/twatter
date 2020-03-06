/* Mongoose Connection */
require('dotenv').config()
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/your-app-name');
assert = require("assert");

const url = "mongodb://localhost/twatter-db";
mongoose.Promise = global.Promise;
mongoose.connect(
  url,
  { useNewUrlParser: true },
  function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to database");

    // db.close(); turn on for testing
  }
);
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection Error:"));
mongoose.set("debug", true);

module.exports = mongoose.connection;