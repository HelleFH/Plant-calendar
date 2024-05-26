import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const SetCalendarReminder = ({ isOpen, onClose, entryId }) => {
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderDescription, setReminderDescription] = useState('');
  const [username, setUsername] = useState('');

  // Retrieve username from localStorage
  useState(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

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
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Reminder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="reminderDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="reminderTime">
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="reminderDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              value={reminderDescription}
              onChange={(e) => setReminderDescription(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAddReminder}>
          Add Reminder
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SetCalendarReminder;