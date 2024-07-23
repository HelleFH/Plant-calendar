import axiosInstance from '../components/axiosInstance';


const fetchFollowUpEntriesByEntryId = async () => {
  try {
    const response = await axiosInstance.get(`/entries/follow-up/${entry._id}`);
    setFollowUpEntries(response.data);

    const followUpUrls = response.data.flatMap(entry => entry.images?.map(img => img.cloudinaryUrl) || []);
    setCloudinaryUrls(prevUrls => [...prevUrls, ...followUpUrls]);
  } catch (error) {
    console.error('Error fetching follow-up entries by entry ID:', error);
  }
};

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
  setRefresh
) => {
  try {
    console.log('Deleting follow-ups for entry ID:', entryId);
    const response = await axiosInstance.get(`/entries/follow-up/${entryId}`);
    
    // Log the response to verify its structure
    console.log('API Response:', response.data);
    
    // Ensure response.data is an array
    const followUpEntries = Array.isArray(response.data) ? response.data : [];
    
    console.log('Follow-up entries:', followUpEntries);

    await Promise.all(
      followUpEntries.map(async (followUpEntry) => {
        console.log('Deleting follow-up entry:', followUpEntry._id);
        await axiosInstance.delete(`/entries/follow-up/${followUpEntry._id}`);
      })
    );

    if (setFollowUpEntries) {
      setFollowUpEntries([]);
    }

    if (fetchFollowUpEntriesByEntryId) {
      fetchFollowUpEntriesByEntryId();
    }

    if (setRefresh) {
      setRefresh((prev) => !prev);
    }
  } catch (error) {
    console.error('Error deleting follow-ups by entry ID:', error);
  }
};

export { handleDeleteFollowUpById, handleDeleteFollowUpsByEntryId };