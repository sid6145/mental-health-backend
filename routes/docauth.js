const router = require("express").Router();
const Doctor = require("../models/DocAuth");
const {
  doctorRegisterValidation,
  doctorLoginValidation,
} = require("../validation");
const verify = require("../routes/verifyToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");

//doctors profiles
router.get("/profile", verify, async (req, res) => {
  const profile = await Doctor.findById(req.user);
  res.json(profile);
});

router.put("/profile/availability", verify, async (req, res) => {
  const availability = await Doctor.findOneAndUpdate(
    { _id: req.user._id },
    {
      availability: req.body.availability,
    }
  );

  res.send(availability);
});

router.put(
  "/profile",
  [verify, upload.single("docImage")],
  async (req, res) => {
    const _id = req.user._id;
    try {
      let doctor = await Doctor.findById({ _id: _id });

      await cloudinary.uploader.destroy(doctor.cloudinary_id);
      const result = await cloudinary.uploader.upload(req.file.path);

      const profile = await Doctor.findOneAndUpdate(
        { _id: _id },
        {
          docImage: result.secure_url || doctor.docImage,
          cloudinary_id: result.public_id || doctor.cloudinary_id,
        }
      );
      res.send(profile);
    } catch (err) {
      console.log(err);
    }
  }
);

//to get all doctors profiles for doctors list page
router.get("/register", async (req, res) => {
  const doctor = await Doctor.find();
  res.json(doctor);
});

router.post("/register", upload.single("docImage"), async (req, res) => {
  //validation
  const { error } = doctorRegisterValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checking if doctor is already registered
  const emailExist = await Doctor.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("email already exists");
  }

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const result = await cloudinary.uploader.upload(req.file.path);

  //create new doctor
  const doctor = new Doctor({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    specialization: req.body.specialization,
    docImage: result.secure_url,
    cloudinary_id: result.public_id,
  });
  try {
    const savedUser = await doctor.save();
    res.send({ doctor: doctor._id });
  } catch (err) {
    res.send(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  const { error } = doctorLoginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checking if email exists
  const doctor = await Doctor.findOne({ email: req.body.email });
  if (!doctor) {
    return res.status(400).send("email doesn't exist");
  }

  //password check
  const validPass = await bcrypt.compare(req.body.password, doctor.password);
  if (!validPass) {
    return res.status(400).send("password incorrect");
  }

  //create and assign token
  const token = jwt.sign({ _id: doctor._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
