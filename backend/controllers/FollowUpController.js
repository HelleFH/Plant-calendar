const { FollowUpEntry } = require('../models/FollowUpModel');
const cloudinary = require('cloudinary').v2;
const { generateDeletionToken } = require('../utils/tokenUtils');
const mongoose = require('mongoose');


const uploadFollowUpController = async (req, res) => {
  try {
    const { notes, userID, entryID, date, name, entryDate } = req.body;

    if (!userID) {
      return res.status(400).json({ error: 'userID is required.' });
    }

    if (!date) {
      return res.status(400).json({ error: 'Date is required.' });
    }

    const { buffer } = req.file; 

    cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (error, result) => {
      if (error) {
        console.error('Error while uploading to Cloudinary:', error);
        return res.status(400).json({ error: 'Error while uploading entry data. Try again later.' });
      }

      const deletionToken = generateDeletionToken(); 

      const followUpEntry = new FollowUpEntry({
        name,
        notes,
        date,
        entryDate, 
        cloudinaryUrl: result.secure_url,
        cloudinaryPublicId: result.public_id,
        cloudinaryDeleteToken: deletionToken,
        userID: userID,
        entryID: entryID,
        entryDate: entryDate,
      });

      await followUpEntry.save();

      res.json({ msg: 'Entry data uploaded successfully.' });
    }).end(buffer);
  } catch (error) {
    console.error('Error in FollowUpController:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};



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
  getFollowUpEntriesByDate
};