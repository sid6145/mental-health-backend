const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image: {
        type: String
    }
})

module.exports = mongoose.model("Activity", activitySchema)