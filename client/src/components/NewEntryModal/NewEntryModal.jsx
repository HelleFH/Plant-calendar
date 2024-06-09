import axiosInstance from '../axiosInstance';
import React, { useEffect, useState } from 'react';
import CreateEntryWithFileUpload from '../CreateEntry/createEntry';
import CustomModal from '../CustomModal/CustomModal';
import CreateFollowUpEntry from '../FollowUpEntry/CreateFollowUpEntry';
import styles from './NewEntryModal.module.scss';

const NewEntryModal = ({ isOpen, onClose, selectedDate, setRefresh }) => {
  const [entries, setEntries] = useState([]);
  const [isCreateEntryModalOpen, setIsCreateEntryModalOpen] = useState(false);
  const [isCreateFollowUpModalOpen, setIsCreateFollowUpModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState('');
  const [selectedEntryDetails, setSelectedEntryDetails] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const userID = localStorage.getItem('userId');
        if (!userID) {
          throw new Error('No user ID found in local storage');
        }

        const response = await axiosInstance.get(`/entries/sorted/userID/${userID}?sortBy=name`);
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, []);

  

  const handleAddEntryClick = () => {
    setIsCreateEntryModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateEntryModalOpen(false);
  };

  const handleCloseFollowUpModal = () => {
    setIsCreateFollowUpModalOpen(false);
    setRefresh((prev) => !prev);

  };

  const handleChange = (e) => {
    const { value } = e.target;
    setSelectedEntry(value);
    const entryDetails = entries.find((entry) => entry.name === value);
    setSelectedEntryDetails(entryDetails);
    setIsCreateFollowUpModalOpen(true); // Open the follow-up modal when a name is selected
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Choose an option">
      <div className="flex-center">
        <button className="primary-button margin-bottom" onClick={handleAddEntryClick}>
          + Add New Entry
        </button>
        <div className="flex-center">
          <p className="margin-bottom">Or add an update for one of your plants:</p>
          <select className="margin-bottom" value={selectedEntry} onChange={handleChange}>
            <option value="">Select Entry</option>
            {entries.map((entry) => (
              <option key={entry._id} value={entry.name}>
                {entry.name}
              </option>
            ))}
          </select>
        </div>
        <CreateEntryWithFileUpload
          isOpen={isCreateEntryModalOpen}
          onClose={handleCloseModal}
          selectedDate={selectedDate}
          setRefresh={setRefresh} 
        />
      </div>
      {isCreateFollowUpModalOpen && selectedEntryDetails && (
        <CreateFollowUpEntry
          isOpen={isCreateFollowUpModalOpen}
          onClose={handleCloseFollowUpModal}
          oldEntryID={selectedEntryDetails._id}
          name={selectedEntryDetails.name}
          sunlight={selectedEntryDetails.sunlight}
          water={selectedEntryDetails.water}
          selectedDate={selectedDate}
          oldEntryName={selectedEntryDetails.name}
        />
      )}
    </CustomModal>
  );
};

export default NewEntryModal;