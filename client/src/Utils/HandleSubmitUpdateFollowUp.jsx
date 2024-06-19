import axiosInstance from '../components/axiosInstance';
import handleDeleteFollowUp from './HandleDeleteFollowUp';

const handleSubmitUpdateFollowUp = async (id, entryID, name, entryDate, editedFollowUpEntry, file, selectedDate, onUpdateFollowUpEntry, onDeleteFollowUpEntry) => {
  try {
    console.log('entryID', entryID)

    let uploadResponse;

    if (file) {
      
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

      const data = {
        name: editedFollowUpEntry.name,
        notes: editedFollowUpEntry.notes,
        cloudinaryUrl: uploadResponse.data.cloudinaryUrl,      
        userID: localStorage.getItem('userId').toString(),
        entryID: editedFollowUpEntry.entryID,
        entryDate: editedFollowUpEntry.entryDate,

      };

      
      const updateResponse = await axiosInstance.put(`/entries/follow-up/${id}`, data);

      
      await handleDeleteFollowUp(id);
      onDeleteFollowUpEntry(id);

      onUpdateFollowUpEntry(updateResponse.data);

    } else {
      const data = {
        name: editedFollowUpEntry.name,
        notes: editedFollowUpEntry.notes,
        date: selectedDate,
        cloudinaryUrl: editedFollowUpEntry.cloudinaryUrl,
        userID: localStorage.getItem('userId').toString(),
        entryID: editedFollowUpEntry.entryID,
        entryDate: editedFollowUpEntry.entryDate,

      };

      
      const updateResponse = await axiosInstance.put(`/entries/follow-up/${id}`, data);

      onUpdateFollowUpEntry(updateResponse.data);
    }
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error; 
  }
};

export default handleSubmitUpdateFollowUp;