import axiosInstance from './axiosInstance';
import handleDeleteEntry from './HandleDeleteEntry';

const handleSubmitUpdate = async (
  id, 
  editedEntry, 
  file, 
  selectedDate, 
  onUpdateEntry, 
  onDeleteEntry,) => {
  try {
    let uploadResponse;

    if (file) {
      // If there's a new file, upload it first
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', editedEntry.name);
      formData.append('notes', editedEntry.notes);
      formData.append('sunlight', editedEntry.sunlight);
      formData.append('water', editedEntry.water);
      formData.append('username', editedEntry.username);
      formData.append('date', editedEntry.date);
      formData.append('userID', localStorage.getItem('userId'))

      uploadResponse = await axiosInstance.post(`/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Prepare data for updating the entry
      const data = {
        name: editedEntry.name,
        notes: editedEntry.notes,
        sunlight: editedEntry.sunlight,
        water: editedEntry.water,
        date: selectedDate,
        username: editedEntry.username.toString(),
        cloudinaryUrl: uploadResponse.data.cloudinaryUrl,      
        userID:('userID', localStorage.getItem('userId'))

      };

      // Send PUT request to update the entry
      const updateResponse = await axiosInstance.put(`/entries/${id}`, data);

      // Delete the old entry
      await handleDeleteEntry(id);
      onDeleteEntry(id);

      // Update the parent component with the new entry data
      onUpdateEntry(updateResponse.data);

    } else {
      // Prepare data for updating the entry if no new file is uploaded
      const data = {
        name: editedEntry.name,
        notes: editedEntry.notes,
        sunlight: editedEntry.sunlight,
        water: editedEntry.water,
        date: selectedDate,
        username: editedEntry.username.toString(),
        cloudinaryUrl: editedEntry.cloudinaryUrl,
        userID:localStorage.getItem('userId'),
      };

      // Send PUT request to update the entry
      const updateResponse = await axiosInstance.put(`/entries/${id}`, data);

      // Update the parent component with the new entry data
      onUpdateEntry(updateResponse.data);
    }
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error; // Throw the error for the caller to handle
  }
};

export default handleSubmitUpdate;