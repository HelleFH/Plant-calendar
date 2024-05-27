import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment'; // Import moment.js for date formatting
import DeleteConfirmationModal from './DeleteConfirmationModal';
import handleDeleteReminder from './HandleDeleteReminder';

const CalendarReminder = ({
  reminder,
  onDeleteReminder,
  onSelectDate, // Add onSelectDate prop
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [entryDetails, setEntryDetails] = useState(null);

  useEffect(() => {
    const fetchEntryDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/entries/${reminder.entryId}`);
        setEntryDetails(response.data); // Assuming the response contains entry details
      } catch (error) {
        console.error('Error fetching entry details:', error);
      }
    };

    if (reminder.entryId) {
      fetchEntryDetails();
    }
  }, [reminder.entryId]);

  // Function to format the date using moment.js
  const formatDate = (date) => {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
  };

  const handleGoToDate = () => {
    // Call onSelectDate if it exists
    if (onSelectDate && reminder && reminder.date) {
      onSelectDate(new Date(entryDetails.date)); // Navigate to the date of the original entry
    }
  };

  return (
    <li>
      <p>Description: {reminder.description}</p>
      <p>ID: {reminder.entryId}</p>
      {entryDetails && (
        <>
          <p>Name: {entryDetails.name}</p>
          <p>Date: {formatDate(entryDetails.date)}</p> {/* Format the date */}
          <button onClick={handleGoToDate}>Go to Date</button>
        </>
      )}

      <button onClick={() => {
        setIdToDelete(reminder._id);
        setShowDeleteModal(true);
      }}>
        Delete Reminder
      </button>

      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            await handleDeleteReminder(idToDelete, onDeleteReminder);
            setShowDeleteModal(false);
          }}
        />
      )}
    </li>
  );
};

export default CalendarReminder;  