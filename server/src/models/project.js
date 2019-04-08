const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    user: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ]
}, {
        timestamps: true
    })

const Project = mongoose.model('Project', projectSchema)

module.exports = Project