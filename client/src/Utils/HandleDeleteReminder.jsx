import axiosInstance from '../components/axiosInstance';

// Function to delete a single reminder by its ID
const handleDeleteReminderById = async (reminderId, setReminders, fetchRemindersByEntryId) => {
  try {
    await axiosInstance.delete(`/reminders/${reminderId}`);
    setReminders((prevReminders) => prevReminders.filter((reminder) => reminder._id !== reminderId));
    
    // Fetch updated reminders if needed
    if (fetchRemindersByEntryId) {
      fetchRemindersByEntryId();
    }
  } catch (error) {
    console.error('Error deleting reminder:', error);
  }
};

 const handleDeleteRemindersByEntryId = async (
  entryId, 
  setReminders, 
  fetchRemindersByEntryId
) => {
  try {
    // Fetch reminders associated with the entry
    const reminders = await fetchRemindersByEntryId(entryId);

    // If there are reminders, delete them
    if (reminders && reminders.length > 0) {
      await axiosInstance.delete(`/reminders/entry/${entryId}`);
      setReminders((prevReminders) =>
        prevReminders.filter((reminder) => reminder.entryId !== entryId)
      );
    }
  } catch (error) {
    console.error('Error deleting reminders:', error);
  }
};

export { handleDeleteReminderById, handleDeleteRemindersByEntryId };
