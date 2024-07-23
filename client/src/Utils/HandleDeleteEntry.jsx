// handleDeleteEntry.js

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
  // Add debug logging
  console.log('Deleted Entry ID:', deletedEntryId);
  console.log('Type of Deleted Entry ID:', typeof deletedEntryId);

  // Validate Entry ID
  if (!deletedEntryId || typeof deletedEntryId !== 'string') {
    console.error(`Invalid Entry ID: ${deletedEntryId}`);
    return;
  }

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

    // Construct the URL
    const deleteEntryUrl = `/entries/${encodeURIComponent(deletedEntryId)}`;
    
    // Delete the entry itself
    const response = await axiosInstance.delete(deleteEntryUrl);
    console.log('Entry deleted:', response.data);

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
    console.error('Error deleting entry:', error.response?.data || error.message);
    // Optionally, handle specific errors or provide user feedback here
  }
};

export default handleDeleteEntry;
