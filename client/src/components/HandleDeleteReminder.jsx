import axios from 'axios';

const handleDeleteReminder = async (entryId, onDeleteSuccess) => {
  try {
    await axios.delete(`http://localhost:3001/api/v1/reminders/${reminderID}`);
    console.log('Entry deleted successfully');
    if (onDeleteSuccess) {
      onDeleteSuccess(reminderId); // Call the callback function
    }
  } catch (error) {
    console.error('Error occurred while deleting entry:', error);
  }
};

export default handleDeleteReminder;