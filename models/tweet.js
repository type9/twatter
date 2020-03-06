var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new Schema ({
    text: String,
    retweeters : [{ type: Schema.Types.ObjectId, ref: "Users" }],
    meta: {
        retweets: Number
    }
});

module.exports = mongoose.model("Tweet", TweetSchema);