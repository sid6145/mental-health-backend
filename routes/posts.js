const router = require('express').Router()
const Post = require('../models/Post')
const upload = require('../utils/multer')
const cloudinary = require('../utils/cloudinary')



router.post("/", upload.single("postImage"), async (req, res) => {
    
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
    
    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        postImage: result.secure_url,
        cloudinary_id: result.public_id
    });

    const savedPost = await post.save()
    res.json(savedPost)
    }catch(err){
        console.log(err)
    }
})

// router.post("/comment/:_id", async (req, res) => {
//     const comment = new Comment({
//         comment: req.body.comment
//     })

//     const savedComment = await comment.save()
//     const posts = await Post.findOne({_id:req.params._id})
//     posts.comments.push(savedComment)
//     const savedPost = await posts.save()
//     res.json(savedPost)

// })


router.get("/", async (req, res) => {
    const posts = await Post.find()
    res.json(posts)
})

// router.get("/:_id", async (req, res) => {
//     const posts = await Post.findOne({_id:req.params._id})
//     .populate("comments")
//     res.json(posts)

// })


module.exports = router
