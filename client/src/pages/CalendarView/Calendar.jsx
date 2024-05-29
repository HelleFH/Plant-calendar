import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import useEntries from '../../components/useEntries';
import useReminders from '../../components/useReminders';
import CalendarEntry from '../../components/CalendarEntryComponent/CalendarEntry';
import CalendarReminder from '../../components/CalendarReminder';
import CreateEntryWithFileUpload from '../../components/createEntry';
import Slider from '../../components/SliderComponent/Slider';
import styles from './CalendarView.module.scss';
import Navbar from '../../components/Navbar';


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
                <Navbar />

      {loggedIn ? (
        <div className='flex-center'>
          <div className={`flex-center width-100 ${styles.backgroundContainer}`}>
          <Slider id={1} />
          <Calendar value={selectedDate} onChange={handleDateChange} tileClassName={tileClassName} />

          {selectedDate && (
            <div className={styles.addEntryContainer}>
              <p className={styles.selectedDate}>{selectedDate.toDateString()}</p>
              <button className={`primary-button ${styles.addEntryButton}`} onClick={handleAddEntryClick}>Add Entry</button>
            </div>
          )}
          </div>
          {entriesError && <p>Error: {entriesError}</p>}
          {remindersError && <p>Error: {remindersError}</p>}

          {entries.length > 0 && (
            <ul>
              {entries.map((entry, index) => (
                <CalendarEntry
                  className={styles.calendarEntry}
                  key={index}
                  entry={entry}
                  onUpdateEntry={handleUpdateEntry}
                  onDeleteEntry={handleDeleteEntrySuccess}
                  selectedDate={selectedDate}
                />
              ))}
            </ul>
          )}

          {reminders.length > 0 && (
            <ul>
              {reminders.map((reminder, index) => (
                <CalendarReminder
                  className={styles.calendarReminder}
                  key={index}
                  reminder={reminder}
                  onDeleteReminder={handleDeleteReminderSuccess}
                  selectedDate={selectedDate}
                  onSelectDate={handleDateChange}
                />
              ))}
            </ul>
          )}

          <CreateEntryWithFileUpload isOpen={isCreateEntryModalOpen} onClose={handleCloseModal} selectedDate={selectedDate} />
        </div>
      ) : (
        <p>Please log in to view the calendar.</p>
      )}
    </div>
  );
};

export default CalendarComponent;