require('dotenv').config(); // get data from ".env"
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./config/db')

const app = express()

// Routers
const loginRouter = require('./routers/loginRouter');
const employeesRouter = require('./routers/employeesRouter')
const departmentsRouter = require('./routers/departmentsRouter')
const shiftsRouter = require('./routers/shiftsRouter')
const usersRouter = require('./routers/usersRouter')
const useAIRouter = require('./routers/useAIRouter')

// Middleware
const { checkUserActions } = require('./middlewares/checkUserActions')

app.use(cors())
app.use(express.json())

// http://localhost:3000/
// Routes
app.use('/login', loginRouter)
app.use('/employees', checkUserActions, employeesRouter)
app.use('/departments', checkUserActions, departmentsRouter)
app.use('/shifts', checkUserActions, shiftsRouter)
app.use('/users', usersRouter)
app.use('/useAI', checkUserActions, useAIRouter)

// Port
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
    connectDB()
})
