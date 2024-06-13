const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    notes: { type: String, required: false },
    cloudinaryUrl: { type: String, required:false, },
    cloudinaryPublicId: { type: String, required: false }, 
    cloudinaryDeleteToken: { type: String, required: false },
    date: { type: Date, required: true },
    userID: { type: String, required: true },
    entryID: { type: String, required: true }, 
    entryDate: { type: String, required: true }, 

});

const FollowUpEntry = mongoose.model('FollowUpEntry', entrySchema);

module.exports = { FollowUpEntry };
