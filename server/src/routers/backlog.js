const express = require('express')
const Backlog = require('../models/backlog')
const Project = require('../models/project')
const auth = require('../middleware/auth')

const router = express.Router()

// /backlogs?projectId=5c953c618b2c0b16906688b8
router.get('/backlogs', auth, async (req, res) => {
    const { projectId } = req.query

    if (!projectId) {
        return res.status(400).send("you must include projectId in the query")
    }

    try {
        const project = await Project.findOne({ _id: projectId, "user.userId": req.user._id })
        if (!project) {
            return res.status(404).send({ error: "project wasn't found" })
        }

        const backlog = await Backlog.findOne({ projectId })
        if (!backlog) {
            return res.status(404).send("couldn't find backlog")
        }
        res.send(backlog)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router