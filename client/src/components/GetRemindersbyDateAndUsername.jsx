import axiosInstance from "./axiosInstance";

const getRemindersByDateAndUsername = async (date, username) => {
  try {
    const response = await axiosInstance.get(`/reminders/date/${date}?username=${username}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    } else {
      throw error;
    }
  }
};

export default getRemindersByDateAndUsername;