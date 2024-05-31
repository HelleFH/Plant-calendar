import React, { useState } from 'react';
import axios from 'axios';
import styles from './SearchAPIComponent.module.scss';
import { useNavigate, Link } from 'react-router-dom';


const SearchPlantAPI = ({ onSelectPlant, closeModal }) => {
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
    <div className='styles.searchModalContainer'>
      <span className={styles.searchModalClose} onClick={closeModal}>&times;</span>
      <h4 className="margin-top">Search for your plant in our Database!</h4>
      <div className={styles.searchModalContent}>
        <input className="margin-top" type="text" value={searchTerm} onChange={handleChange} />
        <div className='flex-row-right margin-top'>
          <Link onClick={closeModal}
          >Cancel</Link>
          <button onClick={handleSearch} className="secondary-button">Search</button>

        </div>
        <div className="search-results" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
          {searchResults.map(plant => (
            <div key={plant.id}>
              <h3>{plant.common_name}</h3>
              <h3>{plant.sunlight}</h3>
              <h3>{plant.watering}</h3>
              <button onClick={() => handleSelectPlant(plant)}>Select</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPlantAPI;
