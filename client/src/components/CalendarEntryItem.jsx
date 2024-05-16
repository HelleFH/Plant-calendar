import React from 'react';

const CalendarEntryItem = ({ entry, handleEditEntry, handleDeleteEntry }) => {
  return (
    <li>
      <p>Name: {entry.name}</p>
      <p>Notes: {entry.notes}</p>
      <p>Sunlight: {entry.sunlight}</p>
      <p>Watering: {entry.watering}</p>
      {entry.cloudinaryUrl && <img src={entry.cloudinaryUrl} alt={entry.name} />}
      <button onClick={() => handleEditEntry(entry)}>Edit Entry</button>
      <button onClick={() => handleDeleteEntry(entry._id)}>Delete Entry</button>
    </li>
  );
};

export default CalendarEntryItem;
