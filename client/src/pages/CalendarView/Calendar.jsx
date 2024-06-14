import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment'; // Import moment to format dates
import 'react-calendar/dist/Calendar.css';
import useEntries from '../../components/useEntries';
import useReminders from '../../components/useReminders';
import CalendarEntry from '../../components/Entry/CalendarEntry';
import CalendarReminder from '../../components/Reminder/CalendarReminder';
import styles from './CalendarView.module.scss';
import Navbar from '../../components/Navbar/Navbar';
import useFollowUpEntries from '../../components/useFollowUpEntries';
import FollowUpEntry from '../../components/FollowUpEntry/FollowUpEntry';
import NewEntryModal from '../../components/NewEntryModal/NewEntryModal';
import axiosInstance from '../../components/axiosInstance';
import Slider from '../../components/SliderComponent/Slider';
import handleDeleteEntry from '../../Utils/HandleDeleteEntry';

const CalendarComponent = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { entries, highlightedDates, error: entriesError, setEntries } = useEntries(selectedDate, refresh);
  const { followUpEntries, highlightedFollowUpDates, error: followUpEntriesError, setFollowUpEntries } = useFollowUpEntries(selectedDate, refresh);
  const { reminders, highlightedReminderDates, error: remindersError, setReminders } = useReminders(selectedDate, refresh);

  const userID = localStorage.getItem('userId');

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
      className += ' highlightedFollowUpLeaf highlightedFollowUpLeafPlus';
    }
    return className;
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
    setSelectedDate(date);
  };

  const handleNewEntryClick = () => {
    setIsNewEntryModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsNewEntryModalOpen(false);
    setRefresh((prev) => !prev);
  };

  const onUpdateEntry = (updatedEntry) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) => (entry._id === updatedEntry._id ? updatedEntry : entry))
    );
    setRefresh((prev) => !prev);
  };

  const onUpdateFollowUpEntry = (updatedFollowUpEntry) => {
    setFollowUpEntries((prevFollowUpEntries) =>
      prevFollowUpEntries.map((followUpEntry) => (followUpEntry._id === updatedFollowUpEntry._id ? updatedFollowUpEntry : followUpEntry))
    );
    setRefresh((prev) => !prev);
  };

  const handleUpdateFollowUpEntry = (updatedFollowUpEntry) => {
    setFollowUpEntries((prevFollowUpEntries) =>
      prevFollowUpEntries.map((followUpEntry) => (followUpEntry._id === updatedFollowUpEntry._id ? updatedFollowUpEntry : followUpEntry))
    );
    setRefresh((prev) => !prev);
  };

  const handleMonthChange = ({ activeStartDate }) => {
    setCurrentMonth(activeStartDate);
    const firstDayOfMonth = new Date(activeStartDate.getFullYear(), activeStartDate.getMonth(), 1);
    setSelectedDate(firstDayOfMonth);
    setRefresh((prev) => !prev); // Trigger refresh to fetch entries
  };

  useEffect(() => {
    localStorage.setItem('selectedDate', selectedDate.toISOString());
  }, [selectedDate]);

  return (
    <div>
      <Navbar />
      {loggedIn ? (
        <div className={styles.calendarContainer}>
          <div className={styles.backgroundContainer}>
            <Slider />
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              onActiveStartDateChange={handleMonthChange}
              tileClassName={tileClassName}
            />
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
            refresh={refresh}
          />
          {selectedDate && (entries.length > 0 || followUpEntries.length > 0 || reminders.length > 0) && (
            <h4>Entries for {selectedDate.toDateString()}</h4>
          )}
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
                      userID={userID}
                    />
                  ))}
                </ul>
              )}
            </div>
            <div className={styles.EntryContainer}>
              {followUpEntries.length > 0 && (
                <ul className={styles.calendarFollowUpList}>
                  {followUpEntries.map((followUpEntry) => (
                    <FollowUpEntry
                      key={followUpEntry._id}
                      followUpEntry={followUpEntry}
                      onDeleteFollowUp={handleDeleteFollowUp}
                      setRefresh={setRefresh}
                      onUpdateFollowUpEntry={onUpdateFollowUpEntry}
                      userID={userID}
                      setFollowUpEntries={setFollowUpEntries}
                      selectedDate={selectedDate}
                      handleUpdateFollowUpEntry={handleUpdateFollowUpEntry}
                      onSelectDate={handleSelectDate}
                    />
                  ))}
                </ul>
              )}
            </div>
            <div className={styles.ReminderListContainer}>
              {reminders.length > 0 && (
                <ul className={styles.EntryList}>
                  <h4 className='margin-top margin-bottom'>Reminders</h4>
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