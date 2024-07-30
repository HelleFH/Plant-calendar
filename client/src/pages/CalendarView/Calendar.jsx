import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import useEntries from '../../components/Entry/useEntries';
import useReminders from '../../components/Reminder/useReminders';
import useFollowUpEntries from '../../components/FollowUpEntry/useFollowUpEntries';
import CalendarEntry from '../../components/Entry/CalendarEntry';
import Reminder from '../../components/Reminder/Reminder';
import styles from './CalendarView.module.scss';
import Navbar from '../../components/Navbar/Navbar';
import FollowUpEntry from '../../components/FollowUpEntry/FollowUpEntry';
import NewEntryModal from '../../components/NewEntryModal/NewEntryModal';
import Slider from '../../components/SliderComponent/Slider';
import handleDeleteEntry from '../../Utils/HandleDeleteEntry';
import { handleDeleteFollowUpById } from '../../Utils/HandleDeleteFollowUp';
import { handleDeleteReminderById } from '../../Utils/HandleDeleteReminder';

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

    const storedDate = localStorage.getItem('selectedDate');
    if (storedDate) {
      setSelectedDate(new Date(storedDate));
    }
  }, []);

  useEffect(() => {
    const formatDateToLocal = (date) => {
      const offset = date.getTimezoneOffset();
      const newDate = new Date(date.getTime() - (offset * 60 * 1000));
      return newDate.toISOString().split('T')[0];
    };

    const formattedDate = formatDateToLocal(selectedDate); // 'YYYY-MM-DD' format
    localStorage.setItem('selectedDate', formattedDate);
  }, [selectedDate]);

  const tileClassName = ({ date }) => {
    const formatDateToLocal = (date) => {
      const offset = date.getTimezoneOffset();
      const newDate = new Date(date.getTime() - (offset * 60 * 1000));
      return newDate.toISOString().split('T')[0];
    };

    const formattedDate = formatDateToLocal(date); // 'YYYY-MM-DD' format
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
    setFollowUpEntries(prevFollowUpEntries =>
      prevFollowUpEntries.map(followUpEntry =>
        followUpEntry.entryID === updatedFollowUpEntry.entryID
          ? updatedFollowUpEntry
          : followUpEntry
      )
    );
    setRefresh(prev => !prev);
  };

  const handleMonthChange = ({ activeStartDate }) => {
    setCurrentMonth(activeStartDate);
    const firstDayOfMonth = new Date(activeStartDate.getFullYear(), activeStartDate.getMonth(), 1);
    setSelectedDate(firstDayOfMonth);
    setRefresh((prev) => !prev);
  };

  const formatDateToLocal = (date) => {
    const offset = date.getTimezoneOffset();
    const newDate = new Date(date.getTime() - (offset * 60 * 1000));
    return newDate.toISOString().split('T')[0];
  };

  const formattedSelectedDate = formatDateToLocal(selectedDate);

  return (
    <div>
      <Navbar />
      {loggedIn ? (
        <div className={styles.calendarContainer}>
          <div className={styles.backgroundContainer}>
            <Slider />
            <Calendar
              value={selectedDate}
              onChange={handleSelectDate}
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
          {entries.length > 0 && (
            <ul className={styles.EntryList}>
              {entries
                .filter((entry) => formatDateToLocal(new Date(entry.date)) === formattedSelectedDate)
                .map((entry) => (
                  <CalendarEntry
                    key={entry._id}
                    entry={entry}
                    setEntries={setEntries}
                    onUpdateEntry={onUpdateEntry}
                    onDeleteEntry={handleDeleteEntry}
                    selectedDate={selectedDate}
                    setRefresh={setRefresh}
                    userID={userID}
                  />
                ))}
            </ul>
          )}
          {followUpEntries.length > 0 && (
            <ul className={styles.calendarFollowUpList}>
              {followUpEntries
                .filter((followUpEntry) => formatDateToLocal(new Date(followUpEntry.date)) === formattedSelectedDate)
                .map((followUpEntry) => (
                  <FollowUpEntry
                    key={followUpEntry._id}
                    followUpEntry={followUpEntry}
                    onDeleteFollowUp={handleDeleteFollowUpById}
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
          {reminders.length > 0 && (
            <ul className={styles.EntryList}>
              <h4>Reminders</h4>
              {reminders
                .filter((reminder) => formatDateToLocal(new Date(reminder.date)) === formattedSelectedDate)
                .map((reminder, index) => (
                  <Reminder
                    className={styles.calendarReminder}
                    key={index}
                    reminder={reminder}
                    selectedDate={selectedDate}
                    setReminders={setReminders}
                    onSelectDate={handleSelectDate}
                    onDeleteReminder={handleDeleteReminderById}
                    setRefresh={setRefresh}
                  />
                ))}
            </ul>
          )}
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
