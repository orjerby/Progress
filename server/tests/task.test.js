const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { projectOne, projectTwo, projectOneId, projectTwoId, taskOne, taskOneId, taskTwo, taskTwoId, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

describe('tasks', () => {
    describe('create', () => {
        test('Should not create task without properties', async () => {
            await request(app)
                .post('/tasks')
                .send({})
                .expect(400)
        })

        test('Should not create task with invalid properties', async () => {
            await request(app)
                .post('/tasks')
                .send({
                    project: projectOneId,
                    description: "My first task.",
                    createdAt: new Date().getTime()
                })
                .expect(400)
        })

        test('Should not create task without project property', async () => {
            await request(app)
                .post('/tasks')
                .send({
                    description: "My first task."
                })
                .expect(400)
        })

        test('Should create task', async () => {
            const response = await request(app)
                .post('/tasks')
                .send({
                    project: projectOneId,
                    description: "My first task."
                })
                .expect(201)
            const task = await Task.findById(response.body._id)
            expect(task).not.toBeNull()
            expect(task.project).toEqual(projectOneId)
            expect(task.description).toEqual("My first task.")
        })
    })

    describe('read', () => {
        test('Should not read tasks without projectid query', async () => {
            await request(app)
                .get(`/tasks`)
                .send()
                .expect(404)
        })

        test('Should read tasks for project', async () => {
            const response = await request(app)
                .get(`/tasks?projectid=${projectOneId}`)
                .send()
                .expect(200)
            expect(response.body.length).toEqual(2)
        })
    })

    describe('update', () => {
        test('Should not update task without properties', async () => {
            await request(app)
                .patch(`/tasks/${taskOneId}`)
                .send({})
                .expect(400)
            const task = await Task.findById(taskOneId)
            expect(task).not.toBeNull()
            expect(task.description).toEqual(taskOne.description)
        })

        test('Should not update task with invalid properties', async () => {
            await request(app)
                .patch(`/tasks/${taskOneId}`)
                .send({
                    _id: "111111111111111111111111"
                })
                .expect(400)
            const task = await Task.findById(taskOneId)
            expect(task).not.toBeNull()
            expect(task.description).toEqual(taskOne.description)
        })

        test('Should not update task with empty description', async () => {
            await request(app)
                .patch(`/tasks/${taskOneId}`)
                .send({
                    description: ""
                })
                .expect(400)
            const task = await Task.findById(taskOneId)
            expect(task).not.toBeNull()
            expect(task.description).toEqual(taskOne.description)
        })

        test('Should not update non-exist task', async () => {
            await request(app)
                .patch('/tasks/111111111111111111111111')
                .send({
                    description: "My first updated task."
                })
                .expect(404)
        })

        test('Should update task', async () => {
            await request(app)
                .patch(`/tasks/${taskOneId}`)
                .send({
                    description: "My first updated task."
                })
                .expect(200)
            const task = await Task.findById(taskOneId)
            expect(task).not.toBeNull()
            expect(task.description).toEqual("My first updated task.")
        })
    })

    describe('delete', () => {
        test('Should not delete non-exist task', async () => {
            await request(app)
                .delete('/tasks/111111111111111111111111')
                .send()
                .expect(404)
        })

        test('Should delete task', async () => {
            await request(app)
                .delete(`/tasks/${taskOneId}`)
                .send()
                .expect(200)
            const task = await Task.findById(taskOneId)
            expect(task).toBeNull()
        })
    })
})
