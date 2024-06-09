const express = require("express");
const router = express.Router();
const multer = require('multer');

const uploadController = require('../controllers/UploadController');
const UserController = require("../controllers/UserController");
const entryController = require('../controllers/EntryController');
const reminderController = require('../controllers/ReminderController');
const followUpController = require('../controllers/FollowUpController');
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


router.post('/upload', upload.single('file'), uploadController.uploadController);
router.post('/upload/follow-up', upload.single('file'), followUpController.uploadFollowUpController);

router.get('/entries/follow-up/:entryID', followUpController.getFollowUpEntriesByEntryId);

router.route("/login").post(UserController.login);
router.route("/register").post(UserController.register);
router.route("/users").get(UserController.getAllUsers);
router.get('/users/:email', UserController.getUserIdByEmail);

router.get('/entries/date/:date', entryController.getEntriesByDate);
router.get('/entries/follow-up/date/:date', followUpController.getFollowUpEntriesByDate);
router.get('/entries/:id', entryController.getEntryById);
router.get('/entries/sorted/userID/:userID', entryController.getSortedEntriesByUserId);
router.get('/entries/userID/:userID', entryController.getEntriesByUserId);


router.delete('/entries/:id', entryController.deleteEntry);
router.delete('/entries/follow-up/:id', followUpController.deleteFollowUp);

router.delete('/reminders/:id', reminderController.deleteReminder);
router.get('/reminders/date/:date', reminderController.getRemindersByDate);
router.get('/reminders/entry/:entryId', reminderController.getRemindersByEntryId);
router.post('/reminders', reminderController.setReminder);

router.put('/entries/:id', entryController.updateEntry);
router.put('/entries/follow-up/:id', followUpController.updateFollowUp);

module.exports = router;