const mongoose = require("mongoose");


const userschema = new mongoose.Schema({
    full_name : {
        type : String,
        required : true,
    },
    mobile_number : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
});


module.exports = new mongoose.model('user', userschema);