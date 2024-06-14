import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import moment from 'moment';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import handleDeleteReminder from '../../Utils/HandleDeleteReminder';
import { Link } from 'react-router-dom';
import styles from './CalendarReminder.module.scss';
import ViewEntryModal from '../ViewEntryModal/ViewEntryModal';

const CalendarReminder = ({
  reminder,
  setReminders,
  onSelectDate,
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

  const formatDate = (date) => {
    return moment(date).format('MMMM Do');
  };

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
      {entryDetails ? (
        <>
          <i className="fas fa-xs fa-bell"></i>
          <h3 onClick={handleViewEntryClick}>{entryDetails.name}</h3>
          <p>{reminder.description}</p>
        </>
      ) : (
        <p>Loading...</p> // Display a loading state while fetching entry details
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