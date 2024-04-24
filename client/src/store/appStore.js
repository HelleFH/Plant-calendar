import axios from 'axios';

export const createListing = async (file, listing, setFile, setPreviewSrc, setIsPreviewAvailable, navigate, setErrorMsg) => {
  try {
    if (!file) {
      setErrorMsg('Please select a file to add.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', listing.title);
    formData.append('description', listing.description);
    formData.append('location', listing.location);
    formData.append('date', listing.date); // Include the date field

    // Send POST request to create new listing
    await axios.post(`http://localhost:3001/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Reset form state and navigate to home page
    setFile(null);
    setPreviewSrc('');
    setIsPreviewAvailable(false);
    navigate('/');
  } catch (error) {
    throw error; // Throw the error for the caller to handle
  }
};
