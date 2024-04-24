const express = require("express");
const router = express.Router();

const { login, register, dashboard, getAllUsers } = require("../controllers/user");
const { uploadListing, getListingsByDate } = require("../controllers/listing"); // Change import

const authMiddleware = require('../middleware/auth');

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/dashboard").get(authMiddleware, dashboard);
router.route("/users").get(getAllUsers);
router.route("/upload").post(uploadListing);
router.route("/listings/:date").get(getListingsByDate); // Change route handler

module.exports = router;
