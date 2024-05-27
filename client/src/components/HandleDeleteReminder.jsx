import axios from 'axios';

const handleDeleteReminder = async (reminderId, onDeleteSuccess) => {
  try {
    await axios.delete(`http://localhost:3001/api/v1/reminders/${reminderId}`);
    console.log('Reminder deleted successfully');
    if (onDeleteSuccess) {
      onDeleteSuccess(reminderId); // Call the callback function
    }
  } catch (error) {
    console.error('Error occurred while deleting reminder:', error);
  }
};

export default handleDeleteReminder;
