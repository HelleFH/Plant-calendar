import axios from 'axios';

const handleSubmitUpdate = async (id, editedEntry, file, selectedDate, onUpdateEntry, handleDeleteEntry) => {
  try {
    const data = {
      name: editedEntry.name,
      notes: editedEntry.notes,
      sunlight: editedEntry.sunlight,
      water: editedEntry.water,
      date: selectedDate,
      username: editedEntry.username.toString(),
      cloudinaryUrl: editedEntry.cloudinaryUrl // Default to existing URL
    };

    // If there's a new file, upload it first
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', editedEntry.name);
      formData.append('notes', editedEntry.notes);
      formData.append('sunlight', editedEntry.sunlight);
      formData.append('water', editedEntry.water);
      formData.append('username', editedEntry.username);
      formData.append('date', editedEntry.date);

      const uploadResponse = await axios.post(`http://localhost:3001/api/v1/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update cloudinaryUrl in the data
      data.cloudinaryUrl = uploadResponse.data.cloudinaryUrl;
    }

    // Send PUT request to update the entry
    const updateResponse = await axios.put(`http://localhost:3001/api/v1/entries/${id}`, data);

    // Update the parent component with the new entry data
    onUpdateEntry(updateResponse.data);

    // Delete the old entry if the image was updated
    if (file) {
      await handleDeleteEntry(id);
    }

    return updateResponse.data;
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error; // Throw the error for the caller to handle
  }
};

export default handleSubmitUpdate;