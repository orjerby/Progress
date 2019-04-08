const request = require('supertest')
const app = require('../src/app')
const Sprint = require('../src/models/sprint')
const Backlog = require('../src/models/backlog')
const { issueOne, issueTwo, todoOne, todoTwo, userOne, userTwo, userThree, projectOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

describe('Todos', () => {
    describe('Create (sprint)', () => {
        test('Should not create todo without properties', async () => {
            await request(app)
                .post(`/todos/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({})
                .expect(400)
        })

        test('Should not create todo with _id property', async () => {
            await request(app)
                .post(`/todos/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    _id: "111111111111111111111111",
                    name: "or's todo"
                })
                .expect(400)
        })

        test('Should not create todo without name property', async () => {
            await request(app)
                .post(`/todos/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    description: "my first todo"
                })
                .expect(400)
        })

        test('Should not create todo for non-exist issue', async () => {
            await request(app)
                .post(`/todos/issues/111111111111111111111111/sprints/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    name: "or's todo"
                })
                .expect(404)
        })

        test('Should not create todo for non-exist project', async () => {
            await request(app)
                .post(`/todos/issues/${issueTwo._id}/sprints/projects/111111111111111111111111`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    name: "or's todo"
                })
                .expect(404)
        })

        test("Should not create todo as not the project's owner", async () => {
            const response = await request(app)
                .post(`/todos/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userTwo.token[0].token}`)
                .send({
                    name: "or's todo",
                    description: "My first todo."
                })
                .expect(404) // didn't find the project of this user
            const task = await Sprint.findOne({ 'issue._id': issueTwo._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueTwo._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === response.body._id) {
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(false)
        })

        test('Should create todo', async () => {
            const response = await request(app)
                .post(`/todos/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    name: "or's todo",
                    description: "My first todo."
                })
                .expect(201)
            const task = await Sprint.findOne({ 'issue._id': issueTwo._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueTwo._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === response.body._id) {
                            expect(t.name).toEqual("or's todo")
                            expect(t.description).toEqual("My first todo.")
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(true)
        })
    })

    describe('Create (backlog)', () => {
        test('Should not create todo without properties', async () => {
            await request(app)
                .post(`/todos/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({})
                .expect(400)
        })

        test('Should not create todo with _id property', async () => {
            await request(app)
                .post(`/todos/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    _id: "111111111111111111111111",
                    name: "or's todo"
                })
                .expect(400)
        })

        test('Should not create todo without name property', async () => {
            await request(app)
                .post(`/todos/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    description: "my first todo"
                })
                .expect(400)
        })

        test('Should not create todo for non-exist issue', async () => {
            await request(app)
                .post(`/todos/issues/111111111111111111111111/backlogs/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    name: "or's todo"
                })
                .expect(404)
        })

        test('Should not create todo for non-exist issue', async () => {
            await request(app)
                .post(`/todos/issues/${issueOne._id}/backlogs/projects/111111111111111111111111`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    name: "or's todo"
                })
                .expect(404)
        })

        test("Should not create todo as not the project's owner", async () => {
            const response = await request(app)
                .post(`/todos/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userTwo.token[0].token}`)
                .send({
                    name: "or's todo",
                    description: "My first todo."
                })
                .expect(404) // didn't find the project of this user
            const task = await Backlog.findOne({ 'issue._id': issueOne._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueOne._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === response.body._id) {
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(false)
        })

        test('Should create todo', async () => {
            const response = await request(app)
                .post(`/todos/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    name: "or's todo",
                    description: "My first todo."
                })
                .expect(201)
            const task = await Backlog.findOne({ 'issue._id': issueOne._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueOne._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === response.body._id) {
                            expect(t.name).toEqual("or's todo")
                            expect(t.description).toEqual("My first todo.")
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(true)
        })
    })

    describe('Update (sprint)', () => {
        test('Should not update todo without properties', async () => {
            await request(app)
                .patch(`/todos/${todoTwo._id}/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({})
                .expect(400)
        })

        test('Should not update todo with _id property', async () => {
            await request(app)
                .patch(`/todos/${todoTwo._id}/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    _id: "111111111111111111111111",
                    name: "or's todo"
                })
                .expect(400)
            const task = await Sprint.findOne({ 'issue._id': issueTwo._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueTwo._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === todoTwo._id.toString()) {
                            expect(t._id).not.toEqual("111111111111111111111111")
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(true)
        })

        test('Should not update todo with empty name', async () => {
            await request(app)
                .patch(`/todos/${todoTwo._id}/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    name: ""
                })
                .expect(400)
            const task = await Sprint.findOne({ 'issue._id': issueTwo._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueTwo._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === todoTwo._id.toString()) {
                            expect(t.name).toEqual(todoTwo.name)
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(true)
        })

        test('Should not update non-exist todo', async () => {
            await request(app)
                .patch(`/todos/111111111111111111111111/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    name: "or's todo"
                })
                .expect(404)
        })

        test("Should not update name as not project's owner", async () => {
            await request(app)
                .patch(`/todos/${todoTwo._id}/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userTwo.token[0].token}`)
                .send({
                    name: "or's updated todo"
                })
                .expect(400)
            const task = await Sprint.findOne({ 'issue._id': issueTwo._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueTwo._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === todoTwo._id.toString()) {
                            expect(t.name).toEqual(todoTwo.name)
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(true)
        })

        test("Should update name as project's owner", async () => {
            await request(app)
                .patch(`/todos/${todoTwo._id}/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    name: "or's updated todo"
                })
                .expect(200)
            const task = await Sprint.findOne({ 'issue._id': issueTwo._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueTwo._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === todoTwo._id.toString()) {
                            expect(t.name).toEqual("or's updated todo")
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(true)
        })

        test("Should not update status as not project's member", async () => {
            await request(app)
                .patch(`/todos/${todoTwo._id}/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userThree.token[0].token}`)
                .send({
                    status: "undone"
                })
                .expect(404) // didn't find project of this user
            const task = await Sprint.findOne({ 'issue._id': issueTwo._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueTwo._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === todoTwo._id.toString()) {
                            expect(t.name).toEqual(todoTwo.name)
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(true)
        })

        test("Should update status as project's member", async () => {
            await request(app)
                .patch(`/todos/${todoTwo._id}/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userTwo.token[0].token}`)
                .send({
                    status: "undone"
                })
                .expect(200)
            const task = await Sprint.findOne({ 'issue._id': issueTwo._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueTwo._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === todoTwo._id.toString()) {
                            expect(t.status).toEqual("undone")
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(true)
        })
    })

    describe('Update (backlog)', () => {
        test('Should not update todo without properties', async () => {
            await request(app)
                .patch(`/todos/${todoOne._id}/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({})
                .expect(400)
        })

        test('Should not update todo with _id property', async () => {
            await request(app)
                .patch(`/todos/${todoOne._id}/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    _id: "111111111111111111111111",
                    name: "or's todo"
                })
                .expect(400)
            const task = await Backlog.findOne({ 'issue._id': issueOne._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueOne._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === todoOne._id.toString()) {
                            expect(t._id).not.toEqual("111111111111111111111111")
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(true)
        })

        test('Should not update todo with empty name', async () => {
            await request(app)
                .patch(`/todos/${todoOne._id}/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    name: ""
                })
                .expect(400)
            const task = await Backlog.findOne({ 'issue._id': issueOne._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueOne._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === todoOne._id.toString()) {
                            expect(t.name).toEqual(todoOne.name)
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(true)
        })

        test('Should not update non-exist todo', async () => {
            await request(app)
                .patch(`/todos/111111111111111111111111/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    name: "or's todo"
                })
                .expect(404)
        })

        test("Should not update name as not project's owner", async () => {
            await request(app)
                .patch(`/todos/${todoOne._id}/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userTwo.token[0].token}`)
                .send({
                    name: "or's updated todo"
                })
                .expect(400)
            const task = await Backlog.findOne({ 'issue._id': issueOne._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueOne._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === todoOne._id.toString()) {
                            expect(t.name).toEqual(todoOne.name)
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(true)
        })

        test("Should update name as project's owner", async () => {
            await request(app)
                .patch(`/todos/${todoOne._id}/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send({
                    name: "or's updated todo"
                })
                .expect(200)
            const task = await Backlog.findOne({ 'issue._id': issueOne._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueOne._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === todoOne._id.toString()) {
                            expect(t.name).toEqual("or's updated todo")
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(true)
        })

        test("Should not update status as not project's member", async () => {
            await request(app)
                .patch(`/todos/${todoOne._id}/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userThree.token[0].token}`)
                .send({
                    status: "undone"
                })
                .expect(404) // didn't find project of this user
            const task = await Backlog.findOne({ 'issue._id': issueOne._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueOne._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === todoOne._id.toString()) {
                            expect(t.name).toEqual(todoOne.name)
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(true)
        })

        test("Should update status as project's member", async () => {
            await request(app)
                .patch(`/todos/${todoOne._id}/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userTwo.token[0].token}`)
                .send({
                    status: "undone"
                })
                .expect(200)
            const task = await Backlog.findOne({ 'issue._id': issueOne._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueOne._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === todoOne._id.toString()) {
                            expect(t.status).toEqual("undone")
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(true)
        })
    })

    describe('Delete (sprint)', () => {
        test("Should not delete todo as not project's owner", async () => {
            await request(app)
                .delete(`/todos/${todoTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userTwo.token[0].token}`)
                .send()
                .expect(404)
            const task = await Sprint.findOne({ 'issue._id': issueTwo._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueTwo._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === todoTwo._id.toString()) {
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(true)
        })

        test('Should delete todo', async () => {
            await request(app)
                .delete(`/todos/${todoTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send()
                .expect(200)
            const task = await Sprint.findOne({ 'issue._id': issueTwo._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueTwo._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === todoTwo._id.toString()) {
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(false)
        })
    })

    describe('Delete (backlog)', () => {
        test("Should not delete todo as not project's owner", async () => {
            await request(app)
                .delete(`/todos/${todoOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userTwo.token[0].token}`)
                .send()
                .expect(404)
            const task = await Backlog.findOne({ 'issue._id': issueOne._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueOne._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === todoOne._id.toString()) {
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(true)
        })

        test('Should delete todo', async () => {
            await request(app)
                .delete(`/todos/${todoOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Authorization', `Bearer ${userOne.token[0].token}`)
                .send()
                .expect(200)
            const task = await Backlog.findOne({ 'issue._id': issueOne._id })
            let foundTodo = false
            task.issue.forEach(i => {
                if (i._id.toString() === issueOne._id.toString()) {
                    i.todo.forEach(t => {
                        if (t._id.toString() === todoOne._id.toString()) {
                            return foundTodo = true
                        }
                    })
                }
            })
            expect(foundTodo).toEqual(false)
        })
    })
})