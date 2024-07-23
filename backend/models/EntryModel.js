const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    cloudinaryUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
    cloudinaryDeleteToken: { type: String, required: true }
}, { _id: false });

const entrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    notes: { type: String, required: false },
    sunlight: { type: String, required: false },
    water: { type: String, required: false },
    images: [imageSchema], // Array of image objects
    date: { type: Date, required: true },
    username: { type: String, required: true },
    userID: { type: String, required: true }
});

entrySchema.statics.findByUsername = function(username) {
    return this.find({ username: username }, 'name');
};

const Entry = mongoose.model('Entry', entrySchema);

module.exports = { Entry };
