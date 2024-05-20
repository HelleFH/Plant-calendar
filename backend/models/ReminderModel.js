const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
    title: { type: String, required: true },
    notes: { type: String, required: false },
    entryLink: { type: String, required: false },
    date: { type: Date, required: true },
    username: { type: String, required: true } 
});

const Reminder = mongoose.model('Reminder', ReminderSchema);

module.exports = { Reminder };
