const { Entry } = require('../models/EntryModel');
const { FollowUpEntry } = require('../models/FollowUpModel');
const cloudinary = require('cloudinary').v2;
const { generateDeletionToken } = require('../utils/tokenUtils');

const uploadController = async (req, res) => {
    const { name, notes, sunlight, water, date, username, userID } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required.' });
    }

    if (!date) {
        return res.status(400).json({ error: 'Date is required.' });
    }

    const { buffer } = req.file;
    // Upload file to Cloudinary directly from the buffer
    const result = await cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (error, result) => {
        if (error) {
            console.error('Error while uploading to Cloudinary:', error);
            return res.status(400).json({ error: 'Error while uploading entry data. Try again later.' });
        }

        const deletionToken = generateDeletionToken();

        const entry = new Entry({
            name,
            notes,
            sunlight,
            water,
            date, // Include date when creating the new entry
            cloudinaryUrl: result.secure_url,
            cloudinaryPublicId: result.public_id,
            cloudinaryDeleteToken: deletionToken,
            username: username,
            userID: userID // Include the username retrieved from the request body
        });

        await entry.save();

        res.json({ msg: 'Entry data uploaded successfully.' });
    }).end(buffer);
};



module.exports = { uploadController  };
