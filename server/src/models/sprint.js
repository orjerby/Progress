const mongoose = require('mongoose')
const Project = require('./project')
const moment = require('moment')

const sprintSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    openAt: {
        type: Date,
        default: moment().format()
    },
    endAt: {
        type: Date,
        default: moment().add(2, 'w').format()
    },
    createdAt: {
        type: Date,
        default: moment().format()
    },
    updatedAt: {
        type: Date,
        default: moment().format()
    },
    issue: [
        {
            name: {
                type: String,
                required: true,
                trim: true
            },
            description: {
                type: String,
                trim: true
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
                    name: {
                        type: String,
                        required: true,
                        trim: true
                    },
                    description: {
                        type: String,
                        trim: true
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
                    }
                }
            ]
        }
    ]
})

const Sprint = mongoose.model('Sprint', sprintSchema)

module.exports = Sprint