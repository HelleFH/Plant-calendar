import axios from 'axios';

const getRemindersByDateAndUsername = async (date, username) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/reminders/date/${date}?username=${username}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // No reminders found for the date and username, return an empty array
      return [];
    } else {
      throw error;
    }
  }
};

export default getRemindersByDateAndUsername;