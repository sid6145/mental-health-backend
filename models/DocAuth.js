const mongoose = require('mongoose')



const DoctorSchema = new mongoose.Schema({
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
    specialization:{
        type: String,
        required: true,
    },
    appointments:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'Appointment'
    }],
    availability:{
        type: String
    },
    docImage:{
        type: String
    },
    cloudinary_id:{
        type: String
    }
});


module.exports = mongoose.model('Doctor', DoctorSchema);
