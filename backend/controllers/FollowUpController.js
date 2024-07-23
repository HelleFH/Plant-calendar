const { FollowUpEntry } = require('../models/FollowUpModel');
const cloudinary = require('cloudinary').v2;
const { generateDeletionToken } = require('../utils/tokenUtils');
const mongoose = require('mongoose');

const deleteFollowUpsByEntryId = async (entryId) => {
  try {
    const followUps = await FollowUpEntry.find({ EntryID: entryId });
    for (const followUp of followUps) {
      const { cloudinaryPublicId } = followUp;
      if (cloudinaryPublicId) {
        await cloudinary.uploader.destroy(cloudinaryPublicId);
      }
    }
    await FollowUpEntry.deleteMany({ EntryID: entryId });
  } catch (error) {
    console.error('Error deleting follow-ups:', error);
    throw error; // Propagate the error to be handled by the caller
  }
};


const uploadFollowUpController = async (req, res) => {
  try {
    const { notes, userID, entryID, date, name, entryDate } = req.body;

    if (!userID) {
      return res.status(400).json({ error: 'userID is required.' });
    }

    if (!date) {
      return res.status(400).json({ error: 'Date is required.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    // Array to hold Cloudinary upload results
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
          if (error) {
            console.error('Error while uploading to Cloudinary:', error);
            reject(new Error('Error while uploading entry data. Try again later.'));
          } else {
            resolve(result);
          }
        }).end(file.buffer);
      });
    });

    // Wait for all uploads to complete
    const uploadResults = await Promise.all(uploadPromises);

    // Generate deletion tokens for each uploaded file
    const followUpEntries = uploadResults.map(result => {
      const deletionToken = generateDeletionToken(); // Function to generate a unique deletion token

      return new FollowUpEntry({
        name,
        notes,
        date,
        entryDate,
        cloudinaryUrl: result.secure_url,
        cloudinaryPublicId: result.public_id,
        cloudinaryDeleteToken: deletionToken,
        userID,
        entryID,
        entryDate,
      });
    });

    // Save all follow-up entries to the database
    await FollowUpEntry.insertMany(followUpEntries);

    res.json({ msg: 'Entry data uploaded successfully.' });
  } catch (error) {
    console.error('Error in FollowUpController:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { uploadFollowUpController };



const deleteFollowUp = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFollowUp = await FollowUpEntry.findByIdAndDelete(id);

    if (!deletedFollowUp) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    const { cloudinaryPublicId } = deletedFollowUp;
    console.log('Cloudinary public_id:', cloudinaryPublicId);

    if (cloudinaryPublicId) {
      const result = await cloudinary.uploader.destroy(cloudinaryPublicId);
      console.log('Cloudinary deletion result:', result);
    }

    res.json({ message: 'Entry deleted successfully', deletedFollowUp });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const updateFollowUp = async (req, res) => {
  const { id } = req.params;
  const { name, notes, cloudinaryUrl, date, entryID, entryDate } = req.body;

  try {
    let existingFollowUpEntry = await FollowUpEntry.findById(id);
    if (!existingFollowUpEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    if (cloudinaryUrl && existingFollowUpEntry.cloudinaryUrl !== cloudinaryUrl) {
      await FollowUpEntry.findByIdAndDelete(id);
      existingFollowUpEntry = await FollowUpEntry.create({
        name: existingFollowUpEntry.name,
        notes,
        cloudinaryUrl,
        date: existingFollowUpEntry.date,
        userID: existingFollowUpEntry.userID,
        entryID: existingFollowUpEntry.entryID,
        entryDate: existingFollowUpEntry.entryDate,


      });
      return res.json({ message: 'Entry updated successfully', updatedFollowUpEntry: existingFollowUpEntry });
    }

    existingFollowUpEntry.notes = notes;
    existingFollowUpEntry.cloudinaryUrl = cloudinaryUrl;
    existingFollowUpEntry.name = name;
    existingFollowUpEntry.entryID = entryID;
    existingFollowUpEntry.date = date;
    existingFollowUpEntry.entryDate = entryDate;


    existingFollowUpEntry = await existingFollowUpEntry.save();

    res.json({ message: 'Entry updated successfully', updatedFollowUpEntry: existingFollowUpEntry });
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ error: 'An error occurred while updating entry' });
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

    const followUpEntries = await FollowUpEntry.find({ entryID: objectId });
    res.json(followUpEntries);
  } catch (error) {
    console.error('Error fetching follow-up entries:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getFollowUpEntriesByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const { userID } = req.query;

    const searchDate = new Date(date);

    const entries = await FollowUpEntry.find({
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
module.exports = {
  uploadFollowUpController,
  getFollowUpEntriesByEntryId,
  updateFollowUp,
  deleteFollowUp,
  getFollowUpEntriesByDate,
  deleteFollowUpsByEntryId 
};