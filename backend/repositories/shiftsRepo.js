const Shift =  require('../models/shiftModel')

// Get All shifts
const getAllShifts = async () => {
    return await Shift.find()
}

// Get shift by ID
const getShiftById = async (id) => {
    return await Shift.findById(id)
}

// Create shift
const addShift = async (obj) => {
    return await Shift.create(obj)
}

// Update shift
const updateShift = async (id, obj) => {
    return await Shift.findByIdAndUpdate(id, obj)
} 

// Delete shift
const deleteShift = async (id) => {
    return await Shift.findByIdAndDelete(id)
}


module.exports = { getAllShifts, getShiftById, addShift, updateShift, deleteShift }