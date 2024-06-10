import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import useEntries from '../../components/useEntries';
import useReminders from '../../components/useReminders';
import CalendarEntry from '../../components/CalendarEntry/CalendarEntry';
import CalendarReminder from '../../components/CalendarReminder/CalendarReminder';
import styles from './CalendarView.module.scss';
import Navbar from '../../components/Navbar/Navbar';
import useFollowUpEntries from '../../components/useFollowUpEntries';
import FollowUpEntry from '../../components/FollowUpEntry/FollowUpEntry';
import NewEntryModal from '../../components/NewEntryModal/NewEntryModal';
import axiosInstance from '../../components/axiosInstance';

const CalendarComponent = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { entries, highlightedDates, error: entriesError, setEntries } = useEntries(selectedDate, refresh);
  const { followUpEntries, highlightedFollowUpDates, error: followUpEntriesError, setFollowUpEntries } = useFollowUpEntries(selectedDate, refresh);
  const { reminders, highlightedReminderDates, error: remindersError, setReminders } = useReminders(selectedDate, refresh);

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

  const handleDeleteEntry = async (deletedEntryId) => {
    try {
      await axiosInstance.delete(`entries/${deletedEntryId}`);
      setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== deletedEntryId));
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleDeleteReminder = async (deletedReminderId) => {
    try {
      await axiosInstance.delete(`reminders/${deletedReminderId}`);
      setReminders((prevReminders) => prevReminders.filter((reminder) => reminder._id !== deletedReminderId));
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const handleDeleteFollowUp = async (deletedFollowUpId) => {
    try {
      await axiosInstance.delete(`/entries/follow-up/${deletedFollowUpId}`);
      setFollowUpEntries((prevFollowUpEntries) => prevFollowUpEntries.filter((entry) => entry._id !== deletedFollowUpId));
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error('Error deleting follow-up:', error);
    }
  };

  const handleSelectDate = (date) => {
    console.log('Date selected:', date);
    setSelectedDate(date);
  };

  const handleDateChange = (date) => {
    if (!date) {
      setSelectedDate(null);
      return;
    }
    const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    setSelectedDate(newDate);
  };

  const handleNewEntryClick = () => {
    setIsNewEntryModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsNewEntryModalOpen(false);
    setRefresh((prev) => !prev); // Trigger refresh when modal is closed
  };

  const onUpdateEntry = (updatedEntry) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) => (entry._id === updatedEntry._id ? updatedEntry : entry))
    );
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
                <h4 className={styles.selectedDate}>{selectedDate.toDateString()}</h4>
                <button className={`primary-button ${styles.addEntryButton}`} onClick={handleNewEntryClick}>+ Add Entry</button>
              </div>
            )}
          </div>
          {entriesError && <p>Error: {entriesError}</p>}
          {remindersError && <p>Error: {remindersError}</p>}
          {followUpEntriesError && <p>Error: {followUpEntriesError}</p>}
          <NewEntryModal 
            isOpen={isNewEntryModalOpen} 
            setRefresh={setRefresh} 
            onClose={handleCloseModal} 
            selectedDate={selectedDate} 
            refresh={refresh} // Pass refresh to ensure proper fetching
          />
          {selectedDate && <h4>Entries for {selectedDate.toDateString()}</h4>}
          <div className={styles.ListsContainer}>
            <div className={styles.EntryListContainer}>
              {entries.length > 0 && (
                <ul className={styles.EntryList}>
                  {entries.map((entry) => (
                    <CalendarEntry
                      key={entry._id}
                      entry={entry}
                      setEntries={setEntries}
                      onUpdateEntry={onUpdateEntry}
                      onDeleteEntry={handleDeleteEntry}
                      onDeleteFollowUp={handleDeleteFollowUp}
                      selectedDate={selectedDate}
                      setRefresh={setRefresh}
                    />
                  ))}
                </ul>
              )}
            </div>
            <div className={styles.FollowUpListContainer}>
              {followUpEntries.length > 0 && (
                <ul className={styles.EntryList}>
                  {followUpEntries.map((followUpEntry, index) => (
                    <FollowUpEntry
                      key={index}
                      entry={followUpEntry}
                      selectedDate={selectedDate}
                      onUpdateEntry={onUpdateEntry}
                      onDeleteFollowUp={handleDeleteFollowUp}
                      setRefresh={setRefresh}
                    />
                  ))}
                </ul>
              )}
            </div>
            <div className={styles.ReminderListContainer}>
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
                      onDeleteReminder={handleDeleteReminder}
                      setRefresh={setRefresh}
                    />
                  ))}
                  <div className={styles.lineContainer}>
                    <hr className="long-line" />
                  </div>
                </ul>
              )}
            </div>
          </div>
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