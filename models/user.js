const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalmangoose=require("passport-local-mongoose");

const userSChema = new Schema({
    email:{
        type: String,
        required: true,
    },

});
userSChema.plugin(passportlocalmangoose);
module.exports = mongoose.model("User", userSChema);