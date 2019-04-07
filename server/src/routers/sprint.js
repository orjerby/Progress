const express = require('express')
const Sprint = require('../models/sprint')
const Project = require('../models/project')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/sprints', auth, async (req, res) => {
    const sprint = req.body

    const updates = Object.keys(sprint)
    const allowedUpdates = ['projectId', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid properties!' })
    }

    try {
        const project = await Project.findOne({ _id: sprint.projectId, owner: req.user._id })
        if (!project) {
            return res.status(404).send({ error: "project wasn't found" })
        }

        let sprint = new Sprint(req.body)
        sprint = await sprint.save()
        res.status(201).send(sprint)
    } catch (e) {
        res.status(400).send(e)
    }
})

// /sprints?projectId=5c953c618b2c0b16906688b8
router.get('/sprints', auth, async (req, res) => {
    const { projectId } = req.query

    if (!projectId) {
        return res.status(404).send("you must include projectId in the query")
    }

    try {
        const project = await Project.findOne({ _id: projectId, "users.user": req.user._id })
        if (!project) {
            return res.status(404).send({ error: "project wasn't found" })
        }

        const sprint = await Sprint.find({ projectId })
        res.send(sprint)
    } catch (e) {
        res.status(400).send(e)
    }
})

// added query
router.patch('/sprints/:_id', auth, async (req, res) => {
    const { _id } = req.params // id of the sprint we want to update
    const { projectId } = req.query
    const sprint = req.body // the updated sprint

    if (!projectId) {
        return res.status(400).send({ error: 'please provide projectId query' })
    }

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

    try {
        const project = await Project.findOne({ _id: projectId, owner: req.user._id })
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

// added query
router.delete('/sprints/:_id', auth, async (req, res) => {
    const { _id } = req.params // id of the sprint we want to delete
    const { projectId } = req.query

    if (!projectId) {
        return res.status(400).send({ error: 'please provide projectId query' })
    }

    try {
        const project = await Project.findOne({ _id: projectId, owner: req.user._id })
        if (!project) {
            return res.status(404).send({ error: "project wasn't found" })
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