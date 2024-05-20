import React, { useState } from 'react';
import SetCalendarReminder from './SetCalendarReminder';

const ReminderModal = ({ isOpen, onClose }) => {
  return (
    <div className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        <SetCalendarReminder />
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
    </div>
  );
};

const CalendarEntryItem = ({ entry, handleEditEntry, handleDeleteEntry }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <li>
      <p>Name: {entry.name}</p>
      <p>Notes: {entry.notes}</p>
      <p>Sunlight: {entry.sunlight}</p>
      <p>Watering: {entry.watering}</p>
      {entry.cloudinaryUrl && <img src={entry.cloudinaryUrl} alt={entry.name} />}
      <button onClick={() => handleEditEntry(entry)}>Edit Entry</button>
      <button onClick={() => handleDeleteEntry(entry._id)}>Delete Entry</button>
      <button onClick={toggleModal}>Set Reminder</button>
      <ReminderModal isOpen={isModalOpen} onClose={toggleModal} />
    </li>
  );
};

export default CalendarEntryItem;
