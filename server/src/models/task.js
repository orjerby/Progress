const mongoose = require('mongoose')
const Project = require('./project')

const taskSchema = new mongoose.Schema({
    project: {
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
    description: {
        type: String,
        trim: true,
        required: true
    },
    secondary: [
        {
            description: {
                type: String,
                trim: true,
                required: true
            },
            completed: {
                type: Boolean,
                default: false
            },
            createdAt: {
                type: Date,
                default: new Date().getTime()
            },
            little: [
                {
                    description: {
                        type: String,
                        trim: true,
                        required: true
                    },
                    completed: {
                        type: Boolean,
                        default: false
                    },
                    createdAt: {
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

const Task = mongoose.model('Task', taskSchema)

module.exports = Task