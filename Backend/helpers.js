const User = require('./Schema/userSchema')

// Middleware to verify credentials
const verifyCredentials = (req, res, next) => {
  const { username, password, email } = req.body

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Please fill in all fields' })
  }
  next()
}

// Middleware to find a user
const findUser = async (req, res, next) => {
  const { username } = req.body
  try {
    const user = await userSchema.findOne({ username: username })
    if (!user) {
      return res.status(401).json({ msg: 'User not found' })
    }
    req.user = user // Store the found user in request for further use
    next()
  } catch (error) {
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { verifyCredentials, findUser } // Exporting the middleware functions
