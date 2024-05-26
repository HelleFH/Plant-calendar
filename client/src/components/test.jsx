import React, { useState, useEffect } from 'react';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import handleDeleteReminder from './HandleDeleteReminder';
import SetCalendarReminder from './SetCalendarReminder';

const CalendarReminder = ({
  reminder,
  onDeleteReminder,
  selectedDate
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);


  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);



  const handleDelete = async () => {
    try {
      await handleDeleteReminder(idToDelete, onDeleteReminder);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  return (
    <li>
      <p>Description: {reminder.description}</p>
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
          onConfirm={handleDelete}
        />
      )}
    </li>
  );
};

export default CalendarReminder;