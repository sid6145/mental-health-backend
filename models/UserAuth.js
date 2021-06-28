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
    image:{
        type: String
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    activities:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'Activity'
    }],
  

});

module.exports = mongoose.model('User', userSchema);