const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true, // Database-level unique index
      required: [true, 'Username is required'],
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Database-level unique index
      validate: [
        {
          validator: function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
          },
          message: (props) => `${props.value} is not a valid email address!`,
        },
        {
          // Custom validator to check email uniqueness
          validator: async function (email) {
            // 'this' refers to the document being validated
            const count = await mongoose.models.User.countDocuments({
              email: email,
              _id: { $ne: this._id }, // Exclude current document during update
            })
            return count === 0
          },
          message: 'Email is already in use',
        },
      ],
    },
  },
  {
    // Add this to enable custom validation on update
    runValidators: true,
  },
)

// Create a compound unique index if needed
userSchema.index({ username: 1, email: 1 }, { unique: true })

const User = mongoose.model('User', userSchema)
module.exports = User
