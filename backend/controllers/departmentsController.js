const departmentsService = require('../services/departmentsService')

// Get all departments
const getAllDepartments = async (req,res) =>{
    try {
        const departments = await departmentsService.getAllDepartments()
        return res.status(200).json(departments)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}

// Get department by ID
const getDepartmentById = async (req,res) => {
    try {
        const departmentId = req.params.id
        const department = await departmentsService.getDepartmentById(departmentId)
        
        if (!department) {
            return res.status(404).json({ message: "Department not found" })
        }
        
        return res.status(200).json(department)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}

// Create department
const addDepartment = async (req,res) => {
    try {
        const obj = req.body
        const newDepartment = await departmentsService.addDepartment(obj)

        if (!newDepartment) {
            return res.status(404).json({ message: "Department has not been created" })
        }

        return res.status(201).json(newDepartment)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}

// Update department
const updateDepartment = async (req,res) => {
    try {
        const departmentId = req.params.id
        const obj = req.body
        const updatedDepartment = await departmentsService.updateDepartment(departmentId,obj)

        if (!updatedDepartment) {
            return res.status(404).json({ message: "Department not found" })
        }

        return res.status(200).json({ message: "Department updated successfully", updatedDepartment })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}

// Delete department
const deleteDepartment = async (req,res) => {
    try {
        const departmentId = req.params.id
        const deletedDepartment = await departmentsService.deleteDepartment(departmentId)

        if (!deletedDepartment) {
            return res.status(404).json({ message: "Department not found" })
        }

        return res.status(200).json({ message: "Department deleted successfully", deletedDepartment })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}

module.exports = { getAllDepartments, getDepartmentById, addDepartment, updateDepartment, deleteDepartment }