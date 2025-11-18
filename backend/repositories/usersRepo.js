const User = require('../models/userModel')

// Get All users
const getAllUsers = async () => {
    return await User.find()
}

// Get user by ID
const getUserById = async (id) => {
    return await User.findById(id)
}

// Create user
const addUser = async (obj) => {
    return await User.create(obj)
}

// Update user
const updateUser = async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, { new: true })
}

// Delete user
// const deleteUser = async (id) => {
//     return await User.findByIdAndDelete(id)
// }

// Get username and email
const findByUsernameAndEmail = async (username, email) => {
    return await User.findOne({ username, email })
}

module.exports = { getAllUsers, getUserById, addUser, updateUser, findByUsernameAndEmail }