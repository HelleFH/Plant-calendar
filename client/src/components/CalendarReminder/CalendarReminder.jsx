import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment'; // Import moment.js for date formatting
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import handleDeleteReminder from '../HandleDeleteReminder';
import { Link } from 'react-router-dom';
import styles from './CalendarReminderComponent.module.scss';



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
    return moment(date).format('MMMM Do');
  };

  const handleGoToDate = () => {
    // Call onSelectDate if it exists
    if (onSelectDate && reminder && reminder.date) {
      onSelectDate(new Date(entryDetails.date)); // Navigate to the date of the original entry
    }
  };

  return (
    
    <li className={styles.ReminderItem}>
      
      {entryDetails && (
        <>
          <p>Reminder for {entryDetails.name} (<Link onClick={handleGoToDate}>{formatDate(entryDetails.date)} </Link>
            ):<span>{reminder.description}</span>
          </p>

        </>
      )}

      <div onClick={() => {
        setIdToDelete(reminder._id);
        setShowDeleteModal(true);
      }}>
 <i
                      className="fas fa-trash"
                      onClick={() => handleDeleteReminder(reminder._id)}
                      style={{ cursor: 'pointer', marginLeft: '10px' }}
                    ></i>      </div>
                    

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