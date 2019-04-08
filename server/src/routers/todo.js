const express = require('express')
const mongoose = require('mongoose')
const Sprint = require('../models/sprint')
const Backlog = require('../models/backlog')
const Project = require('../models/project')
const auth = require('../middleware/auth')

const router = express.Router()

// POST /todos?parent=sprint&projectId=34254235433522
// POST /todos?parent=backlog&projectId=34254235433522
router.post('/todos', auth, async (req, res) => {
    const { issueId } = req.body
    const { parent, projectId } = req.query
    const todo = req.body.todo

    if (!projectId) {
        return res.status(400).send("you must include projectId in the query")
    }

    if (!issueId || !todo) {
        return res.status(400).send('you must include issue property and todo object')
    }

    if (!parent || (parent !== 'sprint' && parent !== 'backlog')) {
        return res.status(400).send({ error: "you must provide parent query with value of 'sprint' or 'backlog'" })
    }

    const updates = Object.keys(todo)
    const allowedUpdates = ['description', 'status', 'priority', 'userId']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid properties!' })
    }

    todo._id = new mongoose.Types.ObjectId() // keep the id of the new todo sprint for later
    try {
        const project = await Project.findOne({ _id: projectId, ownerId: req.user._id })
        if (!project) {
            return res.status(404).send({ error: "project wasn't found" })
        }

        let result
        if (parent === 'sprint') {
            result = await Sprint.findOneAndUpdate({ "issue._id": issueId }, { $push: { "issue.$.todo": todo } }, { new: true, runValidators: true })
        } else if (parent === 'backlog') {
            result = await Backlog.findOneAndUpdate({ "issue._id": issueId }, { $push: { "issue.$.todo": todo } }, { new: true, runValidators: true })
        }

        if (!result) {
            return res.status(404).send("couldn't find issue")
        }

        // find the new todo sprint in the document using the id whe kept before and send only it
        result.issue.forEach(i => {
            if (i._id.toString() === issueId.toString()) {
                i.todo.forEach(j => {
                    if (j._id.toString() === todo._id.toString()) {
                        return res.status(201).send(j)
                    }
                })
            }
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

// PATCH /todos/4324321453323?parent=sprint&projectId=34254235433522&fullUpdate=false
// PATCH /todos/4324321453323?parent=backlog&projectId=34254235433522&fullUpdate=true
router.patch('/todos/:_id', auth, async (req, res) => {
    const _id = req.params._id // id of the todo we want to update
    const { issueId } = req.body
    const { todo } = req.body // the updated todo
    const { parent, projectId, fullUpdate } = req.query

    if (!projectId) {
        return res.status(400).send("you must include projectId in the query")
    }

    if (!fullUpdate) {
        return res.status(400).send("you must include fullUpdate(boolean) in the query")
    }

    if (!parent || (parent !== 'sprint' && parent !== 'backlog')) {
        return res.status(400).send({ error: "you must provide parent query with value of 'sprint' or 'backlog'" })
    }

    if (!issueId || !todo) {
        return res.status(400).send('you must include issueId property and todo object')
    }

    const updates = Object.keys(todo)
    let allowedUpdates
    if (fullUpdate === 'true') {
        allowedUpdates = ['description', 'status', 'priority', 'userId']
    } else {
        allowedUpdates = ['status', 'userId']
        if (todo.userId && todo.userId !== req.user._id.toString()) {
            return res.status(400).send({ error: 'the userId property is wrong!' }) // ut's not the id of the current user
        }
    }
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    todo._id = new mongoose.Types.ObjectId(_id) // keep the id of the new todo sprint for later

    const updatesObj = {}
    // this is for the $set next. set the property to the new one
    // example: "issue.$.todo.$[inner].${description}: myDescription"
    updates.forEach((update) => updatesObj[`issue.$.todo.$[inner].${update}`] = todo[update])

    if (Object.keys(updatesObj).length === 0) { // must include this 'if' unless we want to get another error from the findOneAndUpdate function
        return res.status(400).send('you must include at least one property to update')
    }

    updatesObj['issue.$.todo.$[inner].updatedAt'] = new Date().getTime()

    try {
        let project
        let arrayFilters
        if (fullUpdate) {
            project = await Project.findOne({ _id: projectId, ownerId: req.user._id })
            arrayFilters = [{ "inner._id": _id }]
        } else {
            project = await Project.findOne({ _id: projectId, 'user.userId': req.user._id })
            arrayFilters = [{ "inner._id": _id, "$or": [{ "inner.userId": null }, { "inner.userId": null }] }]
        }

        if (!project) {
            return res.status(404).send({ error: "project wasn't found" })
        }

        let result
        if (parent === 'sprint') {
            result = await Sprint.findOneAndUpdate({ "issue._id": issueId }, {
                // use .$ (max one time) to get into the correct object in array by the conditions above
                // use $[random] (unlimited times) to get inside arrays and then you must use arrayFilters to guide the 'random' into the correct object in the array
                // returns the whole document after the update
                $set: updatesObj
            }, { arrayFilters: arrayFilters, new: true, runValidators: true })
        } else if (parent === 'backlog') {
            result = await Backlog.findOneAndUpdate({ "issue._id": issueId }, {
                // use .$ (max one time) to get into the correct object in array by the conditions above
                // use $[random] (unlimited times) to get inside arrays and then you must use arrayFilters to guide the 'random' into the correct object in the array
                // returns the whole document after the update
                $set: updatesObj
            }, { arrayFilters: arrayFilters, new: true, runValidators: true })
        }

        if (!result) {
            return res.status(404).send("couldn't find issue")
        }

        let todoFound = false // need the boolean because the 'return res.send(l)' statement only exit the foreach function(and not the whole thing)

        // find the updated todo sprint in the document updated using the id whe kept before and send only it
        result.issue.forEach(i => {
            if (i._id.toString() === issueId.toString()) {
                i.todo.forEach(j => {
                    if (j._id.toString() === todo._id.toString()) {
                        todoFound = true
                        return res.send(j)
                    }
                })
                if (todoFound) return // if found it means it sent, so here we just exit the loop
            }
        })

        if (!todoFound) {
            return res.status(404).send("couldn't find todo") // we could just look for it in the beginning but then it will be much slower
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/todos/:_id', auth, async (req, res) => {
    const { _id } = req.params
    const { parent, projectId } = req.query

    if (!projectId) {
        return res.status(400).send("you must include projectId in the query")
    }

    if (!parent || (parent !== 'sprint' && parent !== 'backlog')) {
        return res.status(400).send({ error: "you must provide parent query with value of 'sprint' or 'backlog'" })
    }

    try {
        const project = await Project.findOne({ _id: projectId, ownerId: req.user._id })
        if (!project) {
            return res.status(404).send({ error: "project wasn't found" })
        }

        let result
        if (parent === 'sprint') {
            // this time we don't use the 'new' option because we want to find the deleted todo sprint next
            result = await Sprint.findOneAndUpdate({ "issue.todo._id": _id }, { $pull: { "issue.$.todo": { _id } } })
        } else if (parent === 'backlog') {
            result = await Backlog.findOneAndUpdate({ "issue.todo._id": _id }, { $pull: { "issue.$.todo": { _id } } })
        }

        if (!result) {
            return res.status(404).send("couldn't find todo")
        }

        // find the deleted todo sprint in the document and send only it
        result.issue.forEach(i => {
            i.todo.forEach(j => {
                if (j._id.toString() === _id.toString()) {
                    return res.status(200).send(j)
                }
            })
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router

// need to add the ability to let user update status of todo - V
// need to include name of user responsible for todo - V
// need to add the ability to add users to project
// need to fix updatedAt - V
// need to remove all projects of owner when he gets deleted - V