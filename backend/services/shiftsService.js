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
        return await shiftsRepo.updateShift(id,obj)
    } catch (err) {
        console.error("Error in updateShift Service:", err.message)
        throw err; // error to controller
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