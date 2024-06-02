import React, { useState } from 'react';
import axios from 'axios';
import styles from './SearchAPIComponent.module.scss';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import CustomModal from '../CustomModal/CustomModal';

Modal.setAppElement('#root'); // Ensure this line is included in your main application file

const SearchPlantAPI = ({ isOpen, onSelectPlant, closeModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://perenual.com/api/species-list?key=sk-ROtP661ef4d63344d5152&q=${encodeURIComponent(searchTerm)}`);
      setSearchResults(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    await fetchData();
  };

  const handleSelectPlant = (plant) => {
    onSelectPlant(plant.common_name, plant.sunlight, plant.watering);
  };

  return (
    <CustomModal isOpen={isOpen}       onRequestClose={closeModal}
    title="Search Database"       contentLabel="Search Plant Modal"
    >
       
        <h4 className="margin-bottom">Search for your plant in our Database!</h4>
        <input className="margin-bottom" type="text" value={searchTerm} onChange={handleChange} />
        <div className='flex-row-right margin-top'>
          <Link onClick={closeModal}>Cancel</Link>
          <button onClick={handleSearch} className="secondary-button">Search</button>
        </div>
        <div className={styles.searchResults} style={{ maxHeight: '100vh', overflowY: 'scroll' }}>
          {searchResults.map(plant => (
            <div key={plant.id} className={styles.searchResultItem}>
              {plant.default_image && plant.default_image.small_url && (
                <img src={plant.default_image.small_url} alt={plant.common_name} className={styles.plantImage} />
              )}
              <h3>{plant.common_name}</h3>
              <p>Sunlight: {plant.sunlight.join(', ')}</p>
              <p>Watering: {plant.watering}</p>
              <button onClick={() => handleSelectPlant(plant)}>Select</button>
            </div>
          ))}
        </div>
    </CustomModal>
  );
};

export default SearchPlantAPI;
