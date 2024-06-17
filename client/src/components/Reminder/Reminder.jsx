import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../axiosInstance';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import styles from './Reminder.module.scss';
import ViewEntryModal from '../ViewEntryModal/ViewEntryModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';

const Reminder = ({ reminder, onDeleteReminder, setRefresh }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [entryDetails, setEntryDetails] = useState(null);
  const [isViewEntryModalOpen, setIsViewEntryModalOpen] = useState(false);
  const [isTextOptionVisible, setIsTextOptionVisible] = useState(false);
  
  const ellipsisRef = useRef(null);

  useEffect(() => {
    const fetchEntryDetails = async () => {
      try {
        const response = await axiosInstance.get(`reminders/entry/${reminder.entryID}`);
        setEntryDetails(response.data);
      } catch (error) {
        console.error('Error fetching entry details:', error);
      }
    };

    if (reminder.entryID) {
      fetchEntryDetails();
    }

    // Add event listener when component mounts
    document.addEventListener('click', handleClickOutside);

    // Cleanup the event listener when component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [reminder.entryID]);

  const handleClickOutside = (event) => {
    if (ellipsisRef.current && !ellipsisRef.current.contains(event.target)) {
      setIsTextOptionVisible(false);
    }
  };

  const handleViewEntryClick = () => {
    setIsViewEntryModalOpen(true);
    setIsTextOptionVisible(false);
  };

  const handleCloseViewEntryModal = () => {
    setIsViewEntryModalOpen(false);
  };

  const toggleVisibility = () => {
    setIsTextOptionVisible(!isTextOptionVisible);
  };
  
  const handleConfirmDelete = async () => {
    await onDeleteReminder(idToDelete);
    setShowDeleteModal(false);
    setRefresh((prev) => !prev); // Trigger refresh
  };

  return (
    <li className={styles.ReminderItem}>
      <i className="fas fa-xs fa-bell"></i>
      {entryDetails && (
        <>
          <h4>{entryDetails.name}</h4>
          <FontAwesomeIcon
            onClick={toggleVisibility}
            icon={faEllipsisH}
            className={styles.iconLink}
            style={{ cursor: 'pointer' }}
            ref={ellipsisRef} // Assign ref to the ellipsis icon
          />
          {isTextOptionVisible && (
            <button onClick={handleViewEntryClick} className={styles.textButton}>
              View main entry
            </button>
          )}
          <p>{reminder.description}</p>
        </>
      )}

      <div>
        <i
          onClick={() => {
            setIdToDelete(reminder._id);
            setShowDeleteModal(true);
          }}
          className="fas fa-trash"
          style={{ cursor: 'pointer', marginLeft: '10px' }}
        ></i>
      </div>

      <ViewEntryModal
        isOpen={isViewEntryModalOpen}
        onClose={handleCloseViewEntryModal}
        entryID={reminder.entryID}
      />
      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={handleConfirmDelete}
          isOpen={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </li>
  );
};

export default Reminder;