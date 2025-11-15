const express = require("express")
const usersController = require("../controllers/usersController")

const router = express.Router()

router.get('/', usersController.getAllUsers)
router.get('/:id', usersController.getUserById)
router.post('/', usersController.addUser)

module.exports = router

