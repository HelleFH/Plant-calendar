// controllers/reminderController.js
const { Reminder } = require('../models/ReminderModel');
const { Entry } = require('../models/EntryModel');

const setReminder = async (req, res) => {
  const { date, time, description, entryId, username } = req.body;

  if (!date || !time || !description || !entryId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const entry = await Entry.findById(entryId);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found.' });
    }

    const newReminder = new Reminder({
      date,
      time,
      description,
      entryId,
      username,
    });

    await newReminder.save();
    res.status(201).json({ message: 'Reminder set successfully', reminder: newReminder });
  } catch (error) {
    console.error('Error setting reminder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  setReminder,
};
