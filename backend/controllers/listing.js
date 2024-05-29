// entryController.js

const { Entry } = require('../models/entryModel');
const cloudinary = require('cloudinary').v2;
const { generateDeletionToken } = require('../utils/tokenUtils');
const handleFileUpload = async (file) => {
  const token = JSON.parse(localStorage.getItem('auth'));
  const username = JSON.parse(localStorage.getItem('username'));
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      "http://localhost:3001/api/v1/upload",
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        params: {
          name: "Your Name",
          notes: "Your Notes",
          sunlight: "Sunlight",
          water: "Water",
          date: new Date().toISOString(),
          username: username // Pass the username retrieved from local storage
        }
      }
    );
    toast.success(response.data.msg);
  } catch (error) {
    console.error(error);
    toast.error("Error uploading file");
  }
};
module.exports = {
    createEntry,
};
