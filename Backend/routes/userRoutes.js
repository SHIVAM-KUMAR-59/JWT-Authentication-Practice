import express from 'express'
import UserController from '../controllers/userController.js'
import checkUserAuth from '../middlewares/authMiddleware.js'

const router = express.Router()

// Route Level Middlewares - To Protect Routes
router.use('/changepassword', checkUserAuth)

// Public Routes
router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)

// Protected Routes
router.post('/changepassword', UserController.changeUserPassword)

export default router
