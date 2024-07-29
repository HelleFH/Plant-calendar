const { FollowUpEntry } = require('../models/FollowUpModel');
const cloudinary = require('cloudinary').v2;
const { generateDeletionToken } = require('../utils/tokenUtils');
const mongoose = require('mongoose');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteFollowUpsByEntryId = async (entryId) => {
  try {
    const followUps = await FollowUpEntry.find({ entryId });

    if (followUps.length > 0) {
      await Promise.all(
        followUps.map(async (followUp) => {
          await FollowUpEntry.findByIdAndDelete(followUp._id);
        })
      );
      console.log('Follow-ups deleted successfully');
    } else {
      console.log('No follow-ups found for this entry ID');
    }
  } catch (error) {
    console.error('Error deleting follow-ups by entry ID:', error);
    throw error;
  }
};


const uploadFollowUpController = async (req, res) => {
  const { notes, userID, entryID, date, name, entryDate } = req.body;
  const files = req.files; // Expecting multiple files in req.files

  if (!userID || !date) {
    return res.status(400).json({ error: 'UserID and Date are required.' });
  }

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'At least one image is required.' });
  }

  try {
    // Handle image uploads to Cloudinary
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

    // Create a new FollowUpEntry
    const followUpEntry = new FollowUpEntry({
      name,
      notes,
      date,
      entryDate,
      images, // Save multiple images
      userID,
      entryID
    });

    await followUpEntry.save();

    res.json({ msg: 'Follow-up entry data uploaded successfully.', followUpEntry });
  } catch (error) {
    console.error('Error while processing the follow-up upload:', error);
    res.status(500).json({ error: 'Internal server error' });
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
    console.log('Follow_up_Cloudinary public_id:', cloudinaryPublicId);

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