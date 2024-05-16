const handleSubmitUpdate = async (id, formData, entry, setFile, setPreviewSrc, navigate) => {
    try {
      let uploadResponse; 
  
      if (formData.get('file')) {
        // If there's a new file, upload it first
        uploadResponse = await axios.post(`${API_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Update entry data with new cloudinaryUrl
        entry.cloudinaryUrl = uploadResponse.data.cloudinaryUrl;
      }
  
      // Prepare data for updating the entry
      const data = {
        name: entry.name,
        notes: entry.notes,
        sunlight: entry.sunlight,
        watering: entry.watering,
        cloudinaryUrl: entry.cloudinaryUrl,
        // Add other fields as needed
      };
  
      // Send PUT request to update the entry
      await axios.put(`${API_URL}/entries/${id}`, data);
  
      // Navigate to home page after successful update
      navigate('/');
    } catch (error) {
      console.error('Error updating entry:', error);
      // Handle error gracefully
    }
  };
  