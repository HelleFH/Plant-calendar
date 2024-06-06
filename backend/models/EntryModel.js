const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    notes: { type: String, required: false },
    sunlight: { type: String, required: false },
    water: { type: String, required: false },
    cloudinaryUrl: { type: String, required:false, },
    cloudinaryPublicId: { type: String, required: false }, 
    cloudinaryDeleteToken: { type: String, required: false },
    date: { type: Date, required: true }, // Add date field
    username: { type: String, required: true }, // Add username field
    userID: { type: String, required: true }, // Add date field

});
entrySchema.statics.findByUsername = function(username) {
    return this.find({ username: username }, 'name'); // Only select the 'name' field
  };
  

const Entry = mongoose.model('Entry', entrySchema);

module.exports = { Entry };
