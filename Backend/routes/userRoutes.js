import express from 'express'
import UserController from '../controllers/userController.js'

const router = express.Router()

// Public Routes
router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)

// Protected Routes (Yet to be implemented)

export default router
