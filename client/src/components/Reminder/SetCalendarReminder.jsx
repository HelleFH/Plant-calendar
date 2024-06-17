import React, { useState } from 'react';
import styles from './SetReminder.module.scss';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import CustomModal from '../CustomModal/CustomModal';
import axiosInstance from '../axiosInstance';

const NewReminder = ({ isOpen, onClose, entryID, handleAddReminder, name }) => {
  const initialReminderState = {
    date: '',
    time: '',
    description: '',
  };
  const [reminder, setReminder] = useState(initialReminderState);

  const createReminder = async () => {
    try {
      const formData = {
        name,
        date: reminder.date,
        time: reminder.time,
        description: reminder.description,
        userID: localStorage.getItem('userId'),
        entryID,
      };

      const response = await axiosInstance.post('/reminders', formData);

      console.log('Reminder added:', response.data);
      const newReminder = response.data;
      handleAddReminder(newReminder, reminder.date);

      onClose();
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

  const handleEntrySubmit = async (e) => {
    e.preventDefault();
    await createReminder();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReminder({
      ...reminder,
      [name]: value,
    });
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Set Reminder">
      <Form onSubmit={handleEntrySubmit}>
        <div className={styles.entryDetails}>
          <h4 className='margin-bottom'>Add Reminder for {name}</h4>
        </div>
        <div className={styles.ReminderForm}>
          <div>
            <label htmlFor="reminderDate">Date</label>
            <input
              type="date"
              id="reminderDate"
              name="date"
              value={reminder.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="reminderTime">Time</label>
            <input
              type="time"
              id="reminderTime"
              name="time"
              value={reminder.time}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="reminderDescription">Description</label>
            <input
              type="text"
              id="reminderDescription"
              name="description"
              placeholder="Enter description"
              value={reminder.description}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className='margin-top flex-row-right'>
          <Link className="secondary" onClick={onClose}>
            Close
          </Link>
          <button className="primary-button" type="submit">
            Add Reminder
          </button>
        </div>
      </Form>
    </CustomModal>
  );
};

export default NewReminder;