const { Entry } = require('../models/EntryModel');
const { FollowUpEntry } = require('../models/FollowUpModel');

const { Reminder } = require('../models/ReminderModel');

const cloudinary = require('cloudinary').v2;
const { generateDeletionToken } = require('../utils/tokenUtils');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadController = async (req, res) => {
    const { name, notes, sunlight, water, date, username, userID } = req.body;


    if (!username) {
        return res.status(400).json({ error: 'Username is required.' });
    }

    if (!date) {
        return res.status(400).json({ error: 'Date is required.' });
    }

    const { buffer } = req.file; 

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
            date, 
            cloudinaryUrl: result.secure_url,
            cloudinaryPublicId: result.public_id,
            cloudinaryDeleteToken: deletionToken,
            username: username,
            userID: userID 
        });

        await entry.save();

        res.json({ msg: 'Entry data uploaded successfully.' });
    }).end(buffer);
};



const getEntriesByDate = async (req, res) => {
    try {
            const { date } = req.params;
        const { userID } = req.query;

            const searchDate = new Date(date);

            const entries = await Entry.find({ 
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


module.exports = { uploadController, getEntriesByDate };