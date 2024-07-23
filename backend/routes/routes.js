const express = require("express");
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const UserController = require("../controllers/UserController");
const entryController = require('../controllers/EntryController');
const reminderController = require('../controllers/ReminderController');
const followUpController = require('../controllers/FollowUpController');

const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100000000, // max file size 100MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            return cb(new Error('Only upload files with jpeg, jpg, or png format.'));
        }
        cb(null, true);
    },
}).array('images'); // 'images' is the field name expected in the form data

router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.get("/users", UserController.getAllUsers);
router.get('/users/:email', UserController.getUserIdByEmail);

// Entry routes
router.post('/upload', upload, uploadController.uploadController);
router.post('/upload/follow-up', upload, followUpController.uploadFollowUpController);
router.post('/reminders', reminderController.setReminder);

router.get('/entries/date/:date', entryController.getEntriesByDate);
router.get('/entries/follow-up/date/:date', followUpController.getFollowUpEntriesByDate);
router.get('/entries/:id', entryController.getEntryById);
router.get('/entries/follow-up/:entryID', followUpController.getFollowUpEntriesByEntryId);
router.get('/entries/by-follow-up/:entryID', entryController.getEntryByEntryID);

router.get(`/entries/sorted/userID/:userID`, entryController.getSortedEntriesByUserId);
router.get('/reminders/date/:date', reminderController.getRemindersByDate);
router.get('/reminders/entry/:entryID', reminderController.getRemindersByEntryId);

router.delete('/entries/:id', entryController.deleteEntry);
router.delete('/entries/follow-up/:id', followUpController.deleteFollowUp);
router.delete('/delete-entry/follow-up/:entryID', followUpController.deleteFollowUpsByEntryId);
router.delete('/reminders/:id', reminderController.deleteReminder);

router.put('/entries/:id', entryController.updateEntry);
router.put('/entries/follow-up/:id', followUpController.updateFollowUp);
router.post('/delete-image', uploadController.deleteImage);

module.exports = router;
