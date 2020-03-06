var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HandleSchema = new Schema ({
    name: String,
    tweets : [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
    meta: {
        retweets: Number
    }
});

module.exports = mongoose.model("Handle", HandleSchema);