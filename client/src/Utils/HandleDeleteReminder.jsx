import axiosInstance from '../components/axiosInstance'; 


const handleDeleteReminder = async (deletedReminderId) => {
  try {
    await axiosInstance.delete(`reminders/${deletedReminderId}`);
    setReminders((prevReminders) => prevReminders.filter((reminder) => reminder._id !== deletedReminderId));
fetchRemindersByEntryId()    
} catch (error) {
    console.error('Error deleting reminder:', error);
  }
};

export default handleDeleteReminder;
