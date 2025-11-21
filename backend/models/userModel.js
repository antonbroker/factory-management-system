const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    fullName : String,
    username: { type: String, unique: true },
    email:  { type: String, unique: true },
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