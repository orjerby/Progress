const express = require('express')
const mongoose = require('mongoose')
const _ = require('lodash')
const Sprint = require('../models/sprint')
const Backlog = require('../models/backlog')

const router = express.Router()

// POST /issues?transferto=sprint
// POST /issues?transferto=backlog
// POST /issues
router.post('/issues', async (req, res) => {
    const sprintId = req.body.sprint
    const backlogId = req.body.backlog
    const issue = req.body.issue
    const { transferto } = req.query

    if (transferto) { // transfer from backlog to sprint or from sprint to backlog

        // --- validate the data input for transferto query
        if (transferto !== 'sprint' && transferto !== 'backlog')
            return res.status(400).send("the transferto query must have value of 'sprint' or 'backlog'")
        if (!issue || typeof issue !== 'string' || (sprintId && backlogId) || (!sprintId && !backlogId))
            return res.status(400).send("you must provide issue property(string) and sprint/backlog property")
        // ---

        let result // data that come back from mongo as an answer
        const session = await mongoose.startSession() // start an session for transaction
        try {
            await session.startTransaction() // we use transaction because we do combintion of commands to mongodb
            let deletedIssue // the deleted issue
            let newIssue  // the new issue
            let _id // new _id for the new issue
            if (transferto === 'sprint') { // transfer from backlog to sprint
                // --- delete the issue from backlog and get the whole document back (with the deleted issue inside)
                result = await Backlog.findOneAndUpdate({ "issue._id": issue }, { $pull: { "issue": { _id: issue } } }).session(session)
                if (!result) {
                    await session.abortTransaction()
                    return res.status(404).send("couldn't find issue")
                }
                // ---

                // --- find the deleted issue
                result.issue.forEach(i => {
                    if (i._id.toString() === issue) {
                        return deletedIssue = i
                    }
                })
                // ---

                // --- push the deleted issue to sprint (with new _id for the issue that we keep for later) and get the whole document back
                _id = new mongoose.Types.ObjectId()
                result = await Sprint.findOneAndUpdate({ _id: sprintId }, { $push: { issue: { ..._.pick(deletedIssue, ['description', 'createdAt', 'updatedAt', 'todo']), _id } } }, { new: true, runValidators: true }).session(session)
                if (!result) {
                    await session.abortTransaction()
                    return res.status(404).send("couldn't find sprint")
                }
                // ---
            }
            else if (transferto === 'backlog') { // like "transferto === 'sprint'" but for backlog
                result = await Sprint.findOneAndUpdate({ "issue._id": issue }, { $pull: { "issue": { _id: issue } } }).session(session)
                if (!result) {
                    await session.abortTransaction()
                    return res.status(404).send("couldn't find issue")
                }

                result.issue.forEach(i => {
                    if (i._id.toString() === issue) {
                        return deletedIssue = i
                    }
                })

                _id = new mongoose.Types.ObjectId()
                result = await Backlog.findOneAndUpdate({ _id: backlogId }, { $push: { issue: { ..._.pick(deletedIssue, ['description', 'createdAt', 'updatedAt', 'todo']), _id } } }, { new: true, runValidators: true }).session(session)
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

// GET /issues/653465765465?parent=sprint
// GET /issues/653465765465?parent=backlog
router.patch('/issues/:_id', async (req, res) => {
    const _id = req.params._id // id of the issue we want to update
    const issue = req.body // the updated issue
    const { parent } = req.query
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

    if (Object.keys(updatesObj).length === 0) { // must include this 'if' unless we want to get another error from the findOneAndUpdate function
        return res.status(400).send('you must include at least one property to update')
    }

    try {
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

// DELETE /issues/653465765465?parent=sprint
// DELETE /issues/653465765465?parent=backlog
router.delete('/issues/:_id', async (req, res) => {
    const _id = req.params._id // id of the issue we want to delete
    const { parent } = req.query
    if (!parent || (parent !== 'sprint' && parent !== 'backlog')) {
        return res.status(400).send({ error: "you must provide parent query with value of 'sprint' or 'backlog'" })
    }

    try {
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