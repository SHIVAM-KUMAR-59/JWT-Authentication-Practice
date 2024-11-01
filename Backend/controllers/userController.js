import UserModel from '../models/User.js'
import transporter from '../config/email-config.js'
import {
  hashPassword,
  comparePassword,
  generateToken,
  checkFields,
} from '../utils/auth-utils.js'
import jwt from 'jsonwebtoken'

class UserController {
  static userRegistration = async (req, res) => {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'password_confirmation',
      ]
      const { valid, missingFields } = checkFields(requiredFields, req.body)

      if (!valid) {
        return res.status(400).send({
          status: 'failed',
          message: `Missing fields: ${missingFields.join(', ')}`,
        })
      }

      const { name, email, password, password_confirmation } = req.body
      const user = await UserModel.findOne({ email })

      if (user) {
        return res.status(400).send({
          status: 'failed',
          message: 'Email already exists, kindly try another email',
        })
      }

      if (password !== password_confirmation) {
        return res.status(400).send({
          status: 'failed',
          message: 'Passwords must match',
        })
      }

      const hashedPassword = await hashPassword(password)
      const newUser = new UserModel({ name, email, password: hashedPassword })
      await newUser.save()

      const token = generateToken(newUser._id, process.env.JWT_SECRET_KEY)

      return res.status(201).send({
        status: 'success',
        message: 'User created successfully',
        token,
      })
    } catch (error) {
      console.error('Error during registration:', error)
      return res.status(500).send({
        status: 'failed',
        message: 'Failed to create user due to server error',
      })
    }
  }

  static userLogin = async (req, res) => {
    try {
      const requiredFields = ['email', 'password']
      const { valid, missingFields } = checkFields(requiredFields, req.body)

      if (!valid) {
        return res.status(400).send({
          status: 'failed',
          message: `Missing fields: ${missingFields.join(', ')}`,
        })
      }

      const { email, password } = req.body
      const user = await UserModel.findOne({ email })

      if (!user || !(await comparePassword(password, user.password))) {
        return res.status(401).send({
          status: 'failed',
          message: 'Invalid credentials',
        })
      }

      const token = generateToken(user._id, process.env.JWT_SECRET_KEY)

      return res.status(200).send({
        status: 'success',
        message: 'User logged in successfully',
        token,
      })
    } catch (error) {
      return res.status(500).send({
        status: 'failed',
        message: 'Failed to login user due to server error',
      })
    }
  }

  static changeUserPassword = async (req, res) => {
    try {
      const requiredFields = ['password', 'password_confirmation']
      const { valid, missingFields } = checkFields(requiredFields, req.body)

      if (!valid) {
        return res.status(400).send({
          status: 'failed',
          message: `Missing fields: ${missingFields.join(', ')}`,
        })
      }

      const { password, password_confirmation } = req.body

      if (password !== password_confirmation) {
        return res.status(400).send({
          status: 'failed',
          message: 'Passwords do not match',
        })
      }

      const newHashedPassword = await hashPassword(password)
      await UserModel.findByIdAndUpdate(req.user._id, {
        password: newHashedPassword,
      })

      return res.status(200).send({
        status: 'success',
        message: 'Password changed successfully',
      })
    } catch (error) {
      return res.status(500).send({
        status: 'failed',
        message: 'Failed to change password due to server error',
      })
    }
  }

  static loggedUser = (req, res) => {
    res.send({ user: req.user })
  }

  static sendUserPasswordResetEmail = async (req, res) => {
    try {
      const requiredFields = ['email']
      const { valid, missingFields } = checkFields(requiredFields, req.body)

      if (!valid) {
        return res.status(400).send({
          status: 'failed',
          message: `Missing fields: ${missingFields.join(', ')}`,
        })
      }

      const { email } = req.body
      const user = await UserModel.findOne({ email })

      if (!user) {
        return res.status(400).send({
          status: 'failed',
          message: 'User with the entered email not found',
        })
      }

      const secret = user._id + process.env.JWT_SECRET_KEY
      const token = generateToken(user._id, secret, '15m')
      const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Reset Password Link',
        html: `<h2>Click the link below to reset your password.</h2><br/><a href=${link} target="_blank">Reset Password</a>`,
      })

      return res.status(200).send({
        status: 'success',
        message: 'Email sent successfully',
      })
    } catch (error) {
      return res.status(500).send({
        status: 'failed',
        message: 'Failed to send password reset email due to server error',
      })
    }
  }

  static userPasswordReset = async (req, res) => {
    const requiredFields = ['password', 'password_confirmation']
    const { valid, missingFields } = checkFields(requiredFields, req.body)

    if (!valid) {
      return res.status(400).send({
        status: 'failed',
        message: `Missing fields: ${missingFields.join(', ')}`,
      })
    }

    const { password, password_confirmation } = req.body
    const { id, token } = req.params

    try {
      const user = await UserModel.findById(id)
      const secret = user._id + process.env.JWT_SECRET_KEY
      jwt.verify(token, secret)

      if (password !== password_confirmation) {
        return res.status(400).send({
          status: 'failed',
          message: 'Passwords do not match',
        })
      }

      const hashedPassword = await hashPassword(password)
      await UserModel.findByIdAndUpdate(user._id, { password: hashedPassword })

      return res.status(200).send({
        status: 'success',
        message: 'Password updated successfully',
      })
    } catch (error) {
      return res.status(400).send({
        status: 'failed',
        message: 'Invalid or expired token',
      })
    }
  }
}

export default UserController
