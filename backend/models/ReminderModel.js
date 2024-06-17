// models/ReminderModel.js
const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Corrected type to String
  date: { type: Date, required: true }, // Date field
  time: { type: String, required: true }, // Marked as required for consistency
  description: { type: String, required: true }, // Marked as required for consistency
  userID: { type: String, required: true },
  entryID: { type: String, required: true },
});

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = { Reminder };