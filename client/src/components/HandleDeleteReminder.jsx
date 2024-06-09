import axiosInstance from './axiosInstance'; 

const handleDeleteReminder = async (reminderId, onDeleteSuccess) => {
  try {
    await axiosInstance.delete(`/reminders/${reminderId}`);
    console.log('Reminder deleted successfully');
    if (onDeleteSuccess) {
      onDeleteSuccess(reminderId); 
    }
  } catch (error) {
    console.error('Error occurred while deleting reminder:', error);
  }
};

export default handleDeleteReminder;
