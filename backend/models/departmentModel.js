const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name : {
        type : String,

        // validation:
        required: [true, 'Department name is required'], 
        trim: true,
        minlength: [2, 'Department name must be at least 2 characters'], 
        maxlength: [30, 'Department name must be less than 30 characters']
    },

    manager : {
        type : mongoose.Schema.Types.ObjectId,

        // validation:
        ref : "Employee", default: null
    }
})

module.exports = mongoose.model('Department', schema, 'departments')
