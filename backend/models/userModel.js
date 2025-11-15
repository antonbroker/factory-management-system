const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    fullName : String,
    username: String,
    email: String,
    numOfActions: {
        type: Number,
        default: 10
    },
    maxActionsPerDay: {
        type: Number,
        default: 10
    },
    lastActionDate: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('User', schema, 'users')

module.exports = User