const request = require('supertest')
const app = require('../src/app')
const Project = require('../src/models/project')
const { projectOne, projectOneId, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

describe('Projects', () => {
    describe('Create', () => {
        test('Should not create project without properties', async () => {
            await request(app)
                .post('/projects')
                .send({})
                .expect(400)
        })

        test('Should not create project with invalid properties', async () => {
            await request(app)
                .post('/projects')
                .send({
                    _id: "111111111111111111111111",
                    name: "or's project",
                    description: "My first project"
                })
                .expect(400)
            const project = await Project.findById("111111111111111111111111")
            expect(project).toBeNull()
        })

        test('Should not create project without name property', async () => {
            await request(app)
                .post('/projects')
                .send({
                    description: "My first project."
                })
                .expect(400)
        })

        test('Should create project', async () => {
            const response = await request(app)
                .post('/projects')
                .send({
                    name: "or's project",
                    description: "My first project"
                })
                .expect(201)
            const project = await Project.findById(response.body._id)
            expect(project).not.toBeNull()
            expect(project.name).toEqual("or's project")
        })
    })

    describe('Read', () => {
        test('Should read all projects', async () => {
            const response = await request(app)
                .get('/projects')
                .send()
                .expect(200)
            expect(response.body.length).toEqual(2)
        })
    })

    describe('Update', () => {
        test('Should not update project without properties', async () => {
            await request(app)
                .patch(`/projects/${projectOneId}`)
                .send({})
                .expect(400)
            const project = await Project.findById(projectOneId)
            expect(project).not.toBeNull()
            expect(project.name).toEqual(projectOne.name)
            expect(project.description).toEqual(projectOne.description)
        })

        test('Should not update project with invalid properties', async () => {
            await request(app)
                .patch(`/projects/${projectOneId}`)
                .send({
                    _id: "111111111111111111111111",
                    createdAt: new Date().getTime()
                })
                .expect(400)
            const project = await Project.findById(projectOneId)
            expect(project).not.toBeNull()
            expect(project.name).toEqual(projectOne.name)
            expect(project.description).toEqual(projectOne.description)
        })

        test('Should not update project with empty name', async () => {
            await request(app)
                .patch(`/projects/${projectOneId}`)
                .send({
                    name: ""
                })
                .expect(400)
            const project = await Project.findById(projectOneId)
            expect(project).not.toBeNull()
            expect(project.name).toEqual(projectOne.name)
            expect(project.description).toEqual(projectOne.description)
        })

        test('Should not update non-exist project', async () => {
            await request(app)
                .patch('/projects/111111111111111111111111')
                .send({
                    name: "or's updated project",
                    description: "My first updated project."
                })
                .expect(404)
        })

        test('Should update project', async () => {
            await request(app)
                .patch(`/projects/${projectOneId}`)
                .send({
                    name: "or's updated project",
                    description: "My first updated project."
                })
                .expect(200)
            const project = await Project.findById(projectOneId)
            expect(project).not.toBeNull()
            expect(project.name).toEqual("or's updated project")
            expect(project.description).toEqual("My first updated project.")
        })
    })

    describe('Delete', () => {
        test('Should not delete non-exist project', async () => {
            await request(app)
                .delete('/projects/111111111111111111111111')
                .send()
                .expect(404)
        })

        test('Should delete project', async () => {
            await request(app)
                .delete(`/projects/${projectOneId}`)
                .send()
                .expect(200)
            const project = await Project.findById(projectOneId)
            expect(project).toBeNull()
        })
    })
})
