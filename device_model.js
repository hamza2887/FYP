const mongoose = require("mongoose");


const deviceschema = new mongoose.Schema({
    name : [{
        type : String,
        required : true,
    }],
    
    status : [{
        type : Boolean,
        required : true,
    }],
});


module.exports = new mongoose.model('device', deviceschema);