const { Entry } = require('../models/EntryModel');
const cloudinary = require('cloudinary').v2;
const { generateDeletionToken } = require('../utils/tokenUtils');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadController = async (req, res) => {
  const { name, notes, sunlight, water, date, username, userID } = req.body;
  const files = req.files; // Expecting multiple files in req.files

  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  if (!date) {
    return res.status(400).json({ error: 'Date is required.' });
  }

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'At least one image is required.' });
  }

  try {
    const imagePromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              cloudinaryUrl: result.secure_url,
              cloudinaryPublicId: result.public_id,
              cloudinaryDeleteToken: generateDeletionToken()
            });
          }
        });

        stream.end(file.buffer);
      });
    });

    const images = await Promise.all(imagePromises);

    const entry = new Entry({
      name,
      notes,
      sunlight,
      water,
      images, // Save multiple images
      date,
      username,
      userID
    });

    await entry.save();

    res.json({ msg: 'Entry data uploaded successfully.', entry });
  } catch (error) {
    console.error('Error while processing the upload:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteImage = async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: 'Public ID is required.' });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    res.json({ message: 'Image deleted successfully', result });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateEntry = async (req, res) => {
  const { id } = req.params;
  const { name, notes, sunlight, water, date, username, userID } = req.body;
  const files = req.files; // Expecting new files for update

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
      images: newImages, // Update with new images
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

module.exports = { uploadController, updateEntry, getEntriesByDate, deleteImage };
