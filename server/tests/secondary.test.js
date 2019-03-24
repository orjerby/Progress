const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { projectOne, projectTwo, projectOneId, projectTwoId, taskOne, taskOneId, taskTwo, taskTwoId, secondaryOne, secondaryOneId, secondaryTwo, secondaryTwoId, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

describe('secondaries', () => {
    describe('create', () => {
        test('Should not create secondary without properties', async () => {
            await request(app)
                .post('/secondaries')
                .send({})
                .expect(400)
        })

        test('Should not create secondary with invalid properties', async () => {
            await request(app)
                .post('/secondaries')
                .send({
                    task: taskOneId,
                    secondary: {
                        description: "My first secondary.",
                        createdAt: new Date().getTime()
                    }
                })
                .expect(400)
        })

        test('Should not create secondary without task property', async () => {
            await request(app)
                .post('/secondaries')
                .send({
                    secondary: {
                        description: "My first secondary."
                    }
                })
                .expect(400)
        })

        test('Should not create secondary without secondary object', async () => {
            await request(app)
                .post('/secondaries')
                .send({
                    task: taskOneId
                })
                .expect(400)
        })

        test('Should not create secondary for non-exist task', async () => {
            await request(app)
                .post('/secondaries')
                .send({
                    task: "111111111111111111111111",
                    secondary: {
                        description: "My first secondary."
                    }
                })
                .expect(404)
        })

        test('Should create secondary', async () => {
            const response = await request(app)
                .post('/secondaries')
                .send({
                    task: taskOneId,
                    secondary: {
                        description: "My first secondary."
                    }
                })
                .expect(201)
            const task = await Task.findById(taskOneId)
            let foundSecondary = false
            task.secondary.forEach(s => {
                if (s._id.toString() === response.body._id) {
                    expect(s.description).toEqual("My first secondary.")
                    expect(s.completed).toEqual(false)
                    return foundSecondary = true
                }
            })
            expect(foundSecondary).toEqual(true)
        })
    })

    describe('update', () => {
        test('Should not update secondary without properties', async () => {
            await request(app)
                .patch(`/secondaries/${secondaryOneId}`)
                .send({})
                .expect(400)
        })

        test('Should not update secondary with invalid properties', async () => {
            await request(app)
                .patch(`/secondaries/${secondaryOneId}`)
                .send({
                    _id: "111111111111111111111111",
                    description: "My first updated secondary."
                })
                .expect(400)
            const task = await Task.findById(taskOneId)
            let foundSecondary = false
            task.secondary.forEach(s => {
                if (s._id.toString() === secondaryOneId.toString()) {
                    expect(s._id).not.toEqual("111111111111111111111111")
                    return foundSecondary = true
                }
            })
            expect(foundSecondary).toEqual(true)
        })

        test('Should not update secondary with empty description', async () => {
            await request(app)
                .patch(`/secondaries/${secondaryOneId}`)
                .send({
                    description: ""
                })
                .expect(400)
            const task = await Task.findById(taskOneId)
            let foundSecondary = false
            task.secondary.forEach(s => {
                if (s._id.toString() === secondaryOneId.toString()) {
                    expect(s.description).toEqual(secondaryOne.description)
                    return foundSecondary = true
                }
            })
            expect(foundSecondary).toEqual(true)
        })

        test('Should not update non-exist secondary', async () => {
            await request(app)
                .patch('/secondaries/111111111111111111111111')
                .send({
                    description: "My first updated secondary."
                })
                .expect(404)
        })

        test('Should update secondary', async () => {
            await request(app)
                .patch(`/secondaries/${secondaryOneId}`)
                .send({
                    description: "My first updated secondary.",
                    completed: true
                })
                .expect(200)
            const task = await Task.findById(taskOneId)
            let foundSecondary = false
            task.secondary.forEach(s => {
                if (s._id.toString() === secondaryOneId.toString()) {
                    expect(s.description).toEqual("My first updated secondary.")
                    expect(s.completed).toEqual(true)
                    return foundSecondary = true
                }
            })
            expect(foundSecondary).toEqual(true)
        })
    })

    describe('delete', () => {
        test('Should not delete non-exist secondary', async () => {
            await request(app)
                .delete('/secondaries/111111111111111111111111')
                .send()
                .expect(404)
        })

        test('Should delete secondary', async () => {
            await request(app)
                .delete(`/secondaries/${secondaryOneId}`)
                .send()
                .expect(200)
            const task = await Task.findById(taskOneId)
            let foundSecondary = false
            task.secondary.forEach(s => {
                if (s._id.toString() === secondaryOneId.toString()) {
                    return foundSecondary = true
                }
            })
            expect(foundSecondary).toEqual(false)
        })
    })
})
