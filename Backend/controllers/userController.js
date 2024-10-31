import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class UserController {
  // Registration method for creating a new user
  static userRegistration = async (req, res) => {
    try {
      // Destructure the necessary fields from the request body
      const { name, email, password, password_confirmation } = req.body

      // Check if the user already exists by searching for the email in the database
      const user = await UserModel.findOne({ email: email })
      if (user) {
        // If a user with the email already exists, return an error response
        return res.status(400).send({
          status: 'failed',
          message: 'Email already exists, kindly try another email',
        })
      }

      // Ensure all fields are filled and passwords match
      if (name && email && password && password === password_confirmation) {
        // Generate a salt and hash the password for security
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create a new user instance with the hashed password and save it to the database
        const newUser = new UserModel({ name, email, password: hashedPassword })
        await newUser.save()

        const savedUser = await UserModel.findOne({ email: email })
        // Generating JWT token
        const token = jwt.sign(
          {
            userId: savedUser._id,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: '5d',
          },
        )

        // Return success response after saving the new user
        return res.status(201).send({
          status: 'success',
          message: 'User created successfully',
          token: token,
        })
      } else {
        // If validation fails (missing fields or mismatched passwords), return an error response
        return res.status(400).send({
          status: 'failed',
          message: 'All fields are required and passwords must match',
        })
      }
    } catch (error) {
      // Catch any errors that occur during the registration process
      console.error('Error during registration:', error)

      // Return a server error response if an exception is thrown
      return res.status(500).send({
        status: 'failed',
        message: 'Failed to create user due to server error',
      })
    }
  }

  // Login method for logging in an existing user
  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body
      if (email && password) {
        // Find the user by email in the database
        const user = await UserModel.findOne({ email: email })
        if (user) {
          // Compare the provided email with the email in the database
          if (email === user.email) {
            // Compare the provided password with the hashed password in the database
            const isValidPassword = await bcrypt.compare(
              password,
              user.password,
            )
            if (isValidPassword) {
              // Generate  a JWT token for the user
              const token = jwt.sign(
                {
                  userId: user._id,
                },
                process.env.JWT_SECRET_KEY,
                {
                  expiresIn: '5d',
                },
              )

              // Return a success response with the user's data
              return res.status(200).send({
                status: 'success',
                message: 'User logged in successfully',
                token: token,
              })
            } else {
              // If the passwords do not match, return an error response
              return res.status(401).send({
                status: 'failed',
                message: 'Invalid credentials',
              })
            }
          } else {
            // If the email do not match, return an error response
            return res.status(400).send({
              status: 'failed',
              message: 'Invalid credentials',
            })
          }
        } else {
          // If the user is not found, return an error response
          return res.status(404).send({
            status: 'failed',
            message: 'User not found',
          })
        }
      } else {
        // If the email or password is missing, return an error response
        return res.status(400).send({
          status: 'failed',
          message: 'Email and password are required',
        })
      }
    } catch (error) {
      // If an error occurs, return an error response
      return res.status(400).send({
        status: 'failed',
        message: 'Failed to login user due to server error',
      })
    }
  }
}

export default UserController
