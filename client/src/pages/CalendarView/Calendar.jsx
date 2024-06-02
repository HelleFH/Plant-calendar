import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import useEntries from '../../components/useEntries';
import useReminders from '../../components/useReminders'; // Import useReminders
import CalendarEntry from '../../components/CalendarEntryComponent/CalendarEntry';
import CalendarReminder from '../../components/CalendarReminder/CalendarReminder'; // Import CalendarReminder
import CreateEntryWithFileUpload from '../../components/CreateEntryComponent/createEntry';
import styles from './CalendarView.module.scss';
import Navbar from '../../components/Navbar/Navbar';

const CalendarComponent = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreateEntryModalOpen, setIsCreateEntryModalOpen] = useState(false);

  const { entries, highlightedDates, error: entriesError, setEntries } = useEntries(selectedDate);
  const { reminders, highlightedReminderDates, error: remindersError, setReminders } = useReminders(selectedDate); // Use useReminders

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
      className += ' highlightedReminder';
    }
    return className;
  };

  const handleDateChange = (date) => {
    setSelectedDate(selectedDate && selectedDate.getTime() === date.getTime() ? null : date);
  };

  const handleAddEntryClick = () => {
    setIsCreateEntryModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateEntryModalOpen(false);
  };

  return (
    <div>
      <Navbar />

      {loggedIn ? (
        <div className='flex-center'>
          <div className={styles.backgroundContainer}>
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
                  selectedDate={selectedDate}
                />
              ))}
            </ul>
          )}

          {reminders.length > 0 && (
            <ul className={styles.reminderList}>
              {reminders.map((reminder, index) => (
                <CalendarReminder
                  className={styles.calendarReminder}
                  key={index}
                  reminder={reminder}
                  selectedDate={selectedDate}
                  setReminders={setReminders} // Pass setReminders to update reminders state
                />
              ))}
              <div className={styles.lineContainer}>
                <hr className="long-line" />
              </div>
            </ul>
          )}

          <CreateEntryWithFileUpload isOpen={isCreateEntryModalOpen} onClose={handleCloseModal} selectedDate={selectedDate} />
        </div>
      ) : (
        <div className='flex-center margin-top'>
          <p className="margin-bottom">Please log in to view the calendar.</p>
          <a href="/login">
            <button className='secondary-button'>Login</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;