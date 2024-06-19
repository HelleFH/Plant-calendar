// models/ReminderModel.js
const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  date: { type: Date, required: true },
  time: { type: String, required: true }, 
  description: { type: String, required: true }, 
  userID: { type: String, required: true },
  entryID: { type: String, required: true },
});

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = { Reminder };