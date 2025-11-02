const employeesRepo = require('../repositories/employeesRepo')

/* CRUD operations*/
// Get all employees
const getAllEmployees = async () => {
    try {
        return await employeesRepo.getAllEmployees()

        // ....
    } catch (err) {
        console.error("Error in getAllEmployees Service:", err.message);
        throw err; // error to controller 
    }
    
}

// Get employee by ID
const getEmployeeById = async (id) => {
    try {
        return await employeesRepo.getEmployeeById(id)

        // ....
    } catch (err) {
        console.error("Error in getEmployeeById Service:", err.message);
        throw err; // error to controller
    }
}

// Create employee
const addEmployee = async (obj) => {
    try {
        return await employeesRepo.addEmployee(obj)
    } catch (err) {
        console.error("Error in addEmployee Service:", err.message);
        throw err; // error to controller 
    }
}

// Update employee
const updateEmployee = async (id, obj) => {
    try {
        return await employeesRepo.updateEmployee(id, obj)
    } catch (err) {
        console.error("Error in updateEmployee Service:", err.message);
        throw err; // error to controller 
    }
}

// Delete employee
const deleteEmployee = async (id) => {
    try {
        return await employeesRepo.deleteEmployee(id)
    } catch (err) {
        console.error("Error in deleteEmployee Service:", err.message);
        throw err; // error to controller 
    }
}


module.exports = { getAllEmployees, getEmployeeById, addEmployee, updateEmployee, deleteEmployee }
