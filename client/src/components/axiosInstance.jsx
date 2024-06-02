import axios from 'axios';


// Create an instance of Axios with the API_URL from environment variables
 const axiosInstance = axios.create({
  baseURL:'https://plant-calendar-opoo.onrender.com/api/v1',
});



  export default axiosInstance;
