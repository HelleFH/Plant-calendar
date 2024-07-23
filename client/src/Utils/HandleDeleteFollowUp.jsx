import axiosInstance from '../components/axiosInstance';

const handleDeleteFollowUpById = async (followUpId, setFollowUpEntries, fetchFollowUpEntriesByEntryId) => {
  try {
    await axiosInstance.delete(`entries/follow-up/${followUpId}`);
    if (typeof setFollowUpEntries === 'function') {
      setFollowUpEntries((prevFollowUpEntries) => prevFollowUpEntries.filter((entry) => entry._id !== followUpId));
    } else {
      console.error('setFollowUpEntries is not a function');
    }
    
    // Fetch updated follow-ups if needed
    if (fetchFollowUpEntriesByEntryId) {
      fetchFollowUpEntriesByEntryId();
    }
  } catch (error) {
    console.error('Error deleting follow-up:', error);
  }
};


 const handleDeleteFollowUpsByEntryId = async (
  entryId, 
  setFollowUpEntries, 
  fetchFollowUpEntriesByEntryId, 
  setRefresh
) => {
  try {
    // Fetch follow-up entries associated with the entry
    const followUpEntries = await fetchFollowUpEntriesByEntryId(entryId);

    // If there are follow-up entries, delete them
    if (followUpEntries && followUpEntries.length > 0) {
      await axiosInstance.delete(`/follow-ups/entry/${entryId}`);
      setFollowUpEntries((prevFollowUpEntries) =>
        prevFollowUpEntries.filter((followUp) => followUp.entryId !== entryId)
      );
      if (typeof setRefresh === 'function') {
        setRefresh((prev) => !prev);
      } else {
        console.error('setRefresh is not a function');
      }
    }
  } catch (error) {
    console.error('Error deleting follow-ups:', error);
  }
};

export { handleDeleteFollowUpById, handleDeleteFollowUpsByEntryId };