const express = require('express')
const mongoose = require('mongoose')
const _ = require('lodash')
const Sprint = require('../models/sprint')
const Backlog = require('../models/backlog')
const Project = require('../models/project')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/issues/:_id/transfer/sprints/:sprintId/projects/:projectId', auth, async (req, res) => {
    const { _id, sprintId, projectId } = req.params

    let result // data that come back from mongo as an answer
    const session = await mongoose.startSession() // start an session for transaction
    try {
        await session.startTransaction() // we use transaction because we do combintion of commands to mongodb
        const project = await Project.findOne({ _id: projectId, ownerId: req.user._id })
        if (!project) {
            return res.status(404).send({ error: "project wasn't found" })
        }

        let deletedIssue // the deleted issue
        let newIssue  // the new issue

        // --- delete the issue from backlog and get the whole document back (with the deleted issue inside)
        result = await Backlog.findOneAndUpdate({ "issue._id": _id }, { $pull: { "issue": { _id } } }).session(session)
        if (!result) {
            await session.abortTransaction()
            return res.status(404).send("couldn't find issue")
        }
        // ---

        // --- find the deleted issue
        result.issue.forEach(i => {
            if (i._id.toString() === _id) {
                return deletedIssue = i
            }
        })
        // ---

        // --- push the deleted issue to sprint (with new _id for the issue that we keep for later) and get the whole document back
        let newId = new mongoose.Types.ObjectId()
        result = await Sprint.findOneAndUpdate({ _id: sprintId }, { $push: { issue: { ..._.pick(deletedIssue, ['name', 'description', 'createdAt', 'todo']), _id: newId, updatedAt: new Date().getTime() } } }, { new: true, runValidators: true }).session(session)
        if (!result) {
            await session.abortTransaction()
            return res.status(404).send("couldn't find sprint")
        }
        // ---


        // --- find the new issue we just added to the collection(sprint or backlog) and return it
        result.issue.forEach(i => {
            if (i._id.toString() === newId.toString()) {
                return newIssue = i
            }
        })
        if (newIssue) {
            await session.commitTransaction() // everything worked! commit the transaction
            return res.status(201).send(newIssue)
        }
        // ---

        await session.abortTransaction() // it didn't work, abort the transaction
    }
    catch (e) {
        await session.abortTransaction()
        res.status(400).send(e)
    }
    finally {
        await session.endSession() // close the session for transaction
    }

})

router.post('/issues/:_id/transfer/backlogs/projects/:projectId', auth, async (req, res) => {
    const { _id, projectId } = req.params

    let result // data that come back from mongo as an answer
    const session = await mongoose.startSession() // start an session for transaction
    try {
        await session.startTransaction() // we use transaction because we do combintion of commands to mongodb
        const project = await Project.findOne({ _id: projectId, ownerId: req.user._id })
        if (!project) {
            return res.status(404).send({ error: "project wasn't found" })
        }

        let deletedIssue // the deleted issue
        let newIssue  // the new issue

        result = await Sprint.findOneAndUpdate({ "issue._id": _id }, { $pull: { "issue": { _id } } }).session(session)
        if (!result) {
            await session.abortTransaction()
            return res.status(404).send("couldn't find issue")
        }

        result.issue.forEach(i => {
            if (i._id.toString() === _id) {
                return deletedIssue = i
            }
        })

        let newId = new mongoose.Types.ObjectId()
        result = await Backlog.findOneAndUpdate({ projectId }, { $push: { issue: { ..._.pick(deletedIssue, ['name', 'description', 'createdAt', 'todo']), _id: newId, updatedAt: new Date().getTime() } } }, { new: true, runValidators: true }).session(session)
        if (!result) {
            await session.abortTransaction()
            return res.status(404).send("couldn't find backlog")
        }


        // --- find the new issue we just added to the collection(sprint or backlog) and return it
        result.issue.forEach(i => {
            if (i._id.toString() === newId.toString()) {
                return newIssue = i
            }
        })
        if (newIssue) {
            await session.commitTransaction() // everything worked! commit the transaction
            return res.status(201).send(newIssue)
        }
        // ---

        await session.abortTransaction() // it didn't work, abort the transaction
    }
    catch (e) {
        await session.abortTransaction()
        res.status(400).send(e)
    }
    finally {
        await session.endSession() // close the session for transaction
    }
})

router.post('/issues/backlogs/projects/:projectId', auth, async (req, res) => {
    const issue = req.body
    const { projectId } = req.params

    const updates = Object.keys(issue)
    const allowedUpdates = ['name', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid properties!' })
    }

    issue._id = new mongoose.Types.ObjectId() // new _id for the new issue so we can keep track of it for later
    try {
        const project = await Project.findOne({ _id: projectId, ownerId: req.user._id })
        if (!project) {
            return res.status(404).send({ error: "project wasn't found" })
        }

        result = await Backlog.findOneAndUpdate({ projectId }, { $push: { issue } }, { new: true, runValidators: true })
        if (!result) {
            return res.status(404).send("couldn't find backlog")
        }

        result.issue.forEach(i => {
            if (i._id.toString() === issue._id.toString()) {
                return res.status(201).send(i)
            }
        })
    } catch (e) {
        res.status(400).send(e)
    }
})


router.patch('/issues/:_id/sprints/projects/:projectId', auth, async (req, res) => {
    const { _id, projectId } = req.params // id of the issue we want to update
    const issue = req.body // the updated issue

    const updates = Object.keys(issue)
    const allowedUpdates = ['name', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    const updatesObj = {}
    // this is for the $set next. set the property to the new one
    // example: "issue.$.description: myDescription"
    updates.forEach((update) => updatesObj[`issue.$.${update}`] = issue[update])

    if (Object.keys(updatesObj).length === 0) { // must include this 'if' unless we want to get another error from the findOneAndUpdate function
        return res.status(400).send('you must include at least one property to update')
    }

    updatesObj['issue.$.updatedAt'] = new Date().getTime()

    try {
        const project = await Project.findOne({ _id: projectId, ownerId: req.user._id })
        if (!project) {
            return res.status(404).send({ error: "project wasn't found" })
        }

        let result
        result = await Sprint.findOneAndUpdate({ "issue._id": _id }, {
            $set: updatesObj
        }, { new: true, runValidators: true })

        if (!result) {
            return res.status(404).send("couldn't find sprint")
        }

        let issueFound = false
        result.issue.forEach(i => {
            if (i._id.toString() === _id.toString()) {
                issueFound = true
                return res.send(i)
            }
        })

        if (!issueFound) {
            res.status(404).send("couldn't find issue")
        }

    } catch (e) {
        res.status(400).send(e)
    }
})


router.patch('/issues/:_id/backlogs/projects/:projectId', auth, async (req, res) => {
    const { _id, projectId } = req.params // id of the issue we want to update
    const issue = req.body // the updated issue

    const updates = Object.keys(issue)
    const allowedUpdates = ['name', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    const updatesObj = {}
    // this is for the $set next. set the property to the new one
    // example: "issue.$.description: myDescription"
    updates.forEach((update) => updatesObj[`issue.$.${update}`] = issue[update])

    if (Object.keys(updatesObj).length === 0) { // must include this 'if' unless we want to get another error from the findOneAndUpdate function
        return res.status(400).send('you must include at least one property to update')
    }

    updatesObj['issue.$.updatedAt'] = new Date().getTime()

    try {
        const project = await Project.findOne({ _id: projectId, ownerId: req.user._id })
        if (!project) {
            return res.status(404).send({ error: "project wasn't found" })
        }

        let result
        result = await Backlog.findOneAndUpdate({ "issue._id": _id }, {
            $set: updatesObj
        }, { new: true, runValidators: true })

        if (!result) {
            return res.status(404).send("couldn't find backlog")
        }

        let issueFound = false
        result.issue.forEach(i => {
            if (i._id.toString() === _id.toString()) {
                issueFound = true
                return res.send(i)
            }
        })

        if (!issueFound) {
            res.status(404).send("couldn't find issue")
        }

    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/issues/:_id/sprints/projects/:projectId', auth, async (req, res) => {
    const { _id, projectId } = req.params // id of the issue we want to delete

    try {
        const project = await Project.findOne({ _id: projectId, ownerId: req.user._id })
        if (!project) {
            return res.status(404).send({ error: "project wasn't found" })
        }

        let result
        result = await Sprint.findOneAndUpdate({ "issue._id": _id }, { $pull: { "issue": { _id } } })

        if (!result) {
            return res.status(404).send("couldn't find sprint")
        }

        // find the deleted issue sprint in the document and send only it
        let issueFound = false
        result.issue.forEach(i => {
            if (i._id.toString() === _id.toString()) {
                issueFound = true
                return res.send(i)
            }
        })

        if (!issueFound) {
            res.status(404).send("couldn't find issue")
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/issues/:_id/backlogs/projects/:projectId', auth, async (req, res) => {
    const { _id, projectId } = req.params // id of the issue we want to delete

    try {
        const project = await Project.findOne({ _id: projectId, ownerId: req.user._id })
        if (!project) {
            return res.status(404).send({ error: "project wasn't found" })
        }

        let result
        result = await Backlog.findOneAndUpdate({ "issue._id": _id }, { $pull: { "issue": { _id } } })

        if (!result) {
            return res.status(404).send("couldn't find backlog")
        }

        // find the deleted issue sprint in the document and send only it
        let issueFound = false
        result.issue.forEach(i => {
            if (i._id.toString() === _id.toString()) {
                issueFound = true
                return res.send(i)
            }
        })

        if (!issueFound) {
            res.status(404).send("couldn't find issue")
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router