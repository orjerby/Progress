const mongoose = require('mongoose')
const Project = require('./project')
const moment = require('moment')

const backlogSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
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
                default: moment().format()
            },
            updatedAt: {
                type: Date,
                default: moment().format()
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
                    userId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User'
                    },
                    createdAt: {
                        type: Date,
                        default: moment().format()
                    },
                    updatedAt: {
                        type: Date,
                        default: moment().format()
                    },
                }
            ]
        }
    ]
})

const Backlog = mongoose.model('Backlog', backlogSchema)

module.exports = Backlog