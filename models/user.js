const mongoose = require("mongoose");

const UserSchema = new Schema({
    key: Number
});

module.exports = mongoose.model("User", UserSchema);