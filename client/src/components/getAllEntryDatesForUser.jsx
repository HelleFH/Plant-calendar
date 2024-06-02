import axiosInstance from "./axiosInstance";

const getAllEntryDatesForUser = async (username) => {
  try {
    const response = await axiosInstance.get(`/entries/dates?username=${username}`);
    // Assuming the API returns an array of dates in the format 'YYYY-MM-DD'
    return response.data.dates.map(dateString => new Date(dateString).toDateString());
  } catch (error) {
    console.error('Error fetching all entry dates for user:', error);
    throw error;
  }
};

export default getAllEntryDatesForUser;
