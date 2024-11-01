import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

// Email Sendinf Configuration
let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  post: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export default transporter