// Implement registration and login routes that hash passwords and generate JWT tokens.

const express = require('express')
const jwt = require('jsonwebtoken')
const route = express.Router()
const bcrypt = require('bcryptjs')
const userSchema = require('../Schema/userSchema')
const { verifyCredentials, findUser } = require('../helpers')

// Register middleware
route.post('/register', verifyCredentials, async (req, res) => {
  const { username, password, email } = req.body

  try {
    // Check if the user already exists
    const existingUser = await userSchema.findOne({ username: username })
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' })
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new userSchema({ username, email, password: hashedPassword })
    await user.save()

    // Generate a token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    )

    res.status(201).json({ message: 'User created successfully', token })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message,
      )
      return res.status(400).json({ message: errorMessages })
    }
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = route
