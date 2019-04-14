const request = require('supertest')
const app = require('../src/app')
const Sprint = require('../src/models/sprint')
const { projectOne, sprintOne, userOne, userTwo, userThree, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

describe('Sprints', () => {
    describe('Create', () => {
        test('Should not create sprint with _id property', async () => {
            await request(app)
                .post(`/sprints/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({
                    _id: "111111111111111111111111",
                    name: "or's sprint"
                })
                .expect(400)
        })

        test('Should not create sprint without name property', async () => {
            await request(app)
                .post(`/sprints/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({
                    description: "My first sprint."
                })
                .expect(400)
        })

        test("Should not create sprint as not project's owner", async () => {
            await request(app)
                .post(`/sprints/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userTwo.token[0].token}`])
                .send({
                    name: "or's sprint",
                    description: "My first sprint."
                })
                .expect(404) // didn't find the project for this user
        })

        test('Should create sprint', async () => {
            const response = await request(app)
                .post(`/sprints/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({
                    name: "or's sprint",
                    description: "My first sprint."
                })
                .expect(201)
            const sprint = await Sprint.findById(response.body._id)
            expect(sprint).not.toBeNull()
            expect(sprint.projectId).toEqual(projectOne._id)
            expect(sprint.description).toEqual("My first sprint.")
        })
    })

    describe('Read', () => {
        test("Should not read sprints for project as not project's member", async () => {
            await request(app)
                .get(`/sprints/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userThree.token[0].token}`])
                .send()
                .expect(404) // didn't find the project for this user
        })

        test('Should read sprints for project', async () => {
            const response = await request(app)
                .get(`/sprints/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send()
                .expect(200)
            expect(response.body.length).toEqual(1)
        })
    })
    
    describe('Update', () => {
        test('Should not update sprint without properties', async () => {
            await request(app)
                .patch(`/sprints/${sprintOne._id}/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({})
                .expect(400)
            const sprint = await Sprint.findById(sprintOne._id)
            expect(sprint.name).toEqual(sprintOne.name)
        })

        test('Should not update sprint with _id property', async () => {
            await request(app)
                .patch(`/sprints/${sprintOne._id}/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({
                    _id: "111111111111111111111111"
                })
                .expect(400)
            const sprint = await Sprint.findById(sprintOne._id)
            expect(sprint.name).toEqual(sprintOne.name)
        })

        test('Should not update sprint with empty name', async () => {
            await request(app)
                .patch(`/sprints/${sprintOne._id}/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({
                    name: ""
                })
                .expect(400)
            const sprint = await Sprint.findById(sprintOne._id)
            expect(sprint.name).toEqual(sprintOne.name)
        })

        test("Should not update sprint as not project's owner", async () => {
            await request(app)
                .patch(`/sprints/${sprintOne._id}/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userTwo.token[0].token}`])
                .send({
                    name: "or's updated sprint",
                    description: "My first updated sprint."
                })
                .expect(404) // didn't find the project for this user
            const sprint = await Sprint.findById(sprintOne._id)
            expect(sprint.name).toEqual(sprintOne.name)
            expect(sprint.description).toEqual(sprintOne.description)
        })

        test('Should update sprint', async () => {
            await request(app)
                .patch(`/sprints/${sprintOne._id}/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({
                    name: "or's updated sprint",
                    description: "My first updated sprint."
                })
                .expect(200)
            const sprint = await Sprint.findById(sprintOne._id)
            expect(sprint.name).toEqual("or's updated sprint")
            expect(sprint.description).toEqual("My first updated sprint.")
        })
    })

    describe('Delete', () => {
        test("Should not delete sprint as not the project's owner", async () => {
            await request(app)
                .delete(`/sprints/${sprintOne._id}/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userTwo.token[0].token}`])
                .send()
                .expect(404) // didn't find the project for this user
            const sprint = await Sprint.findById(sprintOne._id)
            expect(sprint).not.toBeNull()
        })

        test('Should delete sprint', async () => {
            await request(app)
                .delete(`/sprints/${sprintOne._id}/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send()
                .expect(200)
            const sprint = await Sprint.findById(sprintOne._id)
            expect(sprint).toBeNull()
        })
    })
})
