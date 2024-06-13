import axiosInstance from '../axiosInstance';
import React, { useEffect, useState } from 'react';
import moment from 'moment'; // Import moment to format dates
import CreateEntryWithFileUpload from '../CreateEntry/createEntry';
import CustomModal from '../CustomModal/CustomModal';
import CreateFollowUpEntry from '../FollowUpEntry/CreateFollowUpEntry';

const NewEntryModal = ({ isOpen, onClose, selectedDate, setRefresh, refresh }) => {
  const [entries, setEntries] = useState([]);
  const [isCreateEntryModalOpen, setIsCreateEntryModalOpen] = useState(false);
  const [isCreateFollowUpModalOpen, setIsCreateFollowUpModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState('');
  const [selectedEntryDetails, setSelectedEntryDetails] = useState(null);
  const [followUpEntries, setFollowUpEntries] = useState([]);

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
  }, [refresh]); // Ensure entries are fetched on refresh

  const handleAddEntryClick = () => {
    setIsCreateEntryModalOpen(true);
  };

  const handleAddFollowUpEntry = (newFollowUpEntry) => {
    setFollowUpEntries((prevFollowUpEntries) => [...prevFollowUpEntries, newFollowUpEntry]);
  };

  const handleCloseEntryModal = () => {
    setIsCreateEntryModalOpen(false);
    setRefresh((prev) => !prev); // Trigger refresh when modal closes
    onClose();
  };

  const handleCloseFollowUpModal = () => {
    setIsCreateFollowUpModalOpen(false);
    setRefresh((prev) => !prev); // Trigger refresh when modal closes
    onClose();
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
          <p className="margin-bottom">Selected Date: {moment(selectedDate).format('MMMM Do YYYY')}</p>
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
          onClose={handleCloseEntryModal}
          selectedDate={selectedDate}
          setRefresh={setRefresh} 
        />
      </div>
      {isCreateFollowUpModalOpen && selectedEntryDetails && (
        <CreateFollowUpEntry
          handleAddFollowUpEntry={handleAddFollowUpEntry}
          isOpen={isCreateFollowUpModalOpen}
          onClose={handleCloseFollowUpModal}
          oldEntryID={selectedEntryDetails._id}
          name={selectedEntryDetails.name}
          sunlight={selectedEntryDetails.sunlight}
          water={selectedEntryDetails.water}
          selectedDate={selectedDate}
          oldEntryName={selectedEntryDetails.name}
          setRefresh={setRefresh} 
        />
      )}
    </CustomModal>
  );
};

export default NewEntryModal;