const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String

    }, 
    postImage:{
        type: String
    },

    cloudinary_id:{
        type: String
    }

})

module.exports = mongoose.model("Post", PostSchema)