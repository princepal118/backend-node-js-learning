const mongoose = require('mongoose');


var photoSchema = new mongoose.Schema({
    photoUrl:
    {
       type : String,
       contentType: String,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    }

},{timestamps: true});
 
module.exports  =  mongoose.model('UserImage', photoSchema); //creating the schema for the user collection.
