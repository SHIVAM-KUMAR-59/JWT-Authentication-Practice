import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { connectDb } from './config/connectDb.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT
const DATABASE_URI = process.env.DATABASE_URI

// Use Cors Policy
app.use(cors())

// MongoDB Connection
connectDb(DATABASE_URI)

// JSON conversion
app.use(express.json())

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
