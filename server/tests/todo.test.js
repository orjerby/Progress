// const request = require('supertest')
// const app = require('../src/app')
// const Sprint = require('../src/models/sprint')
// const { issueOneId, todoOne, todoOneId, setupDatabase, userOne, projectOneId } = require('./fixtures/db')

// beforeEach(setupDatabase)

// describe('Todos', () => {
//     describe('Create', () => {
//         test('Should not create todo without properties', async () => {
//             await request(app)
//                 .post(`/todos?parent=sprint&projectId=${projectOneId}`)
//                 .set('Authorization', `Bearer ${userOne.token[0].token}`)
//                 .send({})
//                 .expect(400)
//         })

//         test('Should not create todo with invalid properties', async () => {
//             await request(app)
//                 .post(`/todos?parent=sprint&projectId=${projectOneId}`)
//                 .set('Authorization', `Bearer ${userOne.token[0].token}`)
//                 .send({
//                     issueId: issueOneId,
//                     todo: {
//                         description: "My first todo.",
//                         createdAt: new Date().getTime()
//                     }
//                 })
//                 .expect(400)
//         })

//         test('Should not create todo without issue property', async () => {
//             await request(app)
//                 .post(`/todos?parent=sprint&projectId=${projectOneId}`)
//                 .set('Authorization', `Bearer ${userOne.token[0].token}`)
//                 .send({
//                     todo: {
//                         description: "My first todo."
//                     }
//                 })
//                 .expect(400)
//         })

//         test('Should not create todo without todo object', async () => {
//             await request(app)
//                 .post(`/todos?parent=sprint&projectId=${projectOneId}`)
//                 .set('Authorization', `Bearer ${userOne.token[0].token}`)
//                 .send({
//                     issueId: issueOneId
//                 })
//                 .expect(400)
//         })

//         test('Should not create todo for non-exist issue', async () => {
//             await request(app)
//                 .post(`/todos?parent=sprint&projectId=${projectOneId}`)
//                 .set('Authorization', `Bearer ${userOne.token[0].token}`)
//                 .send({
//                     issueId: "111111111111111111111111",
//                     todo: {
//                         description: "My first todo."
//                     }
//                 })
//                 .expect(404)
//         })

//         test('Should create todo', async () => {
//             const response = await request(app)
//                 .post(`/todos?parent=sprint&projectId=${projectOneId}`)
//                 .set('Authorization', `Bearer ${userOne.token[0].token}`)
//                 .send({
//                     issueId: issueOneId,
//                     todo: {
//                         description: "My first todo."
//                     }
//                 })
//                 .expect(201)
//             const task = await Sprint.findOne({ 'issue._id': issueOneId })
//             let foundTodo = false
//             task.issue.forEach(s => {
//                 if (s._id.toString() === issueOneId.toString()) {
//                     s.todo.forEach(l => {
//                         if (l._id.toString() === response.body._id) {
//                             expect(l.description).toEqual("My first todo.")
//                             return foundTodo = true
//                         }
//                     })
//                 }
//             })
//             expect(foundTodo).toEqual(true)
//         })
//     })

//     describe('Update', () => {
//         test('Should not update todo without properties', async () => {
//             await request(app)
//                 .patch(`/todos/${todoOneId}?parent=sprint&projectId=${projectOneId}&fullUpdate=true`)
//                 .set('Authorization', `Bearer ${userOne.token[0].token}`)
//                 .send({})
//                 .expect(400)
//         })

//         test('Should not update todo with invalid properties', async () => {
//             await request(app)
//                 .patch(`/todos/${todoOneId}?parent=sprint&projectId=${projectOneId}&fullUpdate=true`)
//                 .set('Authorization', `Bearer ${userOne.token[0].token}`)
//                 .send({
//                     issueId: issueOneId,
//                     todo: {
//                         _id: "111111111111111111111111",
//                         description: "My first updated todo."
//                     }
//                 })
//                 .expect(400)
//             const task = await Sprint.findOne({ 'issue._id': issueOneId })
//             let foundTodo = false
//             task.issue.forEach(s => {
//                 if (s._id.toString() === issueOneId.toString()) {
//                     s.todo.forEach(l => {
//                         if (l._id.toString() === todoOneId.toString()) {
//                             expect(l._id).not.toEqual("111111111111111111111111")
//                             return foundTodo = true
//                         }
//                     })
//                 }
//             })
//             expect(foundTodo).toEqual(true)
//         })

//         test('Should not update todo with empty description', async () => {
//             await request(app)
//                 .patch(`/todos/${todoOneId}?parent=sprint&projectId=${projectOneId}&fullUpdate=true`)
//                 .set('Authorization', `Bearer ${userOne.token[0].token}`)
//                 .send({
//                     issueId: issueOneId,
//                     todo: {
//                         description: ""
//                     }
//                 })
//                 .expect(400)
//             const task = await Sprint.findOne({ 'issue._id': issueOneId })
//             let foundTodo = false
//             task.issue.forEach(s => {
//                 if (s._id.toString() === issueOneId.toString()) {
//                     s.todo.forEach(l => {
//                         if (l._id.toString() === todoOneId.toString()) {
//                             expect(l.description).toEqual(todoOne.description)
//                             return foundTodo = true
//                         }
//                     })
//                 }
//             })
//             expect(foundTodo).toEqual(true)
//         })

//         test('Should not update non-exist todo', async () => {
//             await request(app)
//                 .patch(`/todos/111111111111111111111111?parent=sprint&projectId=${projectOneId}&fullUpdate=true`)
//                 .set('Authorization', `Bearer ${userOne.token[0].token}`)
//                 .send({
//                     issueId: issueOneId,
//                     todo: {
//                         description: "My first updated todo."
//                     }
//                 })
//                 .expect(404)
//         })

//         test('Should not update todo without issue property', async () => {
//             await request(app)
//                 .patch(`/todos/${todoOneId}?parent=sprint&projectId=${projectOneId}&fullUpdate=true`)
//                 .set('Authorization', `Bearer ${userOne.token[0].token}`)
//                 .send({
//                     todo: {
//                         description: "My first updated todo."
//                     }
//                 })
//                 .expect(400)
//         })

//         test('Should not update todo without todo object', async () => {
//             await request(app)
//                 .patch(`/todos/${todoOneId}?parent=sprint&projectId=${projectOneId}&fullUpdate=true`)
//                 .set('Authorization', `Bearer ${userOne.token[0].token}`)
//                 .send({
//                     issueId: issueOneId
//                 })
//                 .expect(400)
//         })

//         test('Should update todo', async () => {
//             await request(app)
//                 .patch(`/todos/${todoOneId}?parent=sprint&projectId=${projectOneId}&fullUpdate=true`)
//                 .set('Authorization', `Bearer ${userOne.token[0].token}`)
//                 .send({
//                     issueId: issueOneId,
//                     todo: {
//                         description: "My first updated todo."
//                     }
//                 })
//                 .expect(200)
//             const task = await Sprint.findOne({ 'issue._id': issueOneId })
//             let foundTodo = false
//             task.issue.forEach(s => {
//                 if (s._id.toString() === issueOneId.toString()) {
//                     s.todo.forEach(l => {
//                         if (l._id.toString() === todoOneId.toString()) {
//                             expect(l.description).toEqual("My first updated todo.")
//                             return foundTodo = true
//                         }
//                     })
//                 }
//             })
//             expect(foundTodo).toEqual(true)
//         })
//     })

//     describe('Delete', () => {
//         test('Should not delete non-exist todo', async () => {
//             await request(app)
//                 .delete(`/todos/111111111111111111111111?parent=sprint&projectId=${projectOneId}`)
//                 .set('Authorization', `Bearer ${userOne.token[0].token}`)
//                 .send()
//                 .expect(404)
//         })

//         test('Should delete todo', async () => {
//             await request(app)
//                 .delete(`/todos/${todoOneId}?parent=sprint&projectId=${projectOneId}`)
//                 .set('Authorization', `Bearer ${userOne.token[0].token}`)
//                 .send()
//                 .expect(200)
//             const task = await Sprint.findOne({ 'issue._id': issueOneId })
//             let foundTodo = false
//             task.issue.forEach(s => {
//                 if (s._id.toString() === issueOneId.toString()) {
//                     s.todo.forEach(l => {
//                         if (l._id.toString() === todoOneId.toString()) {
//                             return foundTodo = true
//                         }
//                     })
//                 }
//             })
//             expect(foundTodo).toEqual(false)
//         })
//     })
// })