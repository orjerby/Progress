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

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Jess',
    email: 'jess@example.com',
    password: 'myhouse099@@',
    token: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const projectOneId = new mongoose.Types.ObjectId()
const projectOne = {
    _id: projectOneId,
    name: "or's project",
    description: 'My first project',
    ownerId: userOneId,
    user: [
        { userId: userOneId },
        { userId: userTwoId }
    ]
}

const projectTwoId = new mongoose.Types.ObjectId()
const projectTwo = {
    _id: projectTwoId,
    name: "or's second project",
    description: 'My second project',
    ownerId: userOneId,
    user: [
        { userId: userOneId }
    ]
}

const todoOneId = new mongoose.Types.ObjectId()
const todoOne = {
    _id: todoOneId,
    description: "My first todo."
}

const todoTwoId = new mongoose.Types.ObjectId()
const todoTwo = {
    _id: todoTwoId,
    description: "My second todo."
}

const issueOneId = new mongoose.Types.ObjectId()
const issueOne = {
    _id: issueOneId,
    description: "My first issue.",
    todo: [todoOne, todoTwo]
}

const issueTwoId = new mongoose.Types.ObjectId()
const issueTwo = {
    _id: issueTwoId,
    description: "My second issue."
}

const sprintOneId = new mongoose.Types.ObjectId()
const sprintOne = {
    _id: sprintOneId,
    projectId: projectOne,
    description: "My first sprint.",
    issue: [issueOne]
}

const sprintTwoId = new mongoose.Types.ObjectId()
const sprintTwo = {
    _id: sprintTwoId,
    projectId: projectOne,
    description: "My second sprint."
}

const backlogOneId = new mongoose.Types.ObjectId()
const backlogOne = {
    _id: backlogOneId,
    projectId: projectOne,
    issue: [issueTwo]
}

const backlogTwoId = new mongoose.Types.ObjectId()
const backlogTwo = {
    _id: backlogTwoId,
    projectId: projectOne
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Backlog.deleteMany()
    await Project.deleteMany()
    await Sprint.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Project(projectOne).save()
    await new Project(projectTwo).save()
    await new Backlog(backlogOne).save()
    await new Backlog(backlogTwo).save()
    await new Sprint(sprintOne).save()
    await new Sprint(sprintTwo).save()
}

module.exports = {
    userOne,
    userTwo,
    userOneId,
    userTwoId,
    projectOne,
    projectTwo,
    projectOneId,
    projectTwoId,
    sprintOne,
    sprintTwo,
    sprintOneId,
    sprintTwoId,
    issueOne,
    issueTwo,
    issueOneId,
    issueTwoId,
    todoOne,
    todoTwo,
    todoOneId,
    todoTwoId,
    backlogOne,
    backlogOneId,
    backlogTwo,
    backlogTwoId,
    setupDatabase
}