const mongoose = require('mongoose')
const Project = require('./project')

const backlogSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        validate: {
            validator: async function (value) {
                return new Promise(async function (resolve, reject) {
                    const project = await Project.findById(value)
                    if (!project) {
                        reject("couldn't find project")
                    }

                    resolve()
                })
            }
        }
    },
    issue: [
        {
            description: {
                type: String,
                trim: true,
                required: true
            },
            createdAt: {
                type: Date,
                default: new Date().getTime()
            },
            updatedAt: {
                type: Date,
                default: new Date().getTime()
            },
            todo: [
                {
                    description: {
                        type: String,
                        trim: true,
                        required: true
                    },
                    status: {
                        type: String,
                        enum: ['undone', 'progress', 'done'],
                        default: 'undone'
                    },
                    priority: {
                        type: String,
                        enum: ['low', 'medium', 'high'],
                        default: 'medium'
                    },
                    createdAt: {
                        type: Date,
                        default: new Date().getTime()
                    },
                    updatedAt: {
                        type: Date,
                        default: new Date().getTime()
                    },
                }
            ]
        }
    ]
}, {
        timestamps: true
    })

const Backlog = mongoose.model('Backlog', backlogSchema)

module.exports = Backlog