const express = require("express");
const router = express.Router();
 const { Entry } = require('../models/EntryModel');
const { uploadController, getEntriesByDate } = require('../controllers/uploadController');
const { login, register, getAllUsers } = require("../controllers/user");
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;


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

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/users").get(getAllUsers);

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Retrieve the username from the request body
        const username = req.body.username;

        // Check if username is provided
        if (!username) {
            return res.status(400).json({ error: 'Username is required.' });
        }

        // Call uploadController and pass the username along with other data
        await uploadController(req, res, username);
    } catch (error) {
        console.error('Error in upload route:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

router.get('/entries/date/:date', getEntriesByDate); // Fetch entries by date
router.delete('/entries/:id', async (req, res) => {
    const { id } = req.params;
  
    const deletedEntry = await Entry.findByIdAndDelete(id);
  
    if (!deletedEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
  
  //delete image using cloudinary public ID
    const { cloudinaryPublicId } = deletedEntry;
    console.log('Cloudinary public_id:', cloudinaryPublicId);
  
    if (cloudinaryPublicId) {
      const result = await cloudinary.uploader.destroy(cloudinaryPublicId);
      console.log('Cloudinary deletion result:', result);
    }
  
    res.json({ message: 'Entry deleted successfully', deletedEntry });
  });
  router.delete('/delete-image/:publicId', async (req, res) => {
    const { publicId } = req.params;
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary deletion result:', result);
    res.json({ message: 'Image deleted from Cloudinary successfully' });
  });
  
  router.put('/entries/:id', async (req, res) => {
    const { id } = req.params;
    const { name, notes, sunlight, watering, cloudinaryUrl } = req.body;
    
    try {
      let existingEntry = await Entry.findById(id);
      if (!existingEntry) {
        return res.status(404).json({ error: 'Entry not found' });
      }
  
      if (cloudinaryUrl && existingEntry.cloudinaryUrl !== cloudinaryUrl) {
        // If there's a new cloudinaryUrl, delete the existing entry and create a new one
        await Entry.findByIdAndDelete(id);
        existingEntry = await Entry.create({
          name,
          notes,
          sunlight,
          watering,
          cloudinaryUrl,
          date: existingEntry.date, // Preserve the original date
          username: existingEntry.username // Preserve the original username
        });
        return res.json({ message: 'Entry updated successfully', updatedEntry: existingEntry });
      }
  
      // Update the existing entry with the new data
      existingEntry.name = name;
      existingEntry.notes = notes;
      existingEntry.sunlight = sunlight;
      existingEntry.watering = watering;
      existingEntry.cloudinaryUrl = cloudinaryUrl;
  
      // Save the updated entry
      existingEntry = await existingEntry.save();
      
      res.json({ message: 'Entry updated successfully', updatedEntry: existingEntry });
    } catch (error) {
      console.error('Error updating entry:', error);
      res.status(500).json({ error: 'An error occurred while updating entry' });
    }
  });
  
  
  module.exports = router;

module.exports = router;
