const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const UserSchema = new Schema({
    key: String,
    retweets : [{ type: Schema.Types.ObjectId, ref: "Tweet" }]
});

module.exports = mongoose.model("User", UserSchema);