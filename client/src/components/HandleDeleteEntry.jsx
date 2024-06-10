import axiosInstance from "./axiosInstance";
export const handleDeleteEntry = async (deletedEntryId) => {
  const { entries, highlightedDates, error: entriesError, setEntries } = useEntries(selectedDate, refresh);

  try {
    await axiosInstance.delete(`entries/${deletedEntryId}`);
    setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== deletedEntryId));
    setRefresh((prev) => !prev);
  } catch (error) {
    console.error('Error deleting entry:', error);
  }
};

export const handleDeleteReminder = async (deletedReminderId) => {
  const { entries, highlightedDates, error: entriesError, setEntries } = useEntries(selectedDate, refresh);

  try {
    await axiosInstance.delete(`reminders/${deletedReminderId}`);
    setReminders((prevReminders) => prevReminders.filter((reminder) => reminder._id !== deletedReminderId));
    setRefresh((prev) => !prev);
  } catch (error) {
    console.error('Error deleting reminder:', error);
  }
};

export const handleDeleteFollowUp = async (deletedFollowUpId) => {
  
  try {
    await axiosInstance.delete(`/entries/follow-up/${deletedFollowUpId}`);
    setFollowUpEntries((prevFollowUpEntries) => prevFollowUpEntries.filter((entry) => entry._id !== deletedFollowUpId));
    setRefresh((prev) => !prev);
  } catch (error) {
    console.error('Error deleting follow-up:', error);
  }
};
