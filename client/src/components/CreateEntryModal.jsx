import axiosInstance from './axiosInstance';
import React, { useEffect, useState } from 'react';
import CreateEntryWithFileUpload from './CreateEntryComponent/createEntry';
import CustomModal from './CustomModal/CustomModal';
import CreateFollowUpEntry from './FollowUpEntry/CreateFollowUpEntry';
import { Link } from 'react-router-dom';

const NewEntryModal = ({ isOpen, onClose, selectedDate }) => {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isCreateEntryModalOpen, setIsCreateEntryModalOpen] = useState(false);
  const [isCreateFollowUpModalOpen, setIsCreateFollowUpModalOpen] = useState(false);
  const [selectedEntryDetails, setSelectedEntryDetails] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const userID = localStorage.getItem('userId');
        if (!userID) {
          throw new Error('No user ID found in local storage');
        }

        console.log("Fetched userID from localStorage: ", userID); // Debugging log

        const response = await axiosInstance.get(`/entries/userID/${userID}?sortBy=name`);
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, []);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleAddEntryClick = () => {
    setIsCreateEntryModalOpen(true);
  };

  const handleAddFollowUpClick = () => {
    setIsCreateFollowUpModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateEntryModalOpen(false);
  };

  const handleCloseFollowUpModal = () => {
    setIsCreateFollowUpModalOpen(false);
  };

  const handleChange = (e) => {
    const selectedName = e.target.value;
    const entryDetails = entries.find(entry => entry.name === selectedName);
    if (entryDetails) {
      setSelectedEntryDetails(entryDetails);
      setSelectedEntry(selectedName);
      setIsCreateFollowUpModalOpen(true); // Open the follow-up modal when a name is selected
    } else {
      setSelectedEntry(null);
      setSelectedEntryDetails(null);
    }
    console.log('Selected entry details:', entryDetails); // Log the selected entry details
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="New Entry">
      <div>
        <label>Select an entry:</label>
        <select value={selectedEntry} onChange={handleChange}>
          <option value="">Select</option>
          {entries.map((entry) => (
            <option key={entry._id} value={entry.name}>{entry.name}</option>
          ))}
        </select>
      </div>
      <button className="primary-button" onClick={handleAddEntryClick}>Add Entry</button>
      <Link onClick={handleAddFollowUpClick}>
        + Add Entry
      </Link>

      <CreateEntryWithFileUpload
        isOpen={isCreateEntryModalOpen}
        onClose={handleCloseModal}
        selectedDate={formatDate(selectedDate)}
      />

      {isCreateFollowUpModalOpen && selectedEntryDetails && (
        <CreateFollowUpEntry
          isOpen={isCreateFollowUpModalOpen}
          onClose={handleCloseFollowUpModal}
          oldEntryID={selectedEntryDetails._id}
          name={selectedEntryDetails.name}
          sunlight={selectedEntryDetails.sunlight}
          water={selectedEntryDetails.water}
          selectedDate={formatDate(selectedDate)}
        />
      )}
    </CustomModal>
  );
};

export default NewEntryModal;