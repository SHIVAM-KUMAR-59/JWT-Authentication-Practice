import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Utility function to hash passwords
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

// Utility function to compare passwords
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword)
}

// Utility function to generate JWT tokens
export const generateToken = (userId, secret, expiresIn = '5d') => {
  return jwt.sign({ userId }, secret, { expiresIn })
}

// Middleware to check required fields in requests
export const checkFields = (fields, reqBody) => {
  const missingFields = fields.filter((field) => !reqBody[field])
  return missingFields.length > 0
    ? { valid: false, missingFields }
    : { valid: true }
}
