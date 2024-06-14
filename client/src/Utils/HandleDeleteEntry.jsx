import axiosInstance from '../components/axiosInstance'; // Adjust the path as per your project structure

const handleDeleteEntry = async (entryId, onDeleteSuccess) => {
  try {
    await axiosInstance.delete(`/entries/${entryID}`);
    console.log(entryId)
    console.log('Entry deleted successfully:', entryId);
    if (onDeleteSuccess) {
      onDeleteSuccess(entryId); // Call the callback function
    }
  } catch (error) {
    console.error('Error occurred while deleting entry:', error);
  }
};

export default handleDeleteEntry;