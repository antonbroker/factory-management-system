const Department = require('../models/departmentModel')

// Get All departments with manager
const getAllDepartments = async () => {
    return await Department.find().populate('manager', "firstName lastName")
}

// Get department by ID with manager
const getDepartmentById = async (id) => {
    return await Department.findById(id).populate('manager', "firstName lastName")
}

// Create department
const addDepartment = async (obj) => {
    return await Department.create(obj)
}

// Update department
const updateDepartment = async (id, obj) => {
    return await Department.findByIdAndUpdate(id, obj)
} 

// Delete department
const deleteDepartment = async (id) => {
    return await Department.findByIdAndDelete(id)
}

module.exports = { getAllDepartments, getDepartmentById, addDepartment, updateDepartment, deleteDepartment }