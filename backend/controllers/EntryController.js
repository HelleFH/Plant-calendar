const { Entry } = require('../models/EntryModel');
const cloudinary = require('cloudinary').v2;


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
  const { name, notes, sunlight, water, cloudinaryUrl } = req.body;

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
      });
      return res.json({ message: 'Entry updated successfully', updatedEntry: existingEntry });
    }

    existingEntry.name = name;
    existingEntry.notes = notes;
    existingEntry.sunlight = sunlight;
    existingEntry.water = water;
    existingEntry.cloudinaryUrl = cloudinaryUrl;

    existingEntry = await existingEntry.save();
    
    res.json({ message: 'Entry updated successfully', updatedEntry: existingEntry });
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ error: 'An error occurred while updating entry' });
  }
};
// Controller function to get entry details by ID
const getEntryById = async (req, res) => {
  try {
    const entryId = req.params.id; // Adjusted to use req.params.id
    const entry = await Entry.findById(entryId);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(200).json(entry);
  } catch (error) {
    console.error('Error fetching entry:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const getEntriesByDate = async (req, res) => {
  try {
      // Extract date and username from request parameters
      const { date } = req.params;
      const { userID } = req.query;

      // Parse date string into JavaScript Date object
      const searchDate = new Date(date);

      // Get entries for the specified date and username
      const entries = await Entry.find({ 
          date: { 
              $gte: searchDate, 
              $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000) 
          },
          userID: userID // Add username as a condition
      });

      // Send entries as response
      res.json(entries);
  } catch (error) {
      console.error('Error in getting entries by date:', error);
      return res.status(500).json({ error: 'Internal server error.' });
  }
};

const getSortedEntriesByUserId = async (req, res) => {
  try {
      // Extract userID and sorting criteria from request parameters and query parameters
      const { userID } = req.params;
      const { sortBy } = req.query;

      // Define the sort options based on the sortBy parameter
      let sortOptions = {};
      if (sortBy === 'date') {
          sortOptions = { date: 1 }; // Sort by date in ascending order
      } else if (sortBy === 'name') {
          sortOptions = { name: 1 }; // Sort by name in ascending order
      }

      // Get entries for the specified userID and apply sorting
      const entries = await Entry.find({ userID }).sort(sortOptions);

      // Send entries as response
      res.json(entries);
  } catch (error) {
      console.error('Error in getting entries by userID:', error);
      return res.status(500).json({ error: 'Internal server error.' });
  }
};
module.exports = {
  deleteEntry,
  updateEntry,
  getEntryById,
  getEntriesByDate,
  getSortedEntriesByUserId,
};