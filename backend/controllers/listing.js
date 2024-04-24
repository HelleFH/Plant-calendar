const { Listing } = require('../models/listingModel');
const cloudinary = require('cloudinary').v2;
const { generateDeletionToken } = require('../utils/tokenUtils');

// Route to handle image upload and listing creation
const uploadListing = async (req, res) => {
    try {
        console.log('Received upload request:', req.file);
        const { buffer } = req.file;
        const { title, description, location, date } = req.body; // Include date in the request body

        // Upload file to Cloudinary directly from the buffer
        const result = await cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (error, result) => {
            if (error) {
                console.error('Error while uploading to Cloudinary:', error);
                return res.status(400).json({ error: 'Error while uploading listing data. Try again later.' });
            }

            const deletionToken = generateDeletionToken();

            const listing = new Listing({
                title,
                description,
                location,
                date, // Include date when creating the new listing
                cloudinaryUrl: result.secure_url,
                cloudinaryPublicId: result.public_id,
                cloudinaryDeleteToken: deletionToken,
            });

            await listing.save();

            res.json({ msg: 'Listing data uploaded successfully.' });
        }).end(buffer);
    } catch (error) {
        console.error('Error occurred during upload:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Route to fetch listings for a specific date
const getListingsByDate = async (req, res) => {
    try {
        const { date } = req.params;
        // Query database to find listings for the specified date
        const listings = await Listing.find({ date: { $eq: new Date(date) } });
        res.json(listings);
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = { uploadListing, getListingsByDate };
