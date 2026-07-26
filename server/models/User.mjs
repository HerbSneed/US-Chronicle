// Import necessary modules
import { Schema, model } from 'mongoose';
// Bcrypt is a password hashing algorithm designed for safe password hashing.
import bcrypt from 'bcryptjs';

// Import news schema
import newsSchema from './News.mjs';

// Define schema for user data
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Validate email format
    match: [/.+@.+\..+/, "Must match an email address!"],
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  userDefaultNews: {
    type: String,
    enum: ["Business", "Entertainment", "Top News", "Health", "Science", "Sports", "Technology"],
  },
  savedNews: [newsSchema], // Embed news schema as an array of saved user news
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Method to compare passwords
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Create User model
const User = model('User', userSchema);

export default User;
