const router = require('express').Router()
const User = require('../models/UserAuth')
const Activity = require('../models/Activities')
const verify  = require('./verifyToken')

router.post("/", verify ,async (req, res) => {
    const activity = new Activity({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image
    })

    const savedActivity = await activity.save()
    const user = await User.findById({_id:req.user._id})
    user.activities.push(savedActivity._id)
    const userActivity = await user.save()
    res.json(userActivity)
})


router.get("/", verify, async(req, res) => {
    const activities = await User.findById({_id:req.user._id})
    .populate("activities")
    res.json(activities.activities)
})

module.exports = router