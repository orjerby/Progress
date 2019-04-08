const express = require('express')
const Sprint = require('../models/sprint')
const Project = require('../models/project')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/sprints/projects/:projectId', auth, async (req, res) => {
    const sprint = req.body
    const { projectId } = req.params

    const updates = Object.keys(sprint)
    const allowedUpdates = ['description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid properties!' })
    }

    try {
        const project = await Project.findOne({ _id: projectId, ownerId: req.user._id })
        if (!project) {
            return res.status(404).send({ error: "project wasn't found" })
        }

        let sprint = new Sprint({ ...req.body, projectId })
        sprint = await sprint.save()
        res.status(201).send(sprint)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/sprints/projects/:projectId', auth, async (req, res) => {
    const { projectId } = req.params

    try {
        const project = await Project.findOne({ _id: projectId, "user.userId": req.user._id })
        if (!project) {
            return res.status(404).send({ error: "project wasn't found" })
        }

        const sprint = await Sprint.find({ projectId })
        res.send(sprint)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.patch('/sprints/:_id/projects/:projectId', auth, async (req, res) => {
    const { _id, projectId } = req.params // id of the sprint we want to update
    const sprint = req.body // the updated sprint

    const updates = Object.keys(sprint)
    const allowedUpdates = ['description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    const updatesObj = {}
    // this is for the $set next. set the property to the new one
    // example: "description: myDescription"
    updates.forEach((update) => updatesObj[update] = sprint[update])
    if (Object.keys(updatesObj).length === 0) { // must include this 'if' unless we want to get another error from the findOneAndUpdate function
        return res.status(400).send('you must include at least one property to update')
    }

    updatesObj['updatedAt'] = new Date().getTime()

    try {
        const project = await Project.findOne({ _id: projectId, ownerId: req.user._id })
        if (!project) {
            return res.status(404).send({ error: "project wasn't found" })
        }

        const sprint = await Sprint.findOneAndUpdate({ _id }, {
            $set: updatesObj
        }, {
                new: true, runValidators: true
            })

        if (!sprint) {
            return res.status(404).send("couldn't find sprint")
        }

        res.send(sprint)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/sprints/:_id/projects/:projectId', auth, async (req, res) => {
    const { _id, projectId } = req.params // id of the sprint we want to delete

    try {
        const project = await Project.findOne({ _id: projectId, ownerId: req.user._id })
        if (!project) {
            return res.status(404).send({ error: "project wasn't found" }) // (project wasn't found for this user)
        }

        const sprint = await Sprint.findOneAndDelete({ _id })
        if (!sprint) {
            return res.status(404).send("couldn't find sprint")
        }

        res.send(sprint)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router