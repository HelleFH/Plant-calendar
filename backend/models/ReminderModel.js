// models/ReminderModel.js
const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  date: { type: Date, required: true }, // Add date field
  time: { type: String, required: true },
  description: { type: String, required: true },
  username: { type: String, required: true },

  entryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Entry', required: true },
  // Include any other necessary fields
});

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = { Reminder };