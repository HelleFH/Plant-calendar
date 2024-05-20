import React, { useState } from 'react';

const SetCalendarReminder = ({ date }) => {
  const [reminderDate, setReminderDate] = useState(date || ''); // Initialize with date or empty string
  const [reminderTime, setReminderTime] = useState('');
  const [reminderDescription, setReminderDescription] = useState('');

  const handleAddReminder = () => {
    // Add reminder logic here
    console.log('Reminder added:', { reminderDate, reminderTime, reminderDescription });
  };

  return (
    <div>
      <h2>Set Reminder</h2>
      <div>
        <input type="date" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} />
        <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} />
        <input
          type="text"
          placeholder="Description"
          value={reminderDescription}
          onChange={(e) => setReminderDescription(e.target.value)}
        />
        <button onClick={handleAddReminder}>Add Reminder</button>
      </div>
    </div>
  );
};

export default SetCalendarReminder;
