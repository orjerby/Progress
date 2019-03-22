const express = require('express')
const Task = require('../models/task')

const router = express.Router()

router.post('/tasks', async (req, res) => {
    const task = req.body

    const updates = Object.keys(task)
    const allowedUpdates = ['project', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid properties!' })
    }

    try {
        let task = new Task(req.body)
        task = await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// /tasks?projectid=5c953c618b2c0b16906688b8
router.get('/tasks', async (req, res) => {
    const _id = req.query.projectid

    if (!_id) {
        return res.status(404).send("you must include projectid in the query")
    }

    try {
        const task = await Task.find({ project: _id })
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/tasks/:_id', async (req, res) => {
    const _id = req.params._id // id of the task we want to update
    const task = req.body // the updated task

    const updates = Object.keys(task)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    const updatesObj = {}
    // this is for the $set next. set the property to the new one
    // example: "description: myDescription"
    updates.forEach((update) => updatesObj[update] = task[update])

    if (Object.keys(updatesObj).length === 0) { // must include this 'if' unless we want to get another error from the findOneAndUpdate function
        return res.status(400).send('you must include at least one property to update')
    }

    try {
        const task = await Task.findOneAndUpdate({ _id }, {
            $set: updatesObj
        }, {
                new: true, runValidators: true
            })

        if (!task) {
            return res.status(404).send("couldn't find task")
        }

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:_id', async (req, res) => {
    const _id = req.params._id // id of the task we want to delete

    try {
        const task = await Task.findOneAndDelete({ _id })
        if (!task) {
            return res.status(404).send("couldn't find task")
        }

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router