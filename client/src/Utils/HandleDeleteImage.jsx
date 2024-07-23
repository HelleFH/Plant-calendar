import axiosInstance from '../components/axiosInstance';

const handleDeleteImage = async (cloudinaryUrl) => {
  try {
    const cloudinaryPublicId = cloudinaryUrl.split('/').pop().split('.')[0];
    
    await axiosInstance.post('/delete-image', { public_id: cloudinaryPublicId });
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

export default handleDeleteImage;
