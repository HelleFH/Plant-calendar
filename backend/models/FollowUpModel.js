const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  cloudinaryUrl: { type: String, required: false },
  cloudinaryPublicId: { type: String, required: false },
  cloudinaryDeleteToken: { type: String, required: false },
},{ _id: false });


const followUpEntrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  notes: { type: String, required: false },
  images: [imageSchema], // Array of image objects
  date: { type: Date, required: true },
  entryDate: { type: Date, required: true },
  userID: { type: String, required: true },
  entryID: { type: String, required: true },
});

const FollowUpEntry = mongoose.model('FollowUpEntry', followUpEntrySchema);

module.exports = { FollowUpEntry };
