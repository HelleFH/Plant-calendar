import axiosInstance from './axiosInstance';
import handleDeleteFollowUp from './HandleDeleteFollowUp';

const handleUpdateFollowUp = async (id, editedEntry, file, selectedDate, onUpdateEntry, onDeleteEntry) => {
  try {
    let uploadResponse;

    if (file) {
      // If there's a new file, upload it first
      const formData = new FormData();
      formData.append('file', file);
      formData.append('notes', editedEntry.notes);
      formData.append('date', editedEntry.date);

      uploadResponse = await axiosInstance.post(`/upload/follow-up`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Prepare data for updating the entry
      const data = {
        notes: editedEntry.notes,
        date: selectedDate,
        cloudinaryUrl: uploadResponse.data.cloudinaryUrl,
      };

      // Send PUT request to update the entry
      const updateResponse = await axiosInstance.put(`/entries/follow-up/${id}`, data);
      
      if (updateResponse.status === 200) {
        // Delete the old entry
        await handleDeleteFollowUp(id);
        onDeleteEntry(id);

        // Update the parent component with the new entry data
        onUpdateEntry(updateResponse.data);
      } else {
        console.error('Update failed with status:', updateResponse.status);
        throw new Error('Failed to update the entry');
      }

    } else {
      // Prepare data for updating the entry if no new file is uploaded
      const data = {
        notes: editedEntry.notes,
        date: selectedDate,
        cloudinaryUrl: editedEntry.cloudinaryUrl,
      };

      // Send PUT request to update the entry
      const updateResponse = await axiosInstance.put(`/entries/follow-up/${id}`, data);

      if (updateResponse.status === 200) {
        // Update the parent component with the new entry data
        onUpdateEntry(updateResponse.data);
      } else {
        console.error('Update failed with status:', updateResponse.status);
        throw new Error('Failed to update the entry');
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error('Entry not found:', id);
    } else {
      console.error('Error updating entry:', error);
    }
    throw error; // Throw the error for the caller to handle
  }
};

export default handleUpdateFollowUp;
