const shiftsService = require('../services/shiftsService')

// Get All shifts
const getAllShifts = async (req,res) => {
    try {
        const shifts = await shiftsService.getAllShifts()
        return res.status(200).json(shifts)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}

// Get shift by ID
const getShiftById = async (req,res) => {
    try {
        const shiftId = req.params.id
        const shift = await shiftsService.getShiftById(shiftId)

        if (!shift) {
            return res.status(404).json({ message: "Shift not found" })
        }

        return res.status(200).json(shift)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}

// Create shift
const addShift = async (req,res) => {
    try {
        const obj = req.body
        const newShift = await shiftsService.addShift(obj)

        if (!newShift) {
            return res.status(404).json({ message: "Shift has not been created" })
        }

        return res.status(201).json(newShift)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}

// Update shift
const updateShift = async (req,res) => {
    try {
        const shiftId = req.params.id 
        const obj = req.body
        const updatedShift = await shiftsService.updateShift(shiftId, obj)

        if (!updatedShift) {
            return res.status(404).json({ message: "Shift has not been updated" })
        }

        return res.status(200).json(updatedShift)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}

// Delete shift
const deleteShift = async (req,res) => {
    try {
        const shiftId = req.params.id 
        const deletedShift = await shiftsService.deleteShift(shiftId)

        if (!deletedShift) {
            return res.status(404).json({ message: "Shift has not been deleted" })
        }

        return res.status(200).json(deletedShift)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}

module.exports = { getAllShifts, getShiftById, addShift, updateShift, deleteShift }