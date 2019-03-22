const express = require('express')
const Project = require('../models/project')
const Task = require('../models/task')

const router = express.Router()

router.post('/projects', async (req, res) => {
    const project = req.body

    const updates = Object.keys(project)
    const allowedUpdates = ['name', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid properties!' })
    }

    try {
        const project = new Project(req.body)
        await project.save()
        res.status(201).send(project)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/projects', async (req, res) => {
    try {
        const project = await Project.find()
        res.send(project)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/projects/:_id', async (req, res) => {
    const _id = req.params._id // id of the project we want to update
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
        const project = await Project.findOneAndUpdate({ _id }, {
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

router.delete('/projects/:_id', async (req, res) => {
    const _id = req.params._id // id of the project we want to delete

    try {
        const project = await Project.findOneAndDelete({ _id })
        if (!project) {
            return res.status(404).send("couldn't find project")
        }

        await Task.deleteMany({ project: _id })
        res.send(project)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router