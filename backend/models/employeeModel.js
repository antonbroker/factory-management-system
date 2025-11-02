const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    firstName : {
        type: String, 

        // validation:
        required: [true, 'First name is required'], 
        trim: true,
        minlength: [2, 'First name must be at least 2 characters'], 
        maxlength: [30, 'First name must be less than 30 characters']
    },

    lastName : {
        type: String, 

        // validation:
        required: [true, 'Last name is required'], 
        trim: true, 
        minlength: [2, 'Last name must be at least 2 characters'], 
        maxlength: [30, 'Last name must be less than 30 characters']
    },

    startWorkYear: {
        type: Number,
        
        // validation:
        required: [true, 'Start work year is required'], 
        min: [1970, 'Start work year cannot be before 1970'], 
        max: [2026, 'Start work year cannot be after 2026'], 
        validate: {
            validator: Number.isInteger,
            message: 'Start work year must be an integer'
        }
    },

    departmentID : { 
        type: mongoose.Schema.Types.ObjectId, 

        // validation:
        ref: 'Department', 
        required: [true, 'Department reference is required'], 
        index: true
    }
},
{
    versionKey: false
}
)

const Employee = mongoose.model('Employee', schema, 'employees')

module.exports = Employee