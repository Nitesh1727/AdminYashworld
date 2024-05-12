const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  devicesAllocated: { type: [String], default: [] },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }, // Status of the user
  role: { type: String, enum: ['admin', 'user'] },
  verified: { type: Boolean, default: false } // Indicates whether user is verified by admin
});

const User = mongoose.model('User', userSchema);

module.exports = User;
