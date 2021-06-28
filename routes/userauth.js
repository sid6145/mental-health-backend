const router = require('express').Router();
const User = require('../models/UserAuth');
const {userRegisterValidation, userLoginValidation} = require('../validation')
const verify = require('./verifyToken')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
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


router.get("/profile",verify ,async (req, res) => {
    const userProfile = await User.findById({_id:req.user._id})
    res.json(userProfile)

})

router.put("/profile", [upload.single("image"), verify], async(req, res) => {
    const _id = req.user._id
    try{
   const userProfile = await User.findOneAndUpdate({_id:_id},{image: req.file.originalname} )
    res.send(userProfile)
    }
    catch(err){
        console.log(err)
    }
})



router.post("/register", async (req, res) => {

    //validation
    const {error} = userRegisterValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //checking if user is already registered
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist){
        return res.status(400).send("email already exists")
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id})
    }catch(err){
        res.send(err)
    }
});


//Login
router.post('/login', async (req, res) => {
    const { error } = userLoginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    //checking if email exists
    const user = await User.findOne({email: req.body.email})
    if(!user){
        return res.status(400).send("email doesn't exist")
    }

    //password check
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass){
        return res.status(400).send("password incorrect")
    }


    //create and assign token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)

 });

module.exports = router;