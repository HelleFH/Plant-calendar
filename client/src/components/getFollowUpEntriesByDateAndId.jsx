import axiosInstance from "./axiosInstance";


const getFollowUpEntriesByDateAndId = async (date, userID) => {
  try {
    const response = await axiosInstance.get(`/entries/follow-up/date/${date}?userID=${userID}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    } else {
      throw error;
    }
  }
};

export default getFollowUpEntriesByDateAndId;