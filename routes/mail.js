const router = require('express').Router()
const nodemailer = require("nodemailer")
const verify = require('./verifyToken')
const Doctor = require('../models/DocAuth')

const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
       auth: {
            user: 'mentalchroma@gmail.com',
            pass: 'mentalhealth',
         },
    secure: true,
    });

    
    router.post("/", verify, async (req, res) => {
        const doctor = await Doctor.findById({_id:req.user._id})

        const mailData = {
            from: "mentalchroma@gmail.com",
            to: req.body.to,
            subject: `Appointment, Mental Chroma`,
            html: `
            <div style={background-color:#green;}>
            <h3>Appointment from doctor: ${doctor.name}</h3> 
            <b>video call link:</b>${req.body.html}
            </div>
            `
        };

        transporter.sendMail(mailData, (error, info) => {
            if(error){
                console.log(error)
            }
            res.status(200).send("mail sent")
        })
    })

    module.exports = router