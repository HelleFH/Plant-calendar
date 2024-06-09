import axiosInstance from './axiosInstance'; 

const handleDeleteFollowUp = async (entryId, onDeleteSuccess) => {
  try {
    await axiosInstance.delete(`/entries/follow-up/${entryId}`);
    console.log('Entry deleted successfully:', entryId);
    if (onDeleteSuccess) {
      onDeleteSuccess(entryId); 
    }
  } catch (error) {
    console.error('Error occurred while deleting entry:', error);
  }
};

export default handleDeleteFollowUp;