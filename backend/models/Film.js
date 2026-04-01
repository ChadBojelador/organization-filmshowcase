const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }
});

const filmSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  filmTitle: { type: String, required: true },
  members: [memberSchema],
  videoLink: { type: String, required: true },
  posterLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Film', filmSchema);
