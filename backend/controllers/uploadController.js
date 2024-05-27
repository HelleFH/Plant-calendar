const { Entry } = require('../models/EntryModel');
const { Reminder } = require('../models/ReminderModel');

const cloudinary = require('cloudinary').v2;
const { generateDeletionToken } = require('../utils/tokenUtils');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadController = async (req, res) => {
    const { name, notes, sunlight, watering, date, username } = req.body;

    // Check if username existss
    if (!username) {
        return res.status(400).json({ error: 'Username is required.' });
    }

    // Check if date exists before accessing it
    if (!date) {
        return res.status(400).json({ error: 'Date is required.' });
    }

    const { buffer } = req.file; // Extract file buffer

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
            watering,
            date, // Include date when creating the new entry
            cloudinaryUrl: result.secure_url,
            cloudinaryPublicId: result.public_id,
            cloudinaryDeleteToken: deletionToken,
            username: username // Include the username retrieved from the request body
        });

        await entry.save();

        res.json({ msg: 'Entry data uploaded successfully.' });
    }).end(buffer);
};

const getEntriesByDate = async (req, res) => {
    try {
        // Extract date and username from request parameters
        const { date } = req.params;
        const { username } = req.query;

        // Parse date string into JavaScript Date object
        const searchDate = new Date(date);

        // Get entries for the specified date and username
        const entries = await Entry.find({ 
            date: { 
                $gte: searchDate, 
                $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000) 
            },
            username: username // Add username as a condition
        });

        // Send entries as response
        res.json(entries);
    } catch (error) {
        console.error('Error in getting entries by date:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

const getRemindersByDate = async (req, res) => {
    try {
        // Extract date and username from request parameters
        const { date } = req.params;
        const { username } = req.query;
        

        // Parse date string into JavaScript Date object
        const searchDate = new Date(date);

        // Get entries for the specified date and username
        const reminders = await Reminder.find({ 
            date: { 
                $gte: searchDate, 
                $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000) 
            },
            username: username // Add username as a condition
        });

        // Send entries as response
        res.json(reminders);
    } catch (error) {
        console.error('Error in getting entries by date:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


module.exports = { uploadController, getEntriesByDate, getRemindersByDate };
