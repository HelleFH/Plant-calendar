const express = require("express");
const router = express.Router();
 const { Entry } = require('../models/EntryModel');
const { uploadController, getEntriesByDate, getFollowUpEntriesByDate } = require('../controllers/uploadController');
const { login, register, getAllUsers, getUserIdByEmail } = require("../controllers/user");
const multer = require('multer');
const EntryController = require('../controllers/EntryController'); // Import entry controller
const reminderController = require('../controllers/ReminderController');
const followUpEntryController = require('../controllers/FollowUpController');


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

router.post('/upload', upload.single('file'), uploadController);
router.post('/upload/follow-up', upload.single('file'), followUpEntryController.FollowUpController);
router.get('/entries/follow-up/:entryID', followUpEntryController.getFollowUpEntriesByEntryId);
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/users").get(getAllUsers);
router.get('/entries/date/:date', getEntriesByDate); // Fetch entries by date

router.get('/entries/follow-up/date/:date', getFollowUpEntriesByDate);


router.delete('/entries/:id', EntryController.deleteEntry);
router.delete('/entries/follow-up/:id', followUpEntryController.deleteFollowUp);

router.delete('/reminders/:id', reminderController.deleteReminder);
router.post('/reminders', reminderController.setReminder); // New route for setting reminders
router.get('/reminders/date/:date', reminderController.getRemindersByDate);
 // New route for setting reminders
router.get(`/entries/:id`, EntryController.getEntryById);
router.put('/entries/:id', EntryController.updateEntry);

router.put('/entries/follow-up/:id', followUpEntryController.updateFollowUp);

router.get('/reminders/entry/:entryId', reminderController.getRemindersByEntryId);
router.get('/users/:email', getUserIdByEmail);

router.get('/entries/userID/:userID', EntryController.getEntriesByUserId);



module.exports = router;