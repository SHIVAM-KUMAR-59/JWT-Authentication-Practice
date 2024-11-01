import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from '../config/email-config.js'

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

  // Change password method
  static changeUserPassword = async (req, res) => {
    // Destructure password and password_confirmation from the request body
    const { password, password_confirmation } = req.body

    // Check if both password and password_confirmation fields are provided
    if (password && password_confirmation) {
      // Check if the passwords match
      if (password === password_confirmation) {
        // Generate a salt for hashing the password
        const salt = await bcrypt.genSalt(12)
        // Hash the new password with the generated salt
        const newHashedPassword = await bcrypt.hash(password, salt)

        // Update the user's password in the database using their user ID
        await UserModel.findByIdAndUpdate(req.user._id, {
          $set: {
            password: newHashedPassword, // Set the new hashed password
          },
        })

        // Send a success response indicating the password has been changed
        res.status(200).send({
          status: 'success',
          message: 'Password changed successfully',
        })
      } else {
        // Send an error response if the passwords do not match
        return res.status(400).send({
          status: 'failed',
          message: 'Passwords do not match', // Inform the user about the mismatch
        })
      }
    } else {
      // Send an error response if any of the fields are missing
      return res.status(400).send({
        status: 'failed',
        message: 'All fields are required', // Inform the user that both fields are necessary
      })
    }
  }

  // Path to get the information of a logged user
  static loggedUser = async (req, res) => {
    res.send({ user: req.user })
  }

  // Path to send the email to reset the password
  static sendUserPasswordResetEmail = async (req, res) => {
    // Destructure email from the request body
    const { email } = req.body

    // Check if the email field is provided
    if (email) {
      // Search for a user in the database with the provided email
      const user = await UserModel.findOne({ email })

      // If a user is found with the given email
      if (user) {
        // Create a secret using the user's ID and the JWT secret key from the environment variables
        const secret = user._id + process.env.JWT_SECRET_KEY

        // Generate a token for password reset with an expiration time of 15 minutes
        const token = jwt.sign(
          {
            userId: user._id, // Include the user's ID in the token payload
          },
          secret, // Use the secret to sign the token
          {
            expiresIn: '15m', // Set the token to expire in 15 minutes
          },
        )

        // Create a password reset link containing the user ID and token
        const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
        console.log(link)

        // Sending the email to the user with the link to reset the password
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM, //  The sender's(you) email
          to: user.email, // The recipient's email
          subject: 'Reset Password Link', // The subject of the email
          html: `<h2>Click the link below to reset your password.</h2> <br/> <a href=${link} target="_blank">Reset Password</a>`,
        })

        // Send a success response indicating the email has been sent
        res.status(200).send({
          status: 'success',
          message: 'Email sent successfully', // Notify the user that the email was sent
          info: info,
        })
      } else {
        // Return an error response if no user is found with the entered email
        return res.status(400).send({
          status: 'failed',
          message: 'User with the entered email not found', // Inform the user that the email is not associated with any account
        })
      }
    } else {
      // Return an error response if the email field is missing
      return res.status(400).send({
        status: 'failed',
        message: 'Email is required', // Inform the user that the email is a required field
      })
    }
  }

  // Path to reset password
  static userPasswordRest = async (req, res) => {
    const { password, password_confirmation } = req.body
    const { id, token } = req.params
    const user = await UserModel.findById(id)
    const newSecret = user._id + process.env.JWT_SECRET_KEY

    try {
      jwt.verify(token, newSecret)
      if (password && password_confirmation) {
        if (password === password_confirmation) {
          const salt = await bcrypt.genSalt(12)
          const hashedPassword = await bcrypt.hash(password, salt)
          await UserModel.findByIdAndUpdate(user._id, {
            $set: {
              password: hashedPassword,
            },
          })
          return res.status(200).send({
            status: 'success',
            message: 'Password updated successfully', // Notify the user that the password was updated
          })
        } else {
          return res.status(400).send({
            status: 'failed',
            message: 'Passwords do not match', // Inform the user that the passwords do not match
          })
        }
      } else {
        return res.status(400).send({
          status: 'failed',
          message: 'Password and password confirmation are required', // Inform the user that the password and password
        })
      }
    } catch (error) {
      return res.status(400).send({
        status: 'failed',
        message: 'Invalid token', // Inform the user that the token is invalid
      })
    }
  }
}

export default UserController
