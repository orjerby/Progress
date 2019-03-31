const request = require('supertest')
const app = require('../src/app')
const Backlog = require('../src/models/backlog')
const { projectOneId, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

describe('Backlogs', () => {
    describe('Read', () => {
        test('Should not read backlog without projectId query', async () => {
            const response = await request(app)
                .get(`/backlogs`)
                .send()
                .expect(404)
        })

        test('Should read backlog', async () => {
            const response = await request(app)
                .get(`/backlogs?projectId=${projectOneId}`)
                .send()
                .expect(200)
        })
    })
})
