const Employee = require('../models/employeeModel')

// Get All employees with department
const getAllEmployees = async () => {
    return await Employee.find().populate('departmentID', 'name')
}

// Get employee by ID with department
const getEmployeeById = async (id) => {
    return await Employee.findById(id).populate('departmentID', 'name')
}

// Create employee
const addEmployee = async (obj) => {
    return await Employee.create(obj)
}

// Update employee
const updateEmployee = async (id, obj) => {
    return await Employee.findByIdAndUpdate(id, obj)
} 

// Delete employee
const deleteEmployee = async (id) => {
    return await Employee.findByIdAndDelete(id)
}


module.exports = { getAllEmployees, getEmployeeById, addEmployee, updateEmployee, deleteEmployee }