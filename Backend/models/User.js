import mongoose from 'mongoose'

// Define Schema for User
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
})
// Creating and Exporting the Model
const UserModel = mongoose.model('User', UserSchema)
export default UserModel
