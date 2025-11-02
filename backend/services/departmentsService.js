const departmentRepo = require('../repositories/departmentRepo')

// Get All departments
const getAllDepartments = async () => {
    try {
        return await departmentRepo.getAllDepartments()
    } catch (err) {
        console.error("Error in getAllDepartments Service:", err.message)
        throw err; // error to controller 
    }
}

// Get department by ID
const getDepartmentById = async (id) => {
    try {
        return await departmentRepo.getDepartmentById(id)
    } catch (err) {
        console.error("Error in getDepartmentsById Service:", err.message)
        throw err; // error to controller
    }
}

// Create department
const addDepartment = async (obj) => {
    try {
        return await departmentRepo.addDepartment(obj)
    } catch (err) {
        console.error("Error in addDepartment Service:", err.message)
        throw err; // error to controller
    }
}

// Update department
const updateDepartment = async (id, obj) => {
    try {
        return await departmentRepo.updateDepartment(id,obj)
    } catch (err) {
        console.error("Error in updateDepartment Service:", err.message)
        throw err; // error to controller
    }
} 

// Delete department
const deleteDepartment = async (id) => {
    try {
        return await departmentRepo.deleteDepartment(id)
    } catch (err) {
        console.error("Error in deleteDepartment Service:", err.message)
        throw err; // error to controller
    }
}

module.exports = { getAllDepartments, getDepartmentById, addDepartment, updateDepartment, deleteDepartment }