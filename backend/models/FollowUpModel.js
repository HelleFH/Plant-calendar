const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    notes: { type: String, required: false },
    cloudinaryUrl: { type: String, required:false, },
    cloudinaryPublicId: { type: String, required: false }, 
    cloudinaryDeleteToken: { type: String, required: false },
    date: { type: Date, required: true }, // Add date field
    userID: { type: String, required: true }, // Add date field
    entryID: { type: String, required: true }, // Add date field

});

const FollowUpEntry = mongoose.model('FollowUpEntry', entrySchema);

module.exports = { FollowUpEntry };
