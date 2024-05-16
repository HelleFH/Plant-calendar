const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    notes: { type: String, required: false },
    sunlight: { type: String, required: false },
    watering: { type: String, required: false },
    cloudinaryUrl: { type: String, required:false, },
    cloudinaryPublicId: { type: String, required: false }, 
    cloudinaryDeleteToken: { type: String, required: false },
    date: { type: Date, required: true }, // Add date field
    username: { type: String, required: true } // Add username field
});

const Entry = mongoose.model('Entry', entrySchema);

module.exports = { Entry };
