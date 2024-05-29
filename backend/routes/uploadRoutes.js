const express = require('express');
const { Entry } = require('../models/entryModel');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(), 
  limits: {
    fileSize: 100000000, // max file size 10MB 
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return cb(new Error('Only upload files with jpeg, jpg, or png format.'));
    }
    cb(null, true); 
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const { generateDeletionToken } = require('../utils/tokenUtils'); 

// Route to handle image upload and entry creation
router.post('/upload', upload.single('file'), async (req, res) => {
    const { name, notes, sunlight, water, date } = req.body; // Destructure from req.body, not req.file
  
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
        water,
        date, // Include date when creating the new entry
        cloudinaryUrl: result.secure_url,
        cloudinaryPublicId: result.public_id, 
        cloudinaryDeleteToken: deletionToken, 
      });
  
      await entry.save();
  
      res.json({ msg: 'Entry data uploaded successfully.' });
    }).end(buffer);
  });
  
module.exports = router;
