const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const route = require('./Routes/auth') // Ensure route is correctly imported
const app = express()
const PORT = 3000

// Load environment variables
dotenv.config()

// Middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err))

// Routes
app.use('/api', route) // Mount routes under '/api'

// Test Route
app.get('/', (req, res) => {
  res.send('Hello World')
})

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something went wrong!')
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
})
