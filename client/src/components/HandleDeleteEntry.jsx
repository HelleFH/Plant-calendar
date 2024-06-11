import axiosInstance from './axiosInstance'; // Adjust the path as per your project structure

const handleDeleteEntry = async (entryId, onDeleteSuccess) => {
  try {
    await axiosInstance.delete(`/entries/${entryId}`);
    console.log('Entry deleted successfully:', entryId);
    if (onDeleteSuccess) {
      onDeleteSuccess(entryId); // Call the callback function
    }
  } catch (error) {
    console.error('Error occurred while deleting entry:', error);
  }
};

export default handleDeleteEntry;