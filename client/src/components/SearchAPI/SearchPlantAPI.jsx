import React, { useState } from 'react';
import axios from 'axios';
import styles from './SearchAPI.module.scss';
import CustomModal from '../CustomModal/CustomModal';
import { Link } from 'react-router-dom';


const SearchPlantAPI = ({ isOpen, onSelectPlant, closeModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResultsModal, setShowResultsModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://perenual.com/api/species-list?key=sk-ROtP661ef4d63344d5152&q=${encodeURIComponent(searchTerm)}`);
      setSearchResults(response.data.data);
      setShowResultsModal(true);
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

  const handleResultsModalClose = () => {
    setShowResultsModal(false);
  };

  return (
    <>
  <CustomModal
  isOpen={isOpen}
  onRequestClose={closeModal}
  onClose={closeModal} 
  title="Search Database"
  contentLabel="Search Plant Modal"
>
        <div className={styles.searchModal}>
          <h4>Search for your plant in our Database!</h4>
          <input type="text" value={searchTerm} onChange={handleChange} />
          <div className='flex-row-right'>
            <Link onClick={closeModal}>Cancel</Link>
            <button onClick={handleSearch} className="secondary-button">Search</button>
          </div>
        </div>
      </CustomModal>

      <CustomModal
  isOpen={showResultsModal}
  onRequestClose={handleResultsModalClose}
  onClose={handleResultsModalClose} 
  title="Search Results"
  contentLabel="Search Results Modal"
>
        <div className={styles.searchResults} style={{ maxHeight: '70vh', overflowY: 'scroll' }}>
          {searchResults.map(plant => (
            <div key={plant.id} className={styles.searchResultItem}>
              {plant.default_image && plant.default_image.small_url && (
                <img src={plant.default_image.small_url} alt={plant.common_name} className={styles.plantImage} />
              )}
              <h3>{plant.common_name}</h3>
              <span><h4>Sunlight: </h4>{Array.isArray(plant.sunlight) ? plant.sunlight.join(', ') : plant.sunlight}</span>
              <span><h4>Water:</h4> {plant.watering}</span>
              <button className={styles.selectButton} onClick={() => handleSelectPlant(plant)}>Select</button>
                <hr className="long-line"></hr>
            </div>
          ))}
        </div>
      </CustomModal>
    </>
  );
};

export default SearchPlantAPI;