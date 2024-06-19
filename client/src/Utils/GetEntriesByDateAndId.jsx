import axiosInstance from "../components/axiosInstance";


const getEntriesByDateAndId = async (date, userID) => {
  try {
    const response = await axiosInstance.get(`/entries/date/${date}?userID=${userID}`);
    console.log(userID)
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    } else {
      throw error;
    }
  }
};

export default getEntriesByDateAndId;