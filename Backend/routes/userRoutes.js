import express from 'express'
import UserController from '../controllers/userController.js'
import checkUserAuth from '../middlewares/authMiddleware.js'

const router = express.Router()

// Route Level Middlewares - To Protect Routes
router.use('/changepassword', checkUserAuth)
router.use('/loggeduser', checkUserAuth)

// Public Routes
router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)
router.post(
  '/send-reset-password-email',
  UserController.sendUserPasswordResetEmail,
)
router.post('/reset-password/:id/:token', UserController.userPasswordReset)

// Protected Routes
router.post('/changepassword', UserController.changeUserPassword)
router.get('/loggeduser', UserController.loggedUser)

export default router
