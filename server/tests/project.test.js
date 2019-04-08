const request = require('supertest')
const app = require('../src/app')
const Project = require('../src/models/project')
const Backlog = require('../src/models/backlog')
const Sprint = require('../src/models/sprint')
const { projectOne, setupDatabase, userOne, userTwo } = require('./fixtures/db')

beforeEach(setupDatabase)

describe('Projects', () => {
    describe('Create', () => {
        test('Should not create project with _id property', async () => {
            await request(app)
                .post('/projects')
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    _id: "111111111111111111111111",
                    name: "or's project"
                })
                .expect(400)
            const project = await Project.findById("111111111111111111111111")
            expect(project).toBeNull()
        })

        test('Should not create project without name property', async () => {
            await request(app)
                .post('/projects')
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    description: "My first project."
                })
                .expect(400)
        })

        test('Should not create project as unauthenticated user', async () => {
            await request(app)
                .post('/projects')
                .send({
                    name: "or's project"
                })
                .expect(401)
        })

        test('Should create project', async () => {
            const response = await request(app)
                .post('/projects')
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    name: "or's project",
                    description: "My first project"
                })
                .expect(201)
            const project = await Project.findById(response.body._id)
            expect(project.name).toEqual("or's project")
            expect(project.ownerId).toEqual(userOne._id)
            expect(project.user[0].userId).toEqual(userOne._id)
            const backlog = await Backlog.findOne({ projectId: response.body._id })
            expect(backlog).not.toBeNull()
        })
    })

    describe('Read', () => {
        test('Should not read all projects as unauthenticated user', async () => {
            await request(app)
                .get('/projects')
                .send()
                .expect(401)
        })

        test('Should read all projects of user', async () => {
            const response = await request(app)
                .get('/projects')
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send()
                .expect(200)
            expect(response.body.length).toEqual(1)
        })
    })

    describe('Update', () => {
        test('Should not update project without properties', async () => {
            await request(app)
                .patch(`/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({})
                .expect(400)
            const project = await Project.findById(projectOne._id)
            expect(project).not.toBeNull()
            expect(project.name).toEqual(projectOne.name)
            expect(project.description).toEqual(projectOne.description)
        })

        test('Should not update project with _id property', async () => {
            await request(app)
                .patch(`/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    _id: "111111111111111111111111"
                })
                .expect(400)
            const project = await Project.findById(projectOne._id)
            expect(project).not.toBeNull()
            expect(project.name).toEqual(projectOne.name)
            expect(project.description).toEqual(projectOne.description)
        })

        test('Should not update project with empty name', async () => {
            await request(app)
                .patch(`/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    name: ""
                })
                .expect(400)
            const project = await Project.findById(projectOne._id)
            expect(project).not.toBeNull()
            expect(project.name).toEqual(projectOne.name)
            expect(project.description).toEqual(projectOne.description)
        })

        test('Should not update project as unauthenticated user', async () => {
            await request(app)
                .patch(`/projects/${projectOne._id}`)
                .send({
                    name: "or's updated project",
                    description: "My first updated project."
                })
                .expect(401)
            const project = await Project.findById(projectOne._id)
            expect(project.name).toEqual(projectOne.name)
            expect(project.description).toEqual(projectOne.description)
        })

        test('Should update project', async () => {
            await request(app)
                .patch(`/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    name: "or's updated project",
                    description: "My first updated project."
                })
                .expect(200)
            const project = await Project.findById(projectOne._id)
            expect(project).not.toBeNull()
            expect(project.name).toEqual("or's updated project")
            expect(project.description).toEqual("My first updated project.")
        })
    })

    describe('Delete', () => {
        test("Should not delete project as not project's owner", async () => {
            await request(app)
                .delete(`/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userTwo.token[0].token}`)
                .send()
                .expect(404) // didn't find the project for this user
            const project = await Project.findById(projectOne._id)
            expect(project).not.toBeNull()
            const backlog = await Backlog.findOne({ projectId: projectOne._id })
            expect(backlog).not.toBeNull()
            const sprint = await Sprint.findOne({ projectId: projectOne._id })
            expect(sprint).not.toBeNull()
        })

        test('Should delete project', async () => {
            await request(app)
                .delete(`/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send()
                .expect(200)
            const project = await Project.findById(projectOne._id)
            expect(project).toBeNull()
            const backlog = await Backlog.findOne({ projectId: projectOne._id })
            expect(backlog).toBeNull()
            const sprint = await Sprint.findOne({ projectId: projectOne._id })
            expect(sprint).toBeNull()
        })
    })
})
