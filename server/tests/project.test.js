const request = require('supertest')
const app = require('../src/app')
const Project = require('../src/models/project')
const Backlog = require('../src/models/backlog')
const Sprint = require('../src/models/sprint')
const { projectOne, projectOneId, setupDatabase, userOne } = require('./fixtures/db')

beforeEach(setupDatabase)

describe('Projects', () => {
    describe('Create', () => {
        test('Should not create project without properties', async () => {
            await request(app)
                .post('/projects')
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({})
                .expect(400)
        })

        test('Should not create project with invalid properties', async () => {
            await request(app)
                .post('/projects')
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
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
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    description: "My first project."
                })
                .expect(400)
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
            expect(project).not.toBeNull()
            expect(project.name).toEqual("or's project")
            const backlog = await Backlog.findOne({projectId: response.body._id})
            expect(backlog).not.toBeNull()
        })
    })

    // describe('Read', () => {
    //     test('Should read all projects', async () => {
    //         const response = await request(app)
    //             .get('/projects')
    //             .set('Authorization', `Bearer ${userOne.token[0].token}`)
    //             .send()
    //             .expect(200)
    //         expect(response.body.length).toEqual(2)
    //     })

    //     // test("Should read all project's backlog and sprints data", async () => {
    //     //     const response = await request(app)
    //     //         .get(`/projects/${projectOneId}`)
    //     //         .set('Authorization', `Bearer ${userOne.token[0].token}`)
    //     //         .send()
    //     //         .expect(200)
    //     //     expect(response.body.backlog).not.toBeNull()
    //     //     expect(response.body.sprints).not.toBeNull()
    //     // })
    // })

    // describe('Update', () => {
    //     test('Should not update project without properties', async () => {
    //         await request(app)
    //             .patch(`/projects/${projectOneId}`)
    //             .set('Authorization', `Bearer ${userOne.token[0].token}`)
    //             .send({})
    //             .expect(400)
    //         const project = await Project.findById(projectOneId)
    //         expect(project).not.toBeNull()
    //         expect(project.name).toEqual(projectOne.name)
    //         expect(project.description).toEqual(projectOne.description)
    //     })

    //     test('Should not update project with invalid properties', async () => {
    //         await request(app)
    //             .patch(`/projects/${projectOneId}`)
    //             .set('Authorization', `Bearer ${userOne.token[0].token}`)
    //             .send({
    //                 _id: "111111111111111111111111",
    //                 createdAt: new Date().getTime()
    //             })
    //             .expect(400)
    //         const project = await Project.findById(projectOneId)
    //         expect(project).not.toBeNull()
    //         expect(project.name).toEqual(projectOne.name)
    //         expect(project.description).toEqual(projectOne.description)
    //     })

    //     test('Should not update project with empty name', async () => {
    //         await request(app)
    //             .patch(`/projects/${projectOneId}`)
    //             .set('Authorization', `Bearer ${userOne.token[0].token}`)
    //             .send({
    //                 name: ""
    //             })
    //             .expect(400)
    //         const project = await Project.findById(projectOneId)
    //         expect(project).not.toBeNull()
    //         expect(project.name).toEqual(projectOne.name)
    //         expect(project.description).toEqual(projectOne.description)
    //     })

    //     test('Should not update non-exist project', async () => {
    //         await request(app)
    //             .patch('/projects/111111111111111111111111')
    //             .set('Authorization', `Bearer ${userOne.token[0].token}`)
    //             .send({
    //                 name: "or's updated project",
    //                 description: "My first updated project."
    //             })
    //             .expect(404)
    //     })

    //     test('Should update project', async () => {
    //         await request(app)
    //             .patch(`/projects/${projectOneId}`)
    //             .set('Authorization', `Bearer ${userOne.token[0].token}`)
    //             .send({
    //                 name: "or's updated project",
    //                 description: "My first updated project."
    //             })
    //             .expect(200)
    //         const project = await Project.findById(projectOneId)
    //         expect(project).not.toBeNull()
    //         expect(project.name).toEqual("or's updated project")
    //         expect(project.description).toEqual("My first updated project.")
    //     })
    // })

    // describe('Delete', () => {
    //     test('Should not delete non-exist project', async () => {
    //         await request(app)
    //             .delete('/projects/111111111111111111111111')
    //             .set('Authorization', `Bearer ${userOne.token[0].token}`)
    //             .send()
    //             .expect(404)
    //     })

    //     test('Should delete project', async () => {
    //         await request(app)
    //             .delete(`/projects/${projectOneId}`)
    //             .set('Authorization', `Bearer ${userOne.token[0].token}`)
    //             .send()
    //             .expect(200)
    //         const project = await Project.findById(projectOneId)
    //         expect(project).toBeNull()
    //         const backlog = await Backlog.findOne({project: projectOneId})
    //         expect(backlog).toBeNull()
    //         const sprint = await Sprint.findOne({project: projectOneId})
    //         expect(sprint).toBeNull()
    //     })
    // })
})
