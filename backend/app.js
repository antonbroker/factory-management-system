require('dotenv').config(); // get data from ".env"
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./config/db')
const PORT = 3000

const app = express()

// Routers
const loginRouter = require('./routers/loginRouter');

app.use(cors())
app.use(express.json())

// http://localhost:3000/
app.use('/login', loginRouter)



app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
    connectDB()
})