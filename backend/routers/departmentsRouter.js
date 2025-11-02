const express = require('express')
const departmentsController = require('../controllers/departmentsController')

const router = express.Router()

router.get('/', departmentsController.getAllDepartments)
router.get('/:id', departmentsController.getDepartmentById)
router.post('/', departmentsController.addDepartment)
router.put('/:id', departmentsController.updateDepartment)
router.delete('/:id', departmentsController.deleteDepartment)

module.exports = router

