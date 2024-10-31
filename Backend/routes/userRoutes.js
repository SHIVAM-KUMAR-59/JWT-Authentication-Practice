import express from 'express'
import UserController from '../controllers/userController.js'

const router = express.Router()

// Public Routes
router.post('/register', UserController.userRegistration)

// Protected Routes (Yet to be implemented)

export default router
