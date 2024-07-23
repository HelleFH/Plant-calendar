import axiosInstance from "../components/axiosInstance";
import { handleDeleteFollowUpsByEntryId } from "./HandleDeleteFollowUp";
import { handleDeleteRemindersByEntryId } from "./HandleDeleteReminder";

const handleDeleteEntry = async (
  deletedEntryId, 
  setEntries, 
  setFollowUpEntries, 
  setReminders, 
  fetchFollowUpEntriesByEntryId, 
  fetchRemindersByEntryId, 
  setRefresh
) => {
  try {
    // Delete associated follow-ups
    await handleDeleteFollowUpsByEntryId(
      deletedEntryId, 
      setFollowUpEntries, 
      fetchFollowUpEntriesByEntryId, 
      setRefresh
    );

    // Delete associated reminders
    await handleDeleteRemindersByEntryId(
      deletedEntryId, 
      setReminders, 
      fetchRemindersByEntryId
    );

    // Delete the entry itself
    await axiosInstance.delete(`/entries/${deletedEntryId}`);

    // Update the state to reflect the deletion
    setEntries((prevEntries) =>
      prevEntries.filter((entry) => entry._id !== deletedEntryId)
    );

    // Optionally toggle refresh state
    if (typeof setRefresh === 'function') {
      setRefresh((prev) => !prev);
    } else {
      console.error('setRefresh is not a function');
    }
  } catch (error) {
    console.error('Error deleting entry:', error);
    // Optionally, handle specific errors or provide user feedback here
  }
};

export default handleDeleteEntry;
