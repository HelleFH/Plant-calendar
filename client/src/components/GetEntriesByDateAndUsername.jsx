import axiosInstance from "./axiosInstance";

// Function to fetch entries by date and username
const getEntriesByDateAndUsername = async (date, username) => {
  try {
    const response = await axiosInstance.get(`/entries/date/${date}?username=${username}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // No entries found for the date and username, return an empty array
      return [];
    } else {
      throw error;
    }
  }
};

export default getEntriesByDateAndUsername;