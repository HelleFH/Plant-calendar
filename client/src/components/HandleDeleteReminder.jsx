import axiosInstance from './axiosInstance'; // Adjust the path as per your project structure

const handleDeleteReminder = async (reminderId, onDeleteSuccess) => {
  try {
    await axiosInstance.delete(`/reminders/${reminderId}`);
    console.log('Reminder deleted successfully');
    if (onDeleteSuccess) {
      onDeleteSuccess(reminderId); // Call the callback function
    }
  } catch (error) {
    console.error('Error occurred while deleting reminder:', error);
  }
};

export default handleDeleteReminder;
