const request = require('supertest')
const app = require('../src/app')
const Sprint = require('../src/models/sprint')
const { projectOneId, sprintOne, sprintOneId, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

describe('Sprints', () => {
    describe('Create', () => {
        test('Should not create sprint without properties', async () => {
            await request(app)
                .post('/sprints')
                .send({})
                .expect(400)
        })

        test('Should not create sprint with invalid properties', async () => {
            await request(app)
                .post('/sprints')
                .send({
                    projectId: projectOneId,
                    description: "My first sprint.",
                    createdAt: new Date().getTime()
                })
                .expect(400)
        })

        test('Should not create sprint without project property', async () => {
            await request(app)
                .post('/sprints')
                .send({
                    description: "My first sprint."
                })
                .expect(400)
        })

        test('Should create sprint', async () => {
            const response = await request(app)
                .post('/sprints')
                .send({
                    projectId: projectOneId,
                    description: "My first sprint."
                })
                .expect(201)
            const sprint = await Sprint.findById(response.body._id)
            expect(sprint).not.toBeNull()
            expect(sprint.projectId).toEqual(projectOneId)
            expect(sprint.description).toEqual("My first sprint.")
        })
    })

    describe('Read', () => {
        test('Should not read sprints without projectId query', async () => {
            await request(app)
                .get(`/sprints`)
                .send()
                .expect(404)
        })

        test('Should read sprints for project', async () => {
            const response = await request(app)
                .get(`/sprints?projectId=${projectOneId}`)
                .send()
                .expect(200)
            expect(response.body.length).toEqual(2)
        })
    })

    describe('Update', () => {
        test('Should not update sprint without properties', async () => {
            await request(app)
                .patch(`/sprints/${sprintOneId}`)
                .send({})
                .expect(400)
            const sprint = await Sprint.findById(sprintOneId)
            expect(sprint).not.toBeNull()
            expect(sprint.description).toEqual(sprintOne.description)
        })

        test('Should not update sprint with invalid properties', async () => {
            await request(app)
                .patch(`/sprints/${sprintOneId}`)
                .send({
                    _id: "111111111111111111111111"
                })
                .expect(400)
            const sprint = await Sprint.findById(sprintOneId)
            expect(sprint).not.toBeNull()
            expect(sprint.description).toEqual(sprintOne.description)
        })

        test('Should not update sprint with empty description', async () => {
            await request(app)
                .patch(`/sprints/${sprintOneId}`)
                .send({
                    description: ""
                })
                .expect(400)
            const sprint = await Sprint.findById(sprintOneId)
            expect(sprint).not.toBeNull()
            expect(sprint.description).toEqual(sprintOne.description)
        })

        test('Should not update non-exist sprint', async () => {
            await request(app)
                .patch('/sprints/111111111111111111111111')
                .send({
                    description: "My first updated sprint."
                })
                .expect(404)
        })

        test('Should update sprint', async () => {
            await request(app)
                .patch(`/sprints/${sprintOneId}`)
                .send({
                    description: "My first updated sprint."
                })
                .expect(200)
            const sprint = await Sprint.findById(sprintOneId)
            expect(sprint).not.toBeNull()
            expect(sprint.description).toEqual("My first updated sprint.")
        })
    })

    describe('Delete', () => {
        test('Should not delete non-exist sprint', async () => {
            await request(app)
                .delete('/sprints/111111111111111111111111')
                .send()
                .expect(404)
        })

        test('Should delete sprint', async () => {
            await request(app)
                .delete(`/sprints/${sprintOneId}`)
                .send()
                .expect(200)
            const sprint = await Sprint.findById(sprintOneId)
            expect(sprint).toBeNull()
        })
    })
})
