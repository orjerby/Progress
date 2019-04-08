const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const Project = require('../../src/models/project')
const Sprint = require('../../src/models/sprint')
const Backlog = require('../../src/models/backlog')
const User = require('../../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "or jerby",
    email: "orjerby@gmail.com",
    password: "or240290",
    token: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const projectOneId = new mongoose.Types.ObjectId()
const projectOne = {
    _id: projectOneId,
    name: "or's project",
    description: 'My first project',
    ownerId: userOneId,
    user: [
        { userId: userOneId }
    ]
}

const todoOneId = new mongoose.Types.ObjectId()
const todoOne = {
    _id: todoOneId,
    description: "My first todo.",
    status: "progress",
    priority: "low",
    userId: userOneId
}

const issueOneId = new mongoose.Types.ObjectId()
const issueOne = {
    _id: issueOneId,
    description: "My first issue.",
    todo: [todoOne]
}

const sprintOneId = new mongoose.Types.ObjectId()
const sprintOne = {
    _id: sprintOneId,
    projectId: projectOneId,
    description: "My first sprint."
}

const backlogOneId = new mongoose.Types.ObjectId()
const backlogOne = {
    _id: backlogOneId,
    projectId: projectOneId,
    issue: [issueOne]
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Backlog.deleteMany()
    await Project.deleteMany()
    await Sprint.deleteMany()
    await new User(userOne).save()
    await new Project(projectOne).save()
    await new Backlog(backlogOne).save()
    await new Sprint(sprintOne).save()
}

module.exports = {
    userOne,
    userOneId,
    projectOne,
    projectOneId,
    sprintOne,
    sprintOneId,
    issueOne,
    issueOneId,
    todoOne,
    todoOneId,
    backlogOne,
    backlogOneId,
    setupDatabase
}