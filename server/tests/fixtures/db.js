const mongoose = require('mongoose')
const Project = require('../../src/models/project')
const Sprint = require('../../src/models/sprint')
const Backlog = require('../../src/models/backlog')

const projectOneId = new mongoose.Types.ObjectId()
const projectOne = {
    _id: projectOneId,
    name: "or's project",
    description: 'My first project'
}

const projectTwoId = new mongoose.Types.ObjectId()
const projectTwo = {
    _id: projectTwoId,
    name: "or's second project",
    description: 'My second project'
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
    project: projectOne,
    description: "My first sprint.",
    issue: [issueOne]
}

const sprintTwoId = new mongoose.Types.ObjectId()
const sprintTwo = {
    _id: sprintTwoId,
    project: projectOne,
    description: "My second sprint."
}

const backlogOneId = new mongoose.Types.ObjectId()
const backlogOne = {
    _id: backlogOneId,
    project: projectOne,
    issue: [issueTwo]
}

const backlogTwoId = new mongoose.Types.ObjectId()
const backlogTwo = {
    _id: backlogTwoId,
    project: projectOne
}

const setupDatabase = async () => {
    await Backlog.deleteMany()
    await Project.deleteMany()
    await Sprint.deleteMany()
    await new Project(projectOne).save()
    await new Project(projectTwo).save()
    await new Backlog(backlogOne).save()
    await new Backlog(backlogTwo).save()
    await new Sprint(sprintOne).save()
    await new Sprint(sprintTwo).save()
}

module.exports = {
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