import axiosInstance from '../components/axiosInstance';
import handleDeleteFollowUp from './HandleDeleteFollowUp';

const handleSubmitUpdateFollowUp = async (id, entryID, entryDate, editedFollowUpEntry, file, selectedDate, onUpdateFollowUpEntry, onDeleteFollowUpEntry) => {
  try {
    console.log('entryID', entryID)

    let uploadResponse;

    if (file) {
      // If there's a new file, upload it first
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', editedFollowUpEntry.name);
      formData.append('notes', editedFollowUpEntry.notes);
      formData.append('date', editedFollowUpEntry.selectedDate);
      formData.append('userID', localStorage.getItem('userId'));
      formData.append('entryID', entryID);
      formData.append('entryDate', entryDate);


      uploadResponse = await axiosInstance.post(`/upload/follow-up`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Prepare data for updating the entry
      const data = {
        name: editedFollowUpEntry.name,
        notes: editedFollowUpEntry.notes,
        cloudinaryUrl: uploadResponse.data.cloudinaryUrl,      
        userID: localStorage.getItem('userId').toString(),
        entryID: entryID,
        entryDate: entryDate,

      };

      // Send PUT request to update the entry
      const updateResponse = await axiosInstance.put(`/entries/follow-up/${id}`, data);

      // Delete the old entry
      await handleDeleteFollowUp(id);
      onDeleteFollowUpEntry(id);

      // Update the parent component with the new entry data
      onUpdateFollowUpEntry(updateResponse.data);

    } else {
      // Prepare data for updating the entry if no new file is uploaded
      const data = {
        name: editedFollowUpEntry.name,
        notes: editedFollowUpEntry.notes,
        date: selectedDate,
        cloudinaryUrl: editedFollowUpEntry.cloudinaryUrl,
        userID: localStorage.getItem('userId').toString(),
        entryID: entryID,
        entryDate: entryDate,

      };

      // Send PUT request to update the entry
      const updateResponse = await axiosInstance.put(`/entries/follow-up/${id}`, data);

      // Update the parent component with the new entry data
      onUpdateFollowUpEntry(updateResponse.data);
    }
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error; // Throw the error for the caller to handle
  }
};

export default handleSubmitUpdateFollowUp;