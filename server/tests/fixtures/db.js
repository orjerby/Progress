const mongoose = require('mongoose')
const Project = require('../../src/models/project')
const Task = require('../../src/models/task')

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

const taskOneId = new mongoose.Types.ObjectId()
const taskOne = {
    _id: taskOneId,
    project: projectOne,
    description: "My first task."
}

const taskTwoId = new mongoose.Types.ObjectId()
const taskTwo = {
    _id: taskTwoId,
    project: projectOne,
    description: "My second task."
}

const setupDatabase = async () => {
    await Project.deleteMany()
    await Task.deleteMany()
    await new Project(projectOne).save()
    await new Project(projectTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
}

module.exports = {
    projectOne,
    projectTwo,
    projectOneId,
    projectTwoId,
    taskOne,
    taskTwo,
    taskOneId,
    taskTwoId,
    setupDatabase
}