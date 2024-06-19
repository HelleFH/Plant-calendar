const { Entry } = require('../models/EntryModel');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');



const deleteEntry = async (req, res) => {
const { id } = req.params;

  try {
    const deletedEntry = await Entry.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    const { cloudinaryPublicId } = deletedEntry;
    console.log('Cloudinary public_id:', cloudinaryPublicId);

    if (cloudinaryPublicId) {
      const result = await cloudinary.uploader.destroy(cloudinaryPublicId);
      console.log('Cloudinary deletion result:', result);
    }

    res.json({ message: 'Entry deleted successfully', deletedEntry });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateEntry = async (req, res) => {
  const { id } = req.params;
  const { name, notes, sunlight, water, cloudinaryUrl, userID } = req.body;
console.log(userID)
  try {
    let existingEntry = await Entry.findById(id);
    if (!existingEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    if (cloudinaryUrl && existingEntry.cloudinaryUrl !== cloudinaryUrl) {
      await Entry.findByIdAndDelete(id);
      existingEntry = await Entry.create({
        name,
        notes,
        sunlight,
        water,
        cloudinaryUrl,
        date: existingEntry.date,
        username: existingEntry.username,
        userID:existingEntry.userID,
      });
      return res.json({ message: 'Entry updated successfully', updatedEntry: existingEntry });
    }

    existingEntry.name = name;
    existingEntry.notes = notes;
    existingEntry.sunlight = sunlight;
    existingEntry.water = water;
    existingEntry.cloudinaryUrl = cloudinaryUrl;
existingEntry.userID =userID,
    existingEntry = await existingEntry.save();
    
    res.json({ message: 'Entry updated successfully', updatedEntry: existingEntry });
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ error: 'An error occurred while updating entry' });
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
      console.log('requestID' , userID)
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