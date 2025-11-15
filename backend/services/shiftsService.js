const shiftsRepo = require('../repositories/shiftsRepo')

// Get All shifts
const getAllShifts = async () => {
    try {
        return await shiftsRepo.getAllShifts()
    } catch (err) {
        console.error("Error in getAllShifts Service:", err.message)
        throw(err) // error to controller 
    }
}

// Get shift by ID
const getShiftById = async (id) => {
    try {
        return await shiftsRepo.getShiftById(id)
    } catch (err) {
        console.error("Error in getShiftById Service:", err.message)
        throw err; // error to controller
    }
}

// Create shift
const addShift = async (obj) => {
    try {
        return await shiftsRepo.addShift(obj)
    } catch (err) {
        console.error("Error in addShift Service:", err.message)
        throw err; // error to controller
    }
}

// Update shift
const updateShift = async (id, obj) => {
    try {
        const shift = await shiftsRepo.getShiftById(id)

        if (!shift) {
            throw new Error("Shift not found")
        }

        if (obj.employeeId) {
            if (!shift.employees.includes(obj.employeeId)) {
                shift.employees.push(obj.employeeId)
            }
        }

        if (obj.date) shift.date = obj.date
        if (obj.startingHour !== undefined) shift.startingHour = obj.startingHour
        if (obj.endingHour !== undefined) shift.endingHour = obj.endingHour

        const updatedShift = await shift.save()
        return updatedShift
        
    } catch (err) {
        console.error("Error in updateShift Service:", err.message)
        throw err
    }
}
 

// Delete shift
const deleteShift = async (id) => {
    try {
        return await shiftsRepo.deleteShift(id)
    } catch (err) {
        console.error("Error in deleteShift Service:", err.message)
        throw err; // error to controller
    }
}

module.exports = { getAllShifts, getShiftById, addShift, updateShift, deleteShift }