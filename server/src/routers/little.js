const express = require('express')
const mongoose = require('mongoose')
const Task = require('../models/task')

const router = express.Router()

router.post('/littles', async (req, res) => {
    const _id = req.body.secondary
    const little = req.body.little
    if (!_id || !little) {
        return res.status(400).send('you must include secondary property and little object')
    }

    const updates = Object.keys(little)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid properties!' })
    }

    little._id = new mongoose.Types.ObjectId() // keep the id of the new little task for later
    try {
        // use .$ (max one time) to get into the correct object in array by the conditions above
        // returns the whole document after the update
        const task = await Task.findOneAndUpdate({ "secondary._id": _id }, { $push: { "secondary.$.little": little } }, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send("couldn't find secondary task")
        }

        // find the new little task in the document using the id whe kept before and send only it
        task.secondary.forEach(s => {
            if (s._id.toString() === _id.toString()) {
                s.little.forEach(l => {
                    if (l._id.toString() === little._id.toString()) {
                        return res.status(201).send(l)
                    }
                })
            }
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/littles/:_id', async (req, res) => {
    const _id = req.params._id // id of the little we want to update
    const secondaryId = req.body.secondary
    const little = req.body.little // the updated little

    if (!secondaryId || !little) {
        return res.status(400).send('you must include secondary property and little object')
    }

    const updates = Object.keys(little)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    little._id = new mongoose.Types.ObjectId(_id) // keep the id of the new little task for later

    const updatesObj = {}
    // this is for the $set next. set the property to the new one
    // example: "secondary.$.little.$[inner].${description}: myDescription"
    updates.forEach((update) => updatesObj[`secondary.$.little.$[inner].${update}`] = little[update])

    if (Object.keys(updatesObj).length === 0) { // must include this 'if' unless we want to get another error from the findOneAndUpdate function
        return res.status(400).send('you must include at least one property to update')
    }

    try {
        const task = await Task.findOneAndUpdate({ "secondary._id": secondaryId }, {
            // use .$ (max one time) to get into the correct object in array by the conditions above
            // use $[random] (unlimited times) to get inside arrays and then you must use arrayFilters to guide the 'random' into the correct object in the array
            // returns the whole document after the update
            $set: updatesObj
        }, { arrayFilters: [{ "inner._id": _id }], new: true, runValidators: true })

        if (!task) {
            return res.status(404).send("couldn't find secondary task")
        }

        let littleFound = false // need the boolean because the 'return res.send(l)' statement only exit the foreach function(and not the whole thing)

        // find the updated little task in the document updated using the id whe kept before and send only it
        task.secondary.forEach(s => {
            if (s._id.toString() === secondaryId.toString()) {
                s.little.forEach(l => {
                    if (l._id.toString() === little._id.toString()) {
                        littleFound = true
                        return res.send(l)
                    }
                })
                if (littleFound) return // if found it means it sent, so here we just exit the loop
            }
        })

        if (!littleFound) {
            return res.status(404).send("couldn't find little task") // we could just look for it in the beginning but then it will be much slower
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/littles/:_id', async (req, res) => {
    const _id = req.params._id

    try {
        // this time we don't use the 'new' option because we want to find the deleted little task next
        const task = await Task.findOneAndUpdate({ "secondary.little._id": _id }, { $pull: { "secondary.$.little": { _id } } })
        if (!task) {
            return res.status(404).send("couldn't find little task")
        }

        // find the deleted little task in the document and send only it
        task.secondary.forEach(s => {
            s.little.forEach(l => {
                if (l._id.toString() === _id.toString()) {
                    return res.status(201).send(l)
                }
            })
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router