const mongoose = require('mongoose')
const VideoLinkSchema = new mongoose.Schema({
    link: {
        type:String,
        required: true
    }
})

module.exports = mongoose.model("VideoLink", VideoLinkSchema)