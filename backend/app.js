require("dotenv").config();
require('express-async-errors');
const connectDB = require("./db/connect");
const express = require("express");
const cors = require('cors');
const app = express();
const mainRouter = require("./routes/routes");
const path = require('path'); // Add this line to import the 'path' module

app.use(express.json());
app.use(cors())
app.use("/api/v1", mainRouter);


app.use(express.static('public'));

const port = process.env.PORT || 3001;
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});


const corsOptions = {
    origin: ['http://localhost:5173', 'https://plant-calendar-1.onrender.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };

  app.use(cors(corsOptions));


const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const start = async () => {

    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        })

    } catch (error) {
        console.log(error);
    }
}

start();

