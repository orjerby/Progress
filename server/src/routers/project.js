const express = require('express')
const mongoose = require('mongoose')
const Project = require('../models/project')
const Sprint = require('../models/sprint')
const Backlog = require('../models/backlog')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/projects', auth, async (req, res) => {
    const project = req.body

    const updates = Object.keys(project)
    const allowedUpdates = ['name', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid properties!' })
    }

    const session = await mongoose.startSession() // start an session for transaction
    try {
        session.startTransaction()
        const project = new Project({
            ...req.body,
            ownerId: req.user._id,
            user: [{
                userId: req.user._id
            }]
        })
        await project.save()
        const backlog = new Backlog({
            projectId: project._id
        })
        await backlog.save()
        await session.commitTransaction()
        res.status(201).send(project)
    } catch (e) {
        await session.abortTransaction()
        res.status(400).send(e)
    } finally {
        await session.endSession() // close the session for transaction
    }
})

router.get('/projects', auth, async (req, res) => {
    try {
        const project = await Project.findOne({ "users.userId": req.user._id })
        res.send(project)
    } catch (e) {
        res.status(400).send(e)
    }
})

// router.get('/projects/:_id', async (req, res) => {
//     const { _id } = req.params

//     try {
//         const backlog = await Backlog.findOne({ projectId: _id })
//         if (!backlog) {
//             return res.status(404).send("couldn't find project")
//         }
//         const sprints = await Sprint.find({ projectId: _id })

//         res.send({ backlog, sprints })
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

router.patch('/projects/:_id', auth, async (req, res) => {
    const { _id } = req.params // id of the project we want to update
    const project = req.body // the updated project

    const updates = Object.keys(project)
    const allowedUpdates = ['name', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    const updatesObj = {}
    // this is for the $set next. set the property to the new one
    // example: "description: myDescription"
    updates.forEach((update) => updatesObj[update] = project[update])

    if (Object.keys(updatesObj).length === 0) { // must include this 'if' unless we want to get another error from the findOneAndUpdate function
        return res.status(400).send('you must include at least one property to update')
    }

    try {
        const project = await Project.findOneAndUpdate({ _id, ownerId: req.user._id }, {
            $set: updatesObj
        }, {
                new: true, runValidators: true
            })

        if (!project) {
            return res.status(404).send("couldn't find project")
        }

        res.send(project)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/projects/:_id', auth, async (req, res) => {
    const { _id } = req.params // id of the project we want to delete

    const session = await mongoose.startSession() // start an session for transaction
    try {
        session.startTransaction() // we use transaction because we do combintion of commands to mongodb
        const project = await Project.findOneAndDelete({ _id, ownerId: req.user._id })
        if (!project) {
            await session.abortTransaction() // it didn't work, abort the transaction
            return res.status(404).send("couldn't find project")
        }

        await Backlog.deleteMany({ project: _id })
        await Sprint.deleteMany({ project: _id })
        await session.commitTransaction() // everything worked! commit the transaction
        res.send(project)
    } catch (e) {
        await session.abortTransaction()
        res.status(400).send(e)
    } finally {
        await session.endSession() // close the session for transaction
    }
})

module.exports = router