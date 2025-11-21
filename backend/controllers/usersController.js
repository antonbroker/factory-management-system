const usersService = require("../services/usersService")

// Get All users
const getAllUsers = async (req,res) => {
    try {
        const users = await usersService.getAllUsers()
        res.status(200).json(users)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
} 

// Get user by ID
const getUserById = async (req,res) => {
    try {
        const id = req.params.id
        const user = await usersService.getUserById(id)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json(user)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
} 

// Create user
const addUser = async (req,res) => {
    try {
        const obj = req.body
        const newUser = await usersService.checkUserExists(obj)

        res.status(201).json(newUser)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}

module.exports = { getAllUsers, getUserById, addUser }