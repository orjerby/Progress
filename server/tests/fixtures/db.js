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
    name: "michal",
    email: "michal@gmail.com",
    password: "michal123",
    token: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const userThreeId = new mongoose.Types.ObjectId()
const userThree = {
    _id: userThreeId,
    name: "shir",
    email: "shir@gmail.com",
    password: "shir123",
    token: [{
        token: jwt.sign({ _id: userThreeId }, process.env.JWT_SECRET)
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

const todoOneId = new mongoose.Types.ObjectId()
const todoOne = {
    _id: todoOneId,
    name: "Or's todo",
    description: "My first todo.",
    status: "progress",
    priority: "low"
}

const todoTwoId = new mongoose.Types.ObjectId()
const todoTwo = {
    _id: todoTwoId,
    name: "mihcal's todo",
    description: "My first todo.",
    status: "done",
    priority: "medium"
}

const issueOneId = new mongoose.Types.ObjectId()
const issueOne = {
    _id: issueOneId,
    name: "or's issue",
    description: "My first issue.",
    todo: [todoOne]
}

const issueTwoId = new mongoose.Types.ObjectId()
const issueTwo = {
    _id: issueTwoId,
    name: "michal's issue",
    description: "My first issue.",
    todo: [todoTwo]
}

const sprintOneId = new mongoose.Types.ObjectId()
const sprintOne = {
    _id: sprintOneId,
    projectId: projectOneId,
    name: "or's sprint",
    description: "My first sprint.",
    issue: [issueTwo]
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
    await new User(userTwo).save()
    await new User(userThree).save()
    await new Project(projectOne).save()
    await new Backlog(backlogOne).save()
    await new Sprint(sprintOne).save()
}

module.exports = {
    userOne,
    userTwo,
    userThree,
    projectOne,
    sprintOne,
    issueOne,
    issueTwo,
    todoOne,
    todoTwo,
    backlogOne,
    setupDatabase
}