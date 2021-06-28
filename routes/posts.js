const router = require('express').Router()
const Post = require('../models/Post')
const multer = require('multer')


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "../client/public/uploads/");
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
})

const upload = multer({storage: storage});

router.post("/", upload.single("postImage"), async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        postImage: req.file.originalname
    });

    const savedPost = await post.save()
    res.json(savedPost)
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
