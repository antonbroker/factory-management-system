require('dotenv').config(); // get data from ".env"
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./config/db')
const PORT = 3000

const app = express()

// Routers
const loginRouter = require('./routers/loginRouter');
const employeesRouter = require('./routers/employeesRouter')
const departmentsRouter = require('./routers/departmentsRouter')
const shiftsRouter = require('./routers/shiftsRouter')

app.use(cors())
app.use(express.json())

// http://localhost:3000/
app.use('/login', loginRouter)
app.use('/employees', employeesRouter)
app.use('/departments', departmentsRouter)
app.use('/shifts', shiftsRouter)


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
    connectDB()
})