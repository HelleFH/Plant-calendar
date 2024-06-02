import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './SetReminderComponent.module.scss';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import CustomModal from '../CustomModal/CustomModal';

const SetCalendarReminder = ({ isOpen, onClose, entryId }) => {
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderDescription, setReminderDescription] = useState('');
  const [username, setUsername] = useState('');
  const [entryDetails, setEntryDetails] = useState(null); // State to store entry details

  // Retrieve username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Fetch entry details when entryId changes
  useEffect(() => {
    const fetchEntryDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/entries/${entryId}`);
        setEntryDetails(response.data); // Assuming the response contains entry details
      } catch (error) {
        console.error('Error fetching entry details:', error);
      }
    };

    if (entryId) {
      fetchEntryDetails();
    }
  }, [entryId]);

  const handleAddReminder = async () => {
    try {
      const reminderData = {
        date: reminderDate,
        time: reminderTime,
        description: reminderDescription,
        entryId,
        username, // Include the username
      };

      await axios.post('http://localhost:3001/api/v1/reminders', reminderData);

      console.log('Reminder added:', reminderData);
      onClose(); // Close the modal after setting the reminder
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Set Reminder">
     
        {entryDetails && (
          <div className={styles.entryDetails}>
                    <h4 className='margin-bottom'>Add Reminder for {entryDetails.name}</h4>

          </div>
        )}
        <div className={styles.ReminderForm}>
          <div>
            <label htmlFor="reminderDate">Date</label>
            <input
              type="date"
              id="reminderDate"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="reminderTime">Time</label>
            <input
              type="time"
              id="reminderTime"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="reminderDescription">Description</label>
            <input 
              type="text"
              id="reminderDescription"
              placeholder="Enter description"
              value={reminderDescription}
              onChange={(e) => setReminderDescription(e.target.value)}
            />
          </div>
        </div>
 
      <div className='margin-top flex-row-right'>
        <Link className="secondary" onClick={onClose}>
          Close
        </Link>
        <button  className="primary-button" onClick={handleAddReminder}>
          Add Reminder
        </button>
      </div>
      </CustomModal>  );
};

export default SetCalendarReminder;