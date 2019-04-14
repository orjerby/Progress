const request = require('supertest')
const app = require('../src/app')
const Sprint = require('../src/models/sprint')
const Backlog = require('../src/models/backlog')
const { issueOne, issueTwo, projectOne, backlogOne, sprintOne, userOne, userTwo, userThree, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

describe('Issues', () => {
    describe('Create (backlog)', () => {
        test('Should not create issue with _id property', async () => {
            await request(app)
                .post(`/issues/backlogs/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({
                    name: "or's issue",
                    _id: "111111111111111111111111"
                })
                .expect(400)
        })

        test('Should not create issue without name property', async () => {
            await request(app)
                .post(`/issues/backlogs/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({
                    description: "my first issue."
                })
                .expect(400)
        })

        test("Should not create issue for backlog as not project's owner", async () => {
            const response = await request(app)
                .post(`/issues/backlogs/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userTwo.token[0].token}`])
                .send({
                    name: "or's issue"
                })
                .expect(404)
            const backlog = await Backlog.findById(backlogOne._id)
            let foundIssue = false
            backlog.issue.forEach(i => {
                if (i._id.toString() === response.body._id) {
                    return foundIssue = true
                }
            })
            expect(foundIssue).toEqual(false)
        })

        test('Should create issue for backlog', async () => {
            const response = await request(app)
                .post(`/issues/backlogs/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({
                    name: "or's issue",
                    description: "my first issue."
                })
                .expect(201)
            const backlog = await Backlog.findById(backlogOne._id)
            let foundIssue = false
            backlog.issue.forEach(i => {
                if (i._id.toString() === response.body._id) {
                    expect(i.name).toEqual("or's issue")
                    expect(i.description).toEqual("my first issue.")
                    return foundIssue = true
                }
            })
            expect(foundIssue).toEqual(true)
        })
    })

    describe('Transfer (sprint)', () => {
        test('Should not transfer unknown issue', async () => {
            await request(app)
                .post(`/issues/111111111111111111111111/transfer/sprints/${sprintOne._id}/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({})
                .expect(404)
        })

        test('Should not transfer to unknown sprint', async () => {
            await request(app)
                .post(`/issues/${issueOne._id}/transfer/sprints/111111111111111111111111/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({})
                .expect(404)
        })

        test('Should not transfer to unknown project', async () => {
            await request(app)
                .post(`/issues/${issueOne._id}/transfer/sprints/${sprintOne._id}/projects/111111111111111111111111`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({})
                .expect(404)
        })

        test("Should not transfer as not project's owner", async () => {
            const sprint = await Sprint.findById(sprintOne._id)
            const backlog = await Backlog.findOne({ projectId: projectOne._id })
            await request(app)
                .post(`/issues/${issueOne._id}/transfer/sprints/${sprintOne._id}/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userTwo.token[0].token}`])
                .send({})
                .expect(404) // didn't find the project of this user
            const sprintUpdated = await Sprint.findById(sprintOne._id)
            const backlogUpdated = await Backlog.findOne({ projectId: projectOne._id })
            expect(sprintUpdated.issue.length).toEqual(sprint.issue.length)
            expect(backlogUpdated.issue.length).toEqual(backlog.issue.length)
        })

        test('Should transfer', async () => {
            const sprint = await Sprint.findById(sprintOne._id)
            const backlog = await Backlog.findOne({ projectId: projectOne._id })
            await request(app)
                .post(`/issues/${issueOne._id}/transfer/sprints/${sprintOne._id}/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({})
                .expect(201)
            const sprintUpdated = await Sprint.findById(sprintOne._id)
            const backlogUpdated = await Backlog.findOne({ projectId: projectOne._id })
            expect(sprintUpdated.issue.length).toEqual(sprint.issue.length + 1)
            expect(backlogUpdated.issue.length).toEqual(backlog.issue.length - 1)
        })
    })

    describe('Transfer (backlog)', () => {
        test('Should not transfer unknown issue', async () => {
            await request(app)
                .post(`/issues/111111111111111111111111/transfer/backlogs/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({})
                .expect(404)
        })

        test('Should not transfer to unknown project', async () => {
            await request(app)
                .post(`/issues/${issueTwo._id}/transfer/backlogs/projects/111111111111111111111111`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({})
                .expect(404)
        })

        test("Should not transfer as not project's owner", async () => {
            const sprint = await Sprint.findById(sprintOne._id)
            const backlog = await Backlog.findOne({ projectId: projectOne._id })
            await request(app)
                .post(`/issues/${issueTwo._id}/transfer/backlogs/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userTwo.token[0].token}`])
                .send({})
                .expect(404) // didn't find the project of this user
            const sprintUpdated = await Sprint.findById(sprintOne._id)
            const backlogUpdated = await Backlog.findOne({ projectId: projectOne._id })
            expect(sprintUpdated.issue.length).toEqual(sprint.issue.length)
            expect(backlogUpdated.issue.length).toEqual(backlog.issue.length)
        })

        test('Should transfer', async () => {
            const sprint = await Sprint.findById(sprintOne._id)
            const backlog = await Backlog.findOne({ projectId: projectOne._id })
            await request(app)
                .post(`/issues/${issueTwo._id}/transfer/backlogs/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({})
                .expect(201)
            const sprintUpdated = await Sprint.findById(sprintOne._id)
            const backlogUpdated = await Backlog.findOne({ projectId: projectOne._id })
            expect(sprintUpdated.issue.length).toEqual(sprint.issue.length - 1)
            expect(backlogUpdated.issue.length).toEqual(backlog.issue.length + 1)
        })
    })

    describe('Update (sprint)', () => {
        test('Should not update issue without properties', async () => {
            await request(app)
                .patch(`/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({})
                .expect(400)
        })

        test('Should not update issue with _id property', async () => {
            await request(app)
                .patch(`/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({
                    _id: "111111111111111111111111"
                })
                .expect(400)
            const sprint = await Sprint.findById(sprintOne._id)
            let foundIssue = false
            sprint.issue.forEach(i => {
                if (i._id.toString() === issueTwo._id.toString()) {
                    expect(i.name).toEqual(issueTwo.name)
                    return foundIssue = true
                }
            })
            expect(foundIssue).toEqual(true)
        })

        test('Should not update issue with empty name', async () => {
            await request(app)
                .patch(`/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({
                    name: ""
                })
                .expect(400)
            const sprint = await Sprint.findById(sprintOne._id)
            let foundIssue = false
            sprint.issue.forEach(i => {
                if (i._id.toString() === issueTwo._id.toString()) {
                    expect(i.name).toEqual(issueTwo.name)
                    return foundIssue = true
                }
            })
            expect(foundIssue).toEqual(true)
        })

        test("Should not update as not the project's owner", async () => {
            await request(app)
                .patch(`/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userTwo.token[0].token}`])
                .send({
                    name: "michal's first updated issue"
                })
                .expect(404)
            const sprint = await Sprint.findById(sprintOne._id)
            sprint.issue.forEach(i => {
                if (i._id.toString() === issueTwo._id.toString()) {
                    expect(i.name).toEqual(issueTwo.name)
                    return
                }
            })
        })

        test('Should update issue', async () => {
            await request(app)
                .patch(`/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({
                    name: "michal's first updated issue"
                })
                .expect(200)
            const sprint = await Sprint.findById(sprintOne._id)
            let foundIssue = false
            sprint.issue.forEach(i => {
                if (i._id.toString() === issueTwo._id.toString()) {
                    expect(i.name).toEqual("michal's first updated issue")
                    return foundIssue = true
                }
            })
            expect(foundIssue).toEqual(true)
        })
    })

    describe('Update (backlog)', () => {
        test('Should not update issue without properties', async () => {
            await request(app)
                .patch(`/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({})
                .expect(400)
        })

        test('Should not update issue with _id property', async () => {
            await request(app)
                .patch(`/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({
                    _id: "111111111111111111111111"
                })
                .expect(400)
            const backlog = await Backlog.findById(backlogOne._id)
            let foundIssue = false
            backlog.issue.forEach(i => {
                if (i._id.toString() === issueOne._id.toString()) {
                    expect(i.name).toEqual(issueOne.name)
                    return foundIssue = true
                }
            })
            expect(foundIssue).toEqual(true)
        })

        test('Should not update issue with empty name', async () => {
            await request(app)
                .patch(`/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({
                    name: ""
                })
                .expect(400)
            const backlog = await Backlog.findById(backlogOne._id)
            let foundIssue = false
            backlog.issue.forEach(i => {
                if (i._id.toString() === issueOne._id.toString()) {
                    expect(i.name).toEqual(issueOne.name)
                    return foundIssue = true
                }
            })
            expect(foundIssue).toEqual(true)
        })

        test("Should not update as not the project's owner", async () => {
            await request(app)
                .patch(`/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userTwo.token[0].token}`])
                .send({
                    name: "or's first updated issue"
                })
                .expect(404)
            const backlog = await Backlog.findById(backlogOne._id)
            backlog.issue.forEach(i => {
                if (i._id.toString() === issueOne._id.toString()) {
                    expect(i.name).toEqual(issueOne.name)
                    return
                }
            })
        })

        test('Should update issue', async () => {
            await request(app)
                .patch(`/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send({
                    name: "or's first updated issue"
                })
                .expect(200)
            const backlog = await Backlog.findById(backlogOne._id)
            let foundIssue = false
            backlog.issue.forEach(i => {
                if (i._id.toString() === issueOne._id.toString()) {
                    expect(i.name).toEqual("or's first updated issue")
                    return foundIssue = true
                }
            })
            expect(foundIssue).toEqual(true)
        })
    })

    describe('Delete (sprint)', () => {
        test("Should not delete as not the project's owner", async () => {
            await request(app)
                .delete(`/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userTwo.token[0].token}`])
                .send()
                .expect(404)
            const sprint = await Sprint.findById(sprintOne._id)
            let foundIssue = false
            sprint.issue.forEach(s => {
                if (s._id.toString() === issueTwo._id.toString()) {
                    return foundIssue = true
                }
            })
            expect(foundIssue).toEqual(true)
        })

        test('Should delete issue', async () => {
            await request(app)
                .delete(`/issues/${issueTwo._id}/sprints/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send()
                .expect(200)
            const sprint = await Sprint.findById(sprintOne._id)
            let foundIssue = false
            sprint.issue.forEach(s => {
                if (s._id.toString() === issueTwo._id.toString()) {
                    return foundIssue = true
                }
            })
            expect(foundIssue).toEqual(false)
        })
    })

    describe('Delete (backlog)', () => {
        test("Should not delete as not the project's owner", async () => {
            await request(app)
                .delete(`/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userTwo.token[0].token}`])
                .send()
                .expect(404)
            const backlog = await Backlog.findById(backlogOne._id)
            let foundIssue = false
            backlog.issue.forEach(i => {
                if (i._id.toString() === issueOne._id.toString()) {
                    return foundIssue = true
                }
            })
            expect(foundIssue).toEqual(true)
        })

        test('Should delete issue', async () => {
            await request(app)
                .delete(`/issues/${issueOne._id}/backlogs/projects/${projectOne._id}`)
                .set('Cookie', [`token=${userOne.token[0].token}`])
                .send()
                .expect(200)
            const backlog = await Backlog.findById(backlogOne._id)
            let foundIssue = false
            backlog.issue.forEach(i => {
                if (i._id.toString() === issueOne._id.toString()) {
                    return foundIssue = true
                }
            })
            expect(foundIssue).toEqual(false)
        })
    })
})
