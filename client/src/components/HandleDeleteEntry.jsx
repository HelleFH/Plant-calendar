import axios from 'axios';

const handleDeleteEntry = async (entryId, onDeleteSuccess) => {
  try {
    await axios.delete(`http://localhost:3001/api/v1/entries/${entryId}`);
    console.log('Entry deleted successfully');
    if (onDeleteSuccess) {
      onDeleteSuccess(entryId); // Call the callback function
    }
  } catch (error) {
    console.error('Error occurred while deleting entry:', error);
  }
};

export default handleDeleteEntry;