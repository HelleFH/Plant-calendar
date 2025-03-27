const { Entry } = require('../models/EntryModel');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const { deleteFollowUpsByEntryId } = require('./FollowUpController');
const { deleteRemindersByEntryId } = require('./ReminderController');
const deleteEntry = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    // Delete the main entry
    const deletedEntry = await Entry.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    const { cloudinaryPublicId } = deletedEntry;
    console.log('Cloudinary public_id:', cloudinaryPublicId);

    // Delete image from Cloudinary if it exists
    if (cloudinaryPublicId) {
      const result = await cloudinary.uploader.destroy(cloudinaryPublicId);
      console.log('Cloudinary deletion result:', result);
    }

    // Delete associated follow-ups and reminders by EntryID
    await deleteFollowUpsByEntryId(id);
    await deleteRemindersByEntryId(id);

    res.json({ message: 'Entry and related data deleted successfully', deletedEntry });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const updateEntry = async (req, res) => {
  const { id } = req.params;
  const { name, notes, sunlight, water, date, username, userID, imagesToAdd } = req.body;
  const files = req.files; // Expecting new files for update

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const existingEntry = await Entry.findById(id);

    if (!existingEntry) {
      return res.status(404).json({ error: 'Entry not found.' });
    }

    // Handle existing images
    if (existingEntry.images.length > 0) {
      const deletePromises = existingEntry.images.map(image => {
        return cloudinary.uploader.destroy(image.cloudinaryPublicId);
      });
      await Promise.all(deletePromises);
    }

    // Handle new images
    const newImages = files ? await Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                cloudinaryUrl: result.secure_url,
                cloudinaryPublicId: result.public_id,
                cloudinaryDeleteToken: generateDeletionToken()
              });
            }
          }).end(file.buffer);
        });
      })
    ) : [];

    const updatedEntry = await Entry.findByIdAndUpdate(id, {
      name,
      notes,
      sunlight,
      water,
      date,
      images: newImages, 
      username,
      userID
    }, { new: true });

    res.json(updatedEntry);
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getEntriesByDate = async (req, res) => {
  try {
      const { date } = req.params;
      const { userID } = req.query;

      const searchDate = new Date(date);

      const entries = await Entry.find({ 
          date: { 
              $gte: searchDate, 
              $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000) 
          },
          userID: userID 
      });

      res.json(entries);
  } catch (error) {
      console.error('Error in getting entries by date:', error);
      return res.status(500).json({ error: 'Internal server error.' });
  }
};
const getEntryById = async (req, res) => {
  try {
    const entryID = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(entryID)) {
      return res.status(400).json({ message: 'Invalid entry ID' });
    }

    const entry = await Entry.findById(entryID);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.status(200).json(entry);
  } catch (error) {
    console.error('Error fetching entry:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getSortedEntriesByUserId = async (req, res) => {
  try {
      const { userID } = req.params;
      const { sortBy } = req.query;

      // Define the sort options based on the sortBy parameter
      let sortOptions = {};
      if (sortBy === 'date') {
          sortOptions = { date: 1 };
      } else if (sortBy === 'name') {
          sortOptions = { name: 1 }; 
      }

      const entries = await Entry.find({ userID }).sort(sortOptions);

      res.json(entries);
  } catch (error) {
      console.error('Error in getting entries by userID:', error);
      return res.status(500).json({ error: 'Internal server error.' });
  }
};

const getEntryByEntryID = async (req, res) => {
  const { entryID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(entryID)) {
      return res.status(400).json({ error: 'Invalid entryID.' });
  }

  try {
      const entry = await Entry.findById(entryID);

      if (!entry) {
          return res.status(404).json({ error: 'Normal entry not found.' });
      }

      res.json(entry);
  } catch (error) {
      console.error('Error fetching normal entry by entryID:', error);
      res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
  deleteEntry,
  updateEntry,
  getEntryById,
  getEntriesByDate,
  getSortedEntriesByUserId,
  getEntryByEntryID
};