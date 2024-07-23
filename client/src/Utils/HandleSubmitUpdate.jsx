import axiosInstance from '../components/axiosInstance';
import handleDeleteImage from './HandleDeleteImage';

const handleSubmitUpdate = async (
  id, 
  editedEntry, 
  file, 
  selectedDate, 
  onUpdateEntry
) => {
  try {
    let uploadResponse;

    // If a new image is provided
    if (file) {
      // Prepare form data for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', editedEntry.name);
      formData.append('notes', editedEntry.notes);
      formData.append('sunlight', editedEntry.sunlight);
      formData.append('water', editedEntry.water);
      formData.append('username', editedEntry.username);
      formData.append('date', selectedDate);
      formData.append('userID', localStorage.getItem('userId'));

      // Upload file and get the URL
      uploadResponse = await axiosInstance.post(`/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Prepare data for entry update
      const data = {
        name: editedEntry.name,
        notes: editedEntry.notes,
        sunlight: editedEntry.sunlight,
        water: editedEntry.water,
        date: selectedDate,
        username: editedEntry.username.toString(),
        cloudinaryUrl: uploadResponse.data.cloudinaryUrl,
        userID: localStorage.getItem('userId'),
      };

      // Fetch existing entry to get old image details
      const existingEntryResponse = await axiosInstance.get(`/entries/${id}`);
      const existingEntry = existingEntryResponse.data;

      // Delete the old image from Cloudinary if it exists
      if (existingEntry.cloudinaryUrl) {
        await handleDeleteImage(existingEntry.cloudinaryUrl);
      }

      // Update the entry with new image data
      const updateResponse = await axiosInstance.put(`/entries/${id}`, data);

      // Update UI with new entry data
      onUpdateEntry(updateResponse.data);
    } else {
      // Prepare data for entry update without file upload
      const data = {
        name: editedEntry.name,
        notes: editedEntry.notes,
        sunlight: editedEntry.sunlight,
        water: editedEntry.water,
        date: selectedDate,
        username: editedEntry.username.toString(),
        cloudinaryUrl: editedEntry.cloudinaryUrl,
        userID: localStorage.getItem('userId'),
      };

      // Update the entry
      const updateResponse = await axiosInstance.put(`/entries/${id}`, data);

      // Update UI with new entry data
      onUpdateEntry(updateResponse.data);
    }
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error; 
  }
};

export default handleSubmitUpdate;
