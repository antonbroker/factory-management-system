const express = require("express")
const useAIController = require("../controllers/useAIController")

const router = express.Router()
router.get('/', useAIController.generateSchedule)

module.exports = router
