import axiosInstance from "./axiosInstance";


const getEntriesByDateAndId = async (date, userID) => {
  try {
    const response = await axiosInstance.get(`/entries/date/${date}?userID=${userID}`);
    console.log(userID)
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

export default getEntriesByDateAndId;