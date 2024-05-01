const express = require("express");
const router = express.Router();
const { uploadController, getListingsByDate } = require('../controllers/uploadController');
const { login, register, dashboard, getAllUsers } = require("../controllers/user");
const authMiddleware = require('../middleware/auth');
const multer = require('multer');

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
router.route("/dashboard").get(authMiddleware, dashboard);
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

// GET route for retrieving listings by date
router.get('/listings/:date', getListingsByDate);

module.exports = router;
