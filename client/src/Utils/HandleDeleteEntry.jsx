// handleDeleteEntry.js
import axiosInstance from "../components/axiosInstance";

const handleDeleteEntry = async (deletedEntryId, setEntries, setRefresh) => {
  try {
    await axiosInstance.delete(`entries/${deletedEntryId}`);
    setEntries((prevEntries) =>
      prevEntries.filter((entry) => entry._id !== deletedEntryId)
    );
    setRefresh((prev) => !prev);
  } catch (error) {
    console.error('Error deleting entry:', error);
  }
};

export default handleDeleteEntry;
