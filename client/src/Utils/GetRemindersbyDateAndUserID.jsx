import axiosInstance from "../components/axiosInstance";

const getRemindersByDateAndUserID = async (date) => {

  const userID = localStorage.getItem('userId')
  try {
    const response = await axiosInstance.get(`/reminders/date/${date}?userID=${userID}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    } else {
      throw error;
    }
  }
};

export default getRemindersByDateAndUserID;