import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import handleDeleteReminder from '../../Utils/HandleDeleteReminder';
import styles from './CalendarReminder.module.scss';
import ViewEntryModal from '../ViewEntryModal/ViewEntryModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';


const CalendarReminder = ({
  reminder,
  setReminders,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [entryDetails, setEntryDetails] = useState(null);
  const [isViewEntryModalOpen, setIsViewEntryModalOpen] = useState(false);

  useEffect(() => {
    const fetchEntryDetails = async () => {
      try {
        const response = await axiosInstance.get(`/entries/${reminder.entryID}`);
        setEntryDetails(response.data);
      } catch (error) {
        console.error('Error fetching entry details:', error);
      }
    };

    if (reminder.entryID) {
      fetchEntryDetails();
    }
  }, [reminder.entryID]);


  const handleDeleteReminderSuccess = (deletedReminderID) => {
    setReminders((prevReminders) => prevReminders.filter((reminder) => reminder._id !== deletedReminderID));
  };

  const handleViewEntryClick = () => {
    setIsViewEntryModalOpen(true);
  };

  const handleCloseViewEntryModal = () => {
    setIsViewEntryModalOpen(false);
  };

  const handleDeleteModalOpen = () => {
    setIdToDelete(reminder._id);
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };

  return (
    <li className={styles.ReminderItem}>
      <i className="fas fa-xs fa-bell margin-bottom"></i>
      {entryDetails && (
        <>
          <h3>{entryDetails.name}</h3>
          <FontAwesomeIcon
            onClick={handleViewEntryClick}
            icon={faEllipsisH}
            className={styles.iconLink}
            style={{ cursor: 'pointer' }}
          />
          <p>{reminder.description}</p>
        </>
      )}

      <div onClick={handleDeleteModalOpen}>
        <i className="fas fa-trash" style={{ cursor: 'pointer', marginLeft: '10px' }}></i>
      </div>

      <ViewEntryModal
        isOpen={isViewEntryModalOpen}
        onClose={handleCloseViewEntryModal}
        entryID={reminder.entryID} // Pass entryID to fetch specific details
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onCancel={handleDeleteModalClose}
        onConfirm={async () => {
          await handleDeleteReminder(idToDelete, handleDeleteReminderSuccess);
          handleDeleteModalClose();
        }}
      />
    </li>
  );
};

export default CalendarReminder;