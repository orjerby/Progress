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

const littleOneId = new mongoose.Types.ObjectId()
const littleOne = {
    _id: littleOneId,
    description: "My first little."
}

const littleTwoId = new mongoose.Types.ObjectId()
const littleTwo = {
    _id: littleTwoId,
    description: "My second little."
}

const secondaryOneId = new mongoose.Types.ObjectId()
const secondaryOne = {
    _id: secondaryOneId,
    description: "My first secondary.",
    little: [littleOne, littleTwo]
}

const secondaryTwoId = new mongoose.Types.ObjectId()
const secondaryTwo = {
    _id: secondaryTwoId,
    description: "My second secondary.",
    completed: true
}

const taskOneId = new mongoose.Types.ObjectId()
const taskOne = {
    _id: taskOneId,
    project: projectOne,
    description: "My first task.",
    secondary: [secondaryOne, secondaryTwo]
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
    secondaryOne,
    secondaryTwo,
    secondaryOneId,
    secondaryTwoId,
    littleOne,
    littleTwo,
    littleOneId,
    littleTwoId,
    setupDatabase
}