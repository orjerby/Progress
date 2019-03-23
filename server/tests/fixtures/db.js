const mongoose = require('mongoose')
const Project = require('../../src/models/project')

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

const setupDatabase = async () => {
    await Project.deleteMany()
    await new Project(projectOne).save()
    await new Project(projectTwo).save()
}

module.exports = {
    projectOne,
    projectTwo,
    projectOneId,
    projectTwoId,
    setupDatabase
}