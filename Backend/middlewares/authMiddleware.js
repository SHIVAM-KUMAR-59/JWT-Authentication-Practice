import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'

// Middleware function to check user authentication
var checkUserAuth = async (req, res, next) => {
  let token
  // Extract the 'authorization' header from the incoming request
  const { authorization } = req.headers
  // Check if the authorization header exists and starts with 'Bearer'
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Split the token from the header (removing 'Bearer ' prefix)
      token = authorization.split(' ')[1]

      // Verify the token using the secret key and extract the 'userId' from payload
      const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY)

      // Fetch the user from the database using the extracted userId, excluding the password field
      req.user = await UserModel.findById(userId).select('-password')

      // If everything is successful, call the next middleware or route handler
      next()
    } catch (error) {
      // If token verification fails, return an error response with a 401 status
      res.status(401).send({ status: 'failed', message: 'Invalid token' })
    }
  } else {
    // If authorization header is missing or improperly formatted, send an error response
    res.status(401).send({ status: 'failed', message: 'No token provided' })
  }
}

export default checkUserAuth
