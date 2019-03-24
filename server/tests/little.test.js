const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { projectOne, projectTwo, projectOneId, projectTwoId, taskOne, taskOneId, taskTwo, taskTwoId, secondaryOne, secondaryOneId, secondaryTwo, secondaryTwoId, littleOne, littleOneId, littleTwo, littleTwoId, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

describe('littles', () => {
    describe('create', () => {
        test('Should not create little without properties', async () => {
            await request(app)
                .post('/littles')
                .send({})
                .expect(400)
        })

        test('Should not create little with invalid properties', async () => {
            await request(app)
                .post('/littles')
                .send({
                    secondary: secondaryOneId,
                    little: {
                        description: "My first little.",
                        createdAt: new Date().getTime()
                    }
                })
                .expect(400)
        })

        test('Should not create little without secondary property', async () => {
            await request(app)
                .post('/littles')
                .send({
                    little: {
                        description: "My first little."
                    }
                })
                .expect(400)
        })

        test('Should not create little without little object', async () => {
            await request(app)
                .post('/littles')
                .send({
                    secondary: secondaryOneId
                })
                .expect(400)
        })

        test('Should not create little for non-exist secondary', async () => {
            await request(app)
                .post('/littles')
                .send({
                    secondary: "111111111111111111111111",
                    little: {
                        description: "My first little."
                    }
                })
                .expect(404)
        })

        test('Should create little', async () => {
            const response = await request(app)
                .post('/littles')
                .send({
                    secondary: secondaryOneId,
                    little: {
                        description: "My first little.",
                        completed: true
                    }
                })
                .expect(201)
            const task = await Task.findOne({ 'secondary._id': secondaryOneId })
            let foundLittle = false
            task.secondary.forEach(s => {
                if (s._id.toString() === secondaryOneId.toString()) {
                    s.little.forEach(l => {
                        if (l._id.toString() === response.body._id) {
                            expect(l.description).toEqual("My first little.")
                            expect(l.completed).toEqual(true)
                            return foundLittle = true
                        }
                    })
                }
            })
            expect(foundLittle).toEqual(true)
        })
    })

    describe('update', () => {
        test('Should not update little without properties', async () => {
            await request(app)
                .patch(`/littles/${littleOneId}`)
                .send({})
                .expect(400)
        })

        test('Should not update little with invalid properties', async () => {
            await request(app)
                .patch(`/littles/${littleOneId}`)
                .send({
                    secondary: secondaryOneId,
                    little: {
                        _id: "111111111111111111111111",
                        description: "My first updated little."
                    }
                })
                .expect(400)
            const task = await Task.findOne({ 'secondary._id': secondaryOneId })
            let foundLittle = false
            task.secondary.forEach(s => {
                if (s._id.toString() === secondaryOneId.toString()) {
                    s.little.forEach(l => {
                        if (l._id.toString() === littleOneId.toString()) {
                            expect(l._id).not.toEqual("111111111111111111111111")
                            return foundLittle = true
                        }
                    })
                }
            })
            expect(foundLittle).toEqual(true)
        })

        test('Should not update little with empty description', async () => {
            await request(app)
                .patch(`/littles/${littleOneId}`)
                .send({
                    secondary: secondaryOneId,
                    little: {
                        description: ""
                    }
                })
                .expect(400)
            const task = await Task.findOne({ 'secondary._id': secondaryOneId })
            let foundLittle = false
            task.secondary.forEach(s => {
                if (s._id.toString() === secondaryOneId.toString()) {
                    s.little.forEach(l => {
                        if (l._id.toString() === littleOneId.toString()) {
                            expect(l.description).toEqual(littleOne.description)
                            return foundLittle = true
                        }
                    })
                }
            })
            expect(foundLittle).toEqual(true)
        })

        test('Should not update non-exist little', async () => {
            await request(app)
                .patch('/littles/111111111111111111111111')
                .send({
                    secondary: secondaryOneId,
                    little: {
                        description: "My first updated little."
                    }
                })
                .expect(404)
        })

        test('Should not update little without secondary property', async () => {
            await request(app)
                .patch(`/littles/${littleOneId}`)
                .send({
                    little: {
                        description: "My first updated little."
                    }
                })
                .expect(400)
        })

        test('Should not update little without little object', async () => {
            await request(app)
                .patch(`/littles/${littleOneId}`)
                .send({
                    secondary: secondaryOneId
                })
                .expect(400)
        })

        test('Should update little', async () => {
            await request(app)
                .patch(`/littles/${littleOneId}`)
                .send({
                    secondary: secondaryOneId,
                    little: {
                        description: "My first updated little."
                    }
                })
                .expect(200)
            const task = await Task.findOne({ 'secondary._id': secondaryOneId })
            let foundLittle = false
            task.secondary.forEach(s => {
                if (s._id.toString() === secondaryOneId.toString()) {
                    s.little.forEach(l => {
                        if (l._id.toString() === littleOneId.toString()) {
                            expect(l.description).toEqual("My first updated little.")
                            return foundLittle = true
                        }
                    })
                }
            })
            expect(foundLittle).toEqual(true)
        })
    })

    describe('delete', () => {
        test('Should not delete non-exist little', async () => {
            await request(app)
                .delete('/littles/111111111111111111111111')
                .send()
                .expect(404)
        })

        test('Should delete little', async () => {
            await request(app)
                .delete(`/littles/${littleOneId}`)
                .send()
                .expect(200)
            const task = await Task.findOne({ 'secondary._id': secondaryOneId })
            let foundLittle = false
            task.secondary.forEach(s => {
                if (s._id.toString() === secondaryOneId.toString()) {
                    s.little.forEach(l => {
                        if (l._id.toString() === littleOneId.toString()) {
                            return foundLittle = true
                        }
                    })
                }
            })
            expect(foundLittle).toEqual(false)
        })
    })
})