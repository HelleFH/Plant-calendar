import React, { useState, useEffect } from 'react';
import CustomModal from '../CustomModal/CustomModal';
import CalendarEntry from '../Entry/CalendarEntry'; // Adjust the path based on your actual structure
import styles from './ViewEntryModal.module.scss';
import axiosInstance from '../axiosInstance';

const ViewEntryModal = ({ isOpen, onClose, entryID }) => {
  const [entry, setEntry] = useState(null);
  const [setEntries] = useState([]);
  const [ setRefresh] = useState(false);


  const [isEntryExpanded, setIsEntryExpanded] = useState(true); // Initialize isExpanded as false

  console.log('entryID:', entryID);

  const toggleEntryExpand = () => {
    setIsEntryExpanded(!isEntryExpanded);
  };

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await axiosInstance.get(`/entries/by-follow-up/${entryID}`);
        setEntry(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching entry by follow-up entry ID:', error);
      }
    };

    if (entryID) {
      fetchEntry();
    }
  }, [entryID]);

  if (!isOpen) {
    return null;
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modalOverlay}
      contentLabel="View Entry"
      title="View Entry"
      onClose={onClose}
    >

      <div className={styles.modalContent}>
        {entry ? (
          <CalendarEntry  setRefresh={setRefresh} setEntries={setEntries} isModal={true} entry={entry} isEntryExpanded={isEntryExpanded} toggleEntryExpand={toggleEntryExpand} />
        ) : (
          <p>Loading entry...</p>
        )}
      </div>
    </CustomModal>
  );
};

export default ViewEntryModal;