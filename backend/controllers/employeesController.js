const employeesService = require('../services/employeesService')

// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        const employees = await employeesService.getAllEmployees()
        return res.status(200).json(employees)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}

// Get employee by ID
const getEmployeeById = async (req, res) => {
    try {
        const id = req.params.id
        const employee = await employeesService.getEmployeeById(id)

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" })
        }

        return res.status(200).json(employee)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}

// Create employee
const addEmployee = async (req, res) => {
    try {
        const obj = req.body
        const newEmployee = await employeesService.addEmployee(obj)

        if (!newEmployee) {
            return res.status(400).json({ message: "The employee has not been created" })
        }

        return res.status(201).json(newEmployee)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" }) 
    }
}

// Update employee
const updateEmployee = async (req, res) => {
    try {
        const id = req.params.id
        const obj = req.body
        const updatedEmployee = await employeesService.updateEmployee(id, obj)

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" })
        }

        return res.status(200).json({ message: "Employee updated successfully", updatedEmployee })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" }) 
    }
}

// Delete employee
const deleteEmployee = async (req, res) => {
    try {
        const id = req.params.id
        const deletedEmployee = await employeesService.deleteEmployee(id)

        if (!deletedEmployee) {
            return res.status(404).json({ message: "Employee not found" })
        }

        return res.status(200).json({ message: "Employee deleted successfully", deletedEmployee })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}

module.exports = { getAllEmployees, getEmployeeById, addEmployee, updateEmployee, deleteEmployee }