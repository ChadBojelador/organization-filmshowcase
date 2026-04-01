const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
  teamName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  members: {
    type: [memberSchema],
    validate: {
      validator: (value) => Array.isArray(value) && value.length > 0,
      message: 'At least one member is required'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
