const express = require('express')
const mongoose = require('mongoose')
const _ = require('lodash')
const Sprint = require('../models/sprint')
const Backlog = require('../models/backlog')
const Project = require('../models/project')
const auth = require('../middleware/auth')

const router = express.Router()

// POST /issues?transferTo=sprint&projectId=45763464576483
// POST /issues?transferTo=backlog&projectId=45763464576483
// POST /issues&projectId=45763464576483
router.post('/issues', auth, async (req, res) => {
    const { sprintId, backlogId, issue, issueId } = req.body
    const { transferTo, projectId } = req.query

    if (!projectId) {
        return res.status(404).send("you must include projectId in the query")
    }

    if (transferTo) { // transfer from backlog to sprint or from sprint to backlog

        // --- validate the data input for transferto query
        if (transferTo !== 'sprint' && transferTo !== 'backlog')
            return res.status(400).send("the transferTo query must have value of 'sprint' or 'backlog'")
        if (!issueId || typeof issueId !== 'string' || (sprintId && backlogId) || (!sprintId && !backlogId))
            return res.status(400).send("you must provide issueId property(string) and sprint/backlog property")
        // ---

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
            let _id // new _id for the new issue
            if (transferTo === 'sprint') { // transfer from backlog to sprint
                // --- delete the issue from backlog and get the whole document back (with the deleted issue inside)
                result = await Backlog.findOneAndUpdate({ "issue._id": issueId }, { $pull: { "issue": { _id: issueId } } }).session(session)
                if (!result) {
                    await session.abortTransaction()
                    return res.status(404).send("couldn't find issue")
                }
                // ---

                // --- find the deleted issue
                result.issue.forEach(i => {
                    if (i._id.toString() === issueId) {
                        return deletedIssue = i
                    }
                })
                // ---

                // --- push the deleted issue to sprint (with new _id for the issue that we keep for later) and get the whole document back
                _id = new mongoose.Types.ObjectId()
                result = await Sprint.findOneAndUpdate({ _id: sprintId }, { $push: { issue: { ..._.pick(deletedIssue, ['description', 'createdAt', 'todo']), _id, updatedAt: new Date().getTime() } } }, { new: true, runValidators: true }).session(session)
                if (!result) {
                    await session.abortTransaction()
                    return res.status(404).send("couldn't find sprint")
                }
                // ---
            }
            else if (transferTo === 'backlog') { // like "transferTo === 'sprint'" but for backlog
                result = await Sprint.findOneAndUpdate({ "issue._id": issueId }, { $pull: { "issue": { _id: issueId } } }).session(session)
                if (!result) {
                    await session.abortTransaction()
                    return res.status(404).send("couldn't find issue")
                }

                result.issue.forEach(i => {
                    if (i._id.toString() === issueId) {
                        return deletedIssue = i
                    }
                })

                _id = new mongoose.Types.ObjectId()
                result = await Backlog.findOneAndUpdate({ _id: backlogId }, { $push: { issue: { ..._.pick(deletedIssue, ['description', 'createdAt', 'todo']), _id, updatedAt: new Date().getTime() } } }, { new: true, runValidators: true }).session(session)
                if (!result) {
                    await session.abortTransaction()
                    return res.status(404).send("couldn't find backlog")
                }
            }

            // --- find the new issue we just added to the collection(sprint or backlog) and return it
            result.issue.forEach(i => {
                if (i._id.toString() === _id.toString()) {
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
            res.status(400).send(e)
        }
        finally {
            await session.endSession() // close the session for transaction
        }

    } else { // create issue for backlog
        if (!backlogId || !issue || typeof issue !== 'object') {
            return res.status(400).send("you must provide backlog property and issue object")
        }

        const updates = Object.keys(issue)
        const allowedUpdates = ['description']
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

            result = await Backlog.findOneAndUpdate({ _id: backlogId }, { $push: { issue } }, { new: true, runValidators: true })
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
    }
})

// GET /issues/653465765465?parent=sprint&projectId=43542353424
// GET /issues/653465765465?parent=backlog&projectId=43542353424
router.patch('/issues/:_id', auth, async (req, res) => {
    const { _id } = req.params // id of the issue we want to update
    const issue = req.body // the updated issue
    const { parent, projectId } = req.query

    if (!projectId) {
        return res.status(400).send("you must include projectId in the query")
    }

    if (!parent || (parent !== 'sprint' && parent !== 'backlog')) {
        return res.status(400).send({ error: "you must provide parent query with value of 'sprint' or 'backlog'" })
    }

    const updates = Object.keys(issue)
    const allowedUpdates = ['description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    const updatesObj = {}
    // this is for the $set next. set the property to the new one
    // example: "issue.$.description: myDescription"
    updates.forEach((update) => updatesObj[`issue.$.${update}`] = issue[update])
    updatesObj['issue.$.updatedAt'] = new Date().getTime()

    if (Object.keys(updatesObj).length === 0) { // must include this 'if' unless we want to get another error from the findOneAndUpdate function
        return res.status(400).send('you must include at least one property to update')
    }

    try {
        const project = await Project.findOne({ _id: projectId, ownerId: req.user._id })
        if (!project) {
            return res.status(404).send({ error: "project wasn't found" })
        }

        let result
        if (parent === 'sprint') {
            result = await Sprint.findOneAndUpdate({ "issue._id": _id }, {
                $set: updatesObj
            }, { new: true, runValidators: true })
        } else if (parent === 'backlog') {
            result = await Backlog.findOneAndUpdate({ "issue._id": _id }, {
                $set: updatesObj
            }, { new: true, runValidators: true })
        }

        if (!result) {
            return res.status(404).send(`couldn't find ${parent}`)
        }

        result.issue.forEach(i => {
            if (i._id.toString() === _id.toString()) {
                res.send(i)
            }
        })

    } catch (e) {
        res.status(400).send(e)
    }
})

// DELETE /issues/653465765465?parent=sprint&projectId=5423536456454
// DELETE /issues/653465765465?parent=backlog&projectId=5423536456454
router.delete('/issues/:_id', async (req, res) => {
    const { _id } = req.params // id of the issue we want to delete
    const { parent, projectId } = req.query

    if (!projectId) {
        return res.status(404).send("you must include projectId in the query")
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
            result = await Sprint.findOneAndUpdate({ "issue._id": _id }, { $pull: { "issue": { _id } } })
        } else if (parent === 'backlog') {
            result = await Backlog.findOneAndUpdate({ "issue._id": _id }, { $pull: { "issue": { _id } } })
        }

        if (!result) {
            return res.status(404).send(`couldn't find ${parent}`)
        }

        // find the deleted issue sprint in the document and send only it
        result.issue.forEach(i => {
            if (i._id.toString() === _id.toString()) {
                return res.send(i)
            }
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router