const usersRepo = require("../repositories/usersRepo")

/* CRUD operations*/
// Get all users
const getAllUsers = async () => {
    try {
        const users = await usersRepo.getAllUsers()

        const today = new Date().toDateString()
        
        for (const user of users) {
            const lastAction = new Date(user.lastActionDate).toDateString()
            if (lastAction !== today) {
                
                user.numOfActions = user.maxActionsPerDay
                user.lastActionDate = new Date()

                await usersRepo.updateUser(user._id, {
                    numOfActions: user.numOfActions,
                    lastActionDate: user.lastActionDate
                })
            }
        }

        return users

    } catch (err) {
        console.error("Error in getAllUsers Service:", err.message)
        throw err // error to controller 
    }
}

// Get user by ID
const getUserById = async (id) => {
    try {
        return await usersRepo.getUserById(id)
    
    } catch (err) {
        console.error("Error in getUserById Service:", err.message)
        throw err // error to controller 
    }
}

// Create user
const addUser = async (obj) => {
    try {
        return await usersRepo.addUser(obj)

    } catch (err) {
        console.error("Error in addUser Service:", err.message)
        throw err // error to controller 
    }
}


// Get username and email
const findByUsernameAndEmail = async (username, email) => {
    try {
        return await usersRepo.findByUsernameAndEmail(username, email)

    } catch (err) {
        console.error("Error in findByUsernameAndEmail Service:", err.message)
        throw err // error to controller
    }
}


const checkUserExists = async (user) => {
    try {
        const userExisted = await findByUsernameAndEmail(user.username, user.email)

        if (userExisted === null) {
            const newUser = { 
                fullName: user.name, 
                username: user.username, 
                email: user.email, 
                numOfActions: 10, 
                maxActionsPerDay: 10, 
                lastActionDate: new Date() 
            }

            return await addUser(newUser)
        } else {
            return userExisted
        }

    } catch (err) {
        console.error("Error in checkUserExists Service:", err.message)
        throw err // error to controller
    }
}


// Update and delete in progress...

module.exports = { getAllUsers, getUserById, addUser, checkUserExists, findByUsernameAndEmail }
