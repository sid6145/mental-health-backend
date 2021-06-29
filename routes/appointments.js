const router = require('express').Router();
const Appointment = require('../models/Appointment')
const Doctor = require('../models/DocAuth')
const verify = require('./verifyToken')





router.post("/", verify, async (req, res) => {
    const appointment = new Appointment({
        name: req.body.name,
        email: req.body.email,
        date: req.body.date,
        time: req.body.time,
        payment: req.body.payment
    })
   
        const savedAppointment = await appointment.save()
        const doc = await Doctor.findById({_id:req.user._id})
        doc.appointments.push(savedAppointment._id)
        const docAppointment = await doc.save()
        res.json(docAppointment)


   

   
})

router.get("/",verify, async (req, res) => {
    const appointments = await Doctor.findById({_id:req.user._id})
    .populate("appointments")
    res.json(appointments.appointments)
   

    
})




module.exports = router