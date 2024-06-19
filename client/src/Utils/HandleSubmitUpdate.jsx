import axiosInstance from '../components/axiosInstance';
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

      
      const updateResponse = await axiosInstance.put(`/entries/${id}`, data);

      
      await handleDeleteEntry(id);
      onDeleteEntry(id);

      onUpdateEntry(updateResponse.data);

    } else {
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

      
      const updateResponse = await axiosInstance.put(`/entries/${id}`, data);

      onUpdateEntry(updateResponse.data);
    }
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error; 
  }
};

export default handleSubmitUpdate;