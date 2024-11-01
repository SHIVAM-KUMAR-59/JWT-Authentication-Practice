import mongoose from 'mongoose'

export const connectDb = async (DATABASE_URI) => {
  // Connection to Database
  try {
    await mongoose.connect(DATABASE_URI)
    console.log('Succesfully Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}
