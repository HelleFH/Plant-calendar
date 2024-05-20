// controllers/entryController.js
const Entry = require('../models/Entry');
const cloudinary = require('cloudinary').v2;

exports.deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEntry = await Entry.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    const { cloudinaryPublicId } = deletedEntry;

    if (cloudinaryPublicId) {
      await cloudinary.uploader.destroy(cloudinaryPublicId);
    }

    res.json({ message: 'Entry deleted successfully', deletedEntry });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'An error occurred while deleting entry' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Image deleted from Cloudinary successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'An error occurred while deleting image' });
  }
};

exports.updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, notes, sunlight, watering, cloudinaryUrl } = req.body;

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
        username: existingEntry.username
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


const reminderController = async (req, res) => {
  const { name, notes, date, username } = req.body;

  // Check if username existss
  if (!username) {
      return res.status(400).json({ error: 'Username is required.' });
  }

  // Check if date exists before accessing it
  if (!date) {
      return res.status(400).json({ error: 'Date is required.' });
  }

      const entry = new Entry({
          name,
          notes,
          date, // Include date when creating the new entry   
          username: username // Include the username retrieved from the request body
      });

      await entry.save();

      res.json({ msg: 'Entry data uploaded successfully.' });
  
};

