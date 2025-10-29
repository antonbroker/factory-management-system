const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    date: { 
        type: Date, 
        required: true 
    },

    startingHour: { 
        type: Number, 
        min: 0, 
        max: 23 
    },

    endingHour: { 
        type: Number, 
        min: 0, 
        max: 23 
    }
})

module.exports = mongoose.model('Shift', schema, 'shifts')