import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import useEntries from '../components/useEntries';
import useReminders from '../components/useReminders';
import CalendarEntry from '../components/CalendarEntry';
import CalendarReminder from '../components/CalendarReminder';
import CreateEntryWithFileUpload from '../components/createEntry';
import Slider from '../components/Slider';

const CalendarComponent = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreateEntryModalOpen, setIsCreateEntryModalOpen] = useState(false); // State for modal visibility

  const { entries, highlightedDates, error: entriesError, setEntries } = useEntries(selectedDate);
  const { reminders, highlightedReminderDates, error: remindersError, setReminders } = useReminders(selectedDate);

  useEffect(() => {
    const token = localStorage.getItem('auth');
    setLoggedIn(!!token);
  }, []);

  const tileClassName = ({ date }) => {
    const formattedDate = date.toDateString();
    let className = '';
    if (highlightedDates.includes(formattedDate)) {
      className += ' highlighted';
    }
    if (highlightedReminderDates.includes(formattedDate)) {
      className += ' highlighted-reminder';
    }
    return className;
  };

  const handleDateChange = (date) => {
    setSelectedDate(selectedDate && selectedDate.getTime() === date.getTime() ? null : date);
  };

  const handleAddEntryClick = () => {
    setIsCreateEntryModalOpen(true); // Open the modal when Add Entry button is clicked
  };

  const handleUpdateEntry = (updatedEntry) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) => (entry._id === updatedEntry._id ? updatedEntry : entry))
    );
  };

  const handleDeleteEntrySuccess = (deletedEntryId) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== deletedEntryId));
  };

  const handleDeleteReminderSuccess = (deletedReminderId) => {
    setReminders((prevReminders) => prevReminders.filter((reminder) => reminder._id !== deletedReminderId));
  };

  const handleCloseModal = () => {
    setIsCreateEntryModalOpen(false); // Close the modal
  };

  return (
    <div>
      {loggedIn ? (
        <div className='calendar-container'>
          <h1>Calendar</h1>
          <Slider id={1} />
          <Calendar value={selectedDate} onChange={handleDateChange} tileClassName={tileClassName} />
          <div>
            {selectedDate && (
              <>
                <p>Selected Date: {selectedDate.toDateString()}</p>
                {entriesError && <p>Error: {entriesError}</p>}
                {remindersError && <p>Error: {remindersError}</p>}
                {entries.length > 0 ? (
                  <ul>
                    {entries.map((entry, index) => (
                      <CalendarEntry
                        key={index}
                        entry={entry}
                        onUpdateEntry={handleUpdateEntry}
                        onDeleteEntry={handleDeleteEntrySuccess}
                        selectedDate={selectedDate}
                      />
                    ))}
                  </ul>
                ) : (
                  <p>No entries found for the selected date.</p>
                )}
                {reminders.length > 0 ? (
                  <ul>
                    {reminders.map((reminder, index) => (
                      <CalendarReminder
                        key={index}
                        reminder={reminder}
                        onDeleteReminder={handleDeleteReminderSuccess}
                        selectedDate={selectedDate}
                        onSelectDate={handleDateChange}
                      />
                    ))}
                  </ul>
                ) : (
                  <p>No reminders found for the selected date.</p>
                )}
              </>
            )}
            <button onClick={handleAddEntryClick}>Add Entry</button>
            {/* Render the modal with the appropriate props */}
            <CreateEntryWithFileUpload isOpen={isCreateEntryModalOpen} onClose={handleCloseModal} selectedDate={selectedDate} />
          </div>
        </div>
      ) : (
        <p>Please log in to view the calendar.</p>
      )}
    </div>
  );
};

export default CalendarComponent;
