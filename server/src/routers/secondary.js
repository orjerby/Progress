const express = require('express')
const mongoose = require('mongoose')
const Task = require('../models/task')

const router = express.Router()

router.post('/secondaries', async (req, res) => {
    const _id = req.body.task
    const secondary = req.body.secondary
    if (!_id || !secondary) {
        return res.status(400).send('you must include task property and secondary object')
    }

    const updates = Object.keys(secondary)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid properties!' })
    }

    secondary._id = new mongoose.Types.ObjectId()
    try {
        const task = await Task.findOneAndUpdate({ _id }, { $push: { secondary } }, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send("couldn't find primary task")
        }

        task.secondary.forEach(s => {
            if (s._id.toString() === secondary._id.toString()) {
                return res.status(201).send(s)
            }
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/secondaries/:_id', async (req, res) => {
    const _id = req.params._id // id of the secondary we want to update
    const secondary = req.body // the updated secondary

    const updates = Object.keys(secondary)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    const updatesObj = {}
    // this is for the $set next. set the property to the new one
    // example: "secondary.$.description: myDescription"
    updates.forEach((update) => updatesObj[`secondary.$.${update}`] = secondary[update])

    if (Object.keys(updatesObj).length === 0) { // must include this 'if' unless we want to get another error from the findOneAndUpdate function
        return res.status(400).send('you must include at least one property to update')
    }

    try {
        const task = await Task.findOneAndUpdate({ "secondary._id": _id }, {
            $set: updatesObj
        }, { new: true, runValidators: true })

        if (!task) {
            return res.status(404).send("couldn't find secondary task")
        }

        task.secondary.forEach(s => {
            if (s._id.toString() === _id.toString()) {
                res.send(s)
            }
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/secondaries/:_id', async (req, res) => {
    const _id = req.params._id // id of the secondary we want to delete

    try {
        const task = await Task.findOneAndUpdate({ "secondary._id": _id }, { $pull: { "secondary": { _id } } })
        if (!task) {
            return res.status(404).send("couldn't find secondary task")
        }

        // find the deleted secondary task in the document and send only it
        task.secondary.forEach(s => {
            if (s._id.toString() === _id.toString()) {
                return res.send(s)
            }
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router