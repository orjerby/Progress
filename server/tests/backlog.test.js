const request = require('supertest')
const app = require('../src/app')
const Backlog = require('../src/models/backlog')
const { projectOne, setupDatabase, userOne } = require('./fixtures/db')

beforeEach(setupDatabase)

describe('Backlogs', () => {
    describe('Read', () => {
        test('Should not read backlog as unauthenticated user', async () => {
            await request(app)
                .get(`/backlogs/projects/${projectOne._id}`)
                .send()
                .expect(401)
        })

        test('Should read backlog', async () => {
            await request(app)
                .get(`/backlogs/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send()
                .expect(200)
        })
    })
})
