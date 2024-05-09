import React, { useState } from 'react';
import axios from 'axios';

export default function SearchPlantAPI({ onSelectPlant, setShowModal, savePlantName }) {
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
    setShowModal(true);
  };

  const handleSelectPlant = (plant) => {
    onSelectPlant(plant);
    savePlantName(plant.common_name, plant.sunlight, plant.watering); // Pass the selected plant name, sunlight, and watering to the function in CreateEntryWithFileUpload
    setShowModal(false);
  };

  const handleModalContentClick = (event) => {
    event.stopPropagation(); // Prevent the modal from closing when clicking inside it
  };

  return (
    <div className="modal" onClick={() => setShowModal(false)}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
        <input type="text" value={searchTerm} onChange={handleChange} />
        <button onClick={handleSearch}>Search</button>
        <div className="search-results" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
          {searchResults.map(plant => (
            <div key={plant.id}>
              <h3>{plant.common_name}</h3>
              <h3>{plant.sunlight}</h3>
              <h3>{plant.watering}</h3>


              <button onClick={() => handleSelectPlant(plant)}>Select</button>
              {plant.default_image && (
                <img src={plant.default_image.thumbnail} alt={plant.common_name} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
