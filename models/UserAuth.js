const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6
    },
    email:{
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    activities:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'Activity'
    }],
    userImage:{
        type: String
    },
    cloudinary_id:{
        type: String
    }



});

module.exports = mongoose.model('User', userSchema);