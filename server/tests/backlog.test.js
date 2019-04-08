// const request = require('supertest')
// const app = require('../src/app')
// const Backlog = require('../src/models/backlog')
// const { projectOneId, setupDatabase, userOne } = require('./fixtures/db')

// beforeEach(setupDatabase)

// describe('Backlogs', () => {
//     describe('Read', () => {
//         test('Should not read backlog without projectId query', async () => {
//             const response = await request(app)
//                 .get(`/backlogs`)
//                 .set('Authorization', `Bearer ${userOne.token[0].token}`)
//                 .send()
//                 .expect(400)
//         })

//         test('Should read backlog', async () => {
//             const response = await request(app)
//                 .get(`/backlogs?projectId=${projectOneId}`)
//                 .set('Authorization', `Bearer ${userOne.token[0].token}`)
//                 .send()
//                 .expect(200)
//         })
//     })
// })
