const router = require('express').Router();
const User = require('../models/UserAuth');
const {userRegisterValidation, userLoginValidation} = require('../validation')
const verify = require('./verifyToken')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");



// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, "../client/public/uploads/");
//     },
//     filename: (req, file, callback) => {
//         callback(null, file.originalname);
//     }
// })

// const upload = multer({storage: storage});


router.get("/profile",verify ,async (req, res) => {
    const userProfile = await User.findById({_id:req.user._id})
    res.json(userProfile)

})

router.put(
    "/profile",
    [verify, upload.single("userImage")],
    async (req, res) => {
      const _id = req.user._id;
      try {
        let user = await User.findById({ _id: _id });
  
        await cloudinary.uploader.destroy(user.cloudinary_id);
        const result = await cloudinary.uploader.upload(req.file.path);
  
        const profile = await User.findOneAndUpdate(
          { _id: _id },
          {
            userImage: result.secure_url || user.docImage,
            cloudinary_id: result.public_id || user.cloudinary_id,
          }
        );
        res.send(profile);
      } catch (err) {
        console.log(err);
      }
    }
  );


router.post("/register", upload.single("userImage"), async (req, res) => {

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

    const result = await cloudinary.uploader.upload(req.file.path);

    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        userImage: result.secure_url,
        cloudinary_id: result.public_id,
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