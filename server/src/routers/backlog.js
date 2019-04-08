const express = require('express')
const Backlog = require('../models/backlog')
const Project = require('../models/project')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/backlogs/projects/:projectId', auth, async (req, res) => {
    const { projectId } = req.params

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