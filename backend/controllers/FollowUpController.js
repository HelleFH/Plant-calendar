const { FollowUpEntry } = require('../models/FollowUpModel'); // Check if this import is correct
const cloudinary = require('cloudinary').v2;
const { generateDeletionToken } = require('../utils/tokenUtils');
const mongoose = require('mongoose');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FollowUpController = async (req, res) => {
  try {
    const { notes, userID, entryID, date } = req.body;

    // Check if userID exists
    if (!userID) {
      return res.status(400).json({ error: 'userID is required.' });
    }

    // Check if date exists before accessing it
    if (!date) {
      return res.status(400).json({ error: 'Date is required.' });
    }

    const { buffer } = req.file; // Extract file buffer

    // Upload file to Cloudinary directly from the buffer
    cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (error, result) => {
      if (error) {
        console.error('Error while uploading to Cloudinary:', error);
        return res.status(400).json({ error: 'Error while uploading entry data. Try again later.' });
      }

      const deletionToken = generateDeletionToken(); // Ensure this function exists and works correctly

      const followUpEntry = new FollowUpEntry({
        notes,
        date, // Include date when creating the new entry
        cloudinaryUrl: result.secure_url,
        cloudinaryPublicId: result.public_id,
        cloudinaryDeleteToken: deletionToken,
        userID: userID,
        entryID: entryID, // Include the entryID retrieved from the request body
      });

      await followUpEntry.save();

      res.json({ msg: 'Entry data uploaded successfully.' });
    }).end(buffer);
  } catch (error) {
    console.error('Error in FollowUpController:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

  const getFollowUpEntriesByEntryId = async (req, res) => {
    try {
      const { entryID } = req.params;
      console.log(entryID)
      
      // Check if entryID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(entryID)) {
        return res.status(400).json({ error: 'Invalid entryID.' });
      }
      
      const objectId = new mongoose.Types.ObjectId(entryID);
      console.log(objectId); // Ensure objectId is created correctly
      
      const followUpEntries = await FollowUpEntry.find({ entryID: objectId });
      res.json(followUpEntries);
    } catch (error) {
      console.error('Error fetching follow-up entries:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
module.exports = {
  FollowUpController,
  getFollowUpEntriesByEntryId
};