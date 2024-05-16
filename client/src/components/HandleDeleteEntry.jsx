import axios from 'axios';


const handleDeleteEntry = async (entryId, setEntries) => {
  try {
    await axios.delete(`http://localhost:3001/api/v1/entries/${entryId}`);
    // Upon successful deletion, update entries state by filtering out the deleted entry
    console.log('Entry deleted successfully');
  } catch (error) {
    console.error('Error occurred while deleting entry:', error);
  }
};

export default handleDeleteEntry;
