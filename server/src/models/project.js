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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    users: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
                // unique: true
            }
        }
    ]
}, {
        timestamps: true
    })

const Project = mongoose.model('Project', projectSchema)

module.exports = Project