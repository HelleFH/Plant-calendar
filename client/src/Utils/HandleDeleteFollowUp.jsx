import axiosInstance from '../components/axiosInstance'; 


const handleDeleteFollowUp = async (deletedFollowUpId) => {
  try {
    await axiosInstance.delete(`/entries/follow-up/${deletedFollowUpId}`);
    setFollowUpEntries((prevFollowUpEntries) => prevFollowUpEntries.filter((entry) => entry._id !== deletedFollowUpId));
    fetchFollowUpEntriesByEntryId(); // Refetch follow-up entries
  } catch (error) {
    console.error('Error deleting follow-up:', error);
  }
};

export default handleDeleteFollowUp