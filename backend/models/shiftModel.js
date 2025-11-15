const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    date: { type: Date, required: true },
    startingHour: { type: Number, min: 0, max: 23 },
    endingHour: { type: Number, min: 0, max: 23 },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        default: []
      }]
})

module.exports = mongoose.model('Shift', schema, 'shifts')