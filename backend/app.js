require('dotenv').config();
require('express-async-errors');
const connectDB = require("./db/connect");
const express = require("express");
const cors = require('cors');
const path = require('path');
const app = express();
const mainRouter = require("./routes/routes");

const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://plant-calendar-1.onrender.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}));

// API routes
app.use("/api/v1", mainRouter);

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, '../client/dist')));  // Adjusted path

// Catch-all route for serving the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));  // Adjusted path
});

// Cloudinary configuration
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Start server
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    } catch (error) {
        console.error(error);
    }
};

start();
