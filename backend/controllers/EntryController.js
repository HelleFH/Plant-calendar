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
  const { name, notes, sunlight, watering, cloudinaryUrl } = req.body;

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
        watering,
        cloudinaryUrl,
        date: existingEntry.date,
        username: existingEntry.username,
      });
      return res.json({ message: 'Entry updated successfully', updatedEntry: existingEntry });
    }

    existingEntry.name = name;
    existingEntry.notes = notes;
    existingEntry.sunlight = sunlight;
    existingEntry.watering = watering;
    existingEntry.cloudinaryUrl = cloudinaryUrl;

    existingEntry = await existingEntry.save();
    
    res.json({ message: 'Entry updated successfully', updatedEntry: existingEntry });
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ error: 'An error occurred while updating entry' });
  }
};
const getEntryById = async (req, res) => {
  const { id } = req.params;

  try {
    const entry = await Entry.findById(id);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.json({ entry });
  } catch (error) {
    console.error('Error fetching entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {
  deleteEntry,
  updateEntry,
  getEntryById,

};