import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import useEntries from '../../components/useEntries';
import useReminders from '../../components/useReminders';
import CalendarEntry from '../../components/CalendarEntryComponent/CalendarEntry';
import CalendarReminder from '../../components/CalendarReminder/CalendarReminder';
import CreateEntryWithFileUpload from '../../components/CreateEntryComponent/createEntry';
import styles from './CalendarView.module.scss';
import Navbar from '../../components/Navbar/Navbar';
import useFollowUpEntries from '../../components/useFollowUpEntries';
import FollowUpEntry from '../../components/FollowUpEntry/FollowUpEntry';

const CalendarComponent = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreateEntryModalOpen, setIsCreateEntryModalOpen] = useState(false);
  const { entries, highlightedDates, error: entriesError, setEntries } = useEntries(selectedDate);
  const { followUpEntries, highlightedFollowUpDates, error: followUpEntriesError, setFollowUpEntries } = useFollowUpEntries(selectedDate);
  const { reminders, highlightedReminderDates, error: remindersError, setReminders } = useReminders(selectedDate);

  useEffect(() => {
    const token = localStorage.getItem('auth');
    setLoggedIn(!!token);
  }, []);

  const tileClassName = ({ date }) => {
    const formattedDate = date.toDateString();
    let className = '';

    if (highlightedDates && highlightedDates.includes(formattedDate)) {
      className += ' highlighted';
    }
    if (highlightedReminderDates && highlightedReminderDates.includes(formattedDate)) {
      className += ' highlightedReminder';
    }
    if (highlightedFollowUpDates && highlightedFollowUpDates.includes(formattedDate)) {
      className += ' highlightedFollowUp';
    }
    return className;
  };

  const handleSelectDate = (date) => {
    console.log('Date selected:', date);
    setSelectedDate(date);
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

  const onUpdateEntry = (updatedEntry) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) => (entry._id === updatedEntry._id ? updatedEntry : entry))
    );
  };

  const onDeleteEntry = (entryId) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== entryId));
  };

  return (
    <div>
      <Navbar />

      {loggedIn ? (
        <div className={styles.calendarContainer}>
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
          {followUpEntriesError && <p>Error: {followUpEntriesError}</p>}
          <h4>Entries</h4>

          {entries.length > 0 && (
            <ul className={styles.entryListContainer}>
              {entries.map((entry, index) => (
                <CalendarEntry
                  className={styles.calendarEntry}
                  key={index}
                  entry={entry}
                  selectedDate={selectedDate}
                  onUpdateEntry={onUpdateEntry}
                  onDeleteEntry={onDeleteEntry}
                />
              ))}
            </ul>
          )}

          {followUpEntries.length > 0 && (
            <ul className={styles.entryListContainer}>
              {followUpEntries.map((followUpEntry, index) => (
                <FollowUpEntry
                  key={index}
                  entry={followUpEntry}
                  selectedDate={selectedDate}
                  onUpdateEntry={onUpdateEntry}
                  onDeleteEntry={onDeleteEntry}
                />
              ))}
            </ul>
          )}

          {reminders.length > 0 && (
            <ul className={styles.reminderList}>
              <h4>Reminders</h4>
              {reminders.map((reminder, index) => (
                <CalendarReminder
                  className={styles.calendarReminder}
                  key={index}
                  reminder={reminder}
                  selectedDate={selectedDate}
                  setReminders={setReminders}
                  onSelectDate={handleSelectDate}
                />
              ))}
              <div className={styles.lineContainer}>
                <hr className="long-line" />
              </div>
            </ul>
          )}

          <CreateEntryWithFileUpload
            setFollowUpEntries={setFollowUpEntries}
            isOpen={isCreateEntryModalOpen}
            onClose={handleCloseModal}
            selectedDate={selectedDate}
          />
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