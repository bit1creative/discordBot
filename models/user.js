var mongoose = require('mongoose');

var UserSchema= new mongoose.Schema(
    {discordID: String,
     count: Number
        },
    {versionKey: false}
);


const User = mongoose.model("users", UserSchema);
module.exports = User;
