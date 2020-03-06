var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new Schema ({
    text: String,
    retweets : [{ type: Schema.Types.ObjectId, ref: "User" }],
    meta: {
        retweets: Number
    }
});

module.exports = mongoose.model("Tweet", TweetSchema);