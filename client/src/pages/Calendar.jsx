import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import getEntriesByDateAndUsername from '../components/GetEntriesByDateAndUsername';
import CalendarEntry from '../components/CalendarEntry';
import CreateEntryWithFileUpload from '../components/createEntry';
import Slider from '../components/Slider';
import getRemindersByDateAndUsername from '../components/GetRemindersbyDateAndUsername';

const CalendarComponent = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState(null);
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [highlightedReminderDates, setHighlightedReminderDates] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth');
    setLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchEntries(selectedDate);
      fetchReminders(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    const fetchAndSaveEntryDates = async () => {
      try {
        const username = localStorage.getItem('username');
        if (!username) return;

        const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

        const datesInRange = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          datesInRange.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }

        const highlightedDates = [];
        for (const date of datesInRange) {
          const formattedDate = date.toISOString().split('T')[0];
          const entriesData = await getEntriesByDateAndUsername(formattedDate, username);
          if (entriesData.length > 0) {
            highlightedDates.push(date.toDateString());
          }
        }

        setHighlightedDates(highlightedDates);
        localStorage.setItem('highlightedDates', JSON.stringify(highlightedDates));
      } catch (error) {
        console.error('Error occurred while fetching entries:', error);
        setError('An error occurred while fetching entries.');
      }
    };

    if (selectedDate) {
      fetchAndSaveEntryDates();
    }
  }, [selectedDate]);

  useEffect(() => {
    const fetchAndSaveReminderDates = async () => {
      try {
        const username = localStorage.getItem('username');
        if (!username) return;

        const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

        const datesInRange = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          datesInRange.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }

        const highlightedReminderDates = [];
        for (const date of datesInRange) {
          const formattedDate = date.toISOString().split('T')[0];
          const remindersData = await getRemindersByDateAndUsername(formattedDate, username);
          if (remindersData.length > 0) {
            highlightedReminderDates.push(date.toDateString());
          }
        }

        setHighlightedReminderDates(highlightedReminderDates);
        localStorage.setItem('highlightedReminderDates', JSON.stringify(highlightedReminderDates));
      } catch (error) {
        console.error('Error occurred while fetching reminders:', error);
        setError('An error occurred while fetching reminders.');
      }
    };

    if (selectedDate) {
      fetchAndSaveReminderDates();
    }
  }, [selectedDate]);

  const fetchEntries = async (date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const username = localStorage.getItem('username');
      const entriesData = await getEntriesByDateAndUsername(formattedDate, username);
      setEntries(entriesData);
    } catch (error) {
      console.error('Error occurred while fetching entries:', error);
      setError('An error occurred while fetching entries.');
    }
  };

  const fetchReminders = async (date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const username = localStorage.getItem('username');
      const remindersData = await getRemindersByDateAndUsername(formattedDate, username);
      setReminders(remindersData);
    } catch (error) {
      console.error('Error occurred while fetching reminders:', error);
      setError('An error occurred while fetching reminders.');
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(selectedDate && selectedDate.getTime() === date.getTime() ? null : date);
  };

  const combinedTileClassName = ({ date }) => {
    const formattedDate = date.toDateString();
    if (highlightedDates.includes(formattedDate)) {
      return 'highlighted';
    } else if (highlightedReminderDates.includes(formattedDate)) {
      return 'highlighted-reminder';
    }
    return null;
  };

  const handleAddEntryClick = () => {
    setShowCreateForm(true);
  };

  const handleUpdateEntry = (updatedEntry) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) => (entry._id === updatedEntry._id ? updatedEntry : entry))
    );
  };

  const handleDeleteEntrySuccess = (deletedEntryId) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== deletedEntryId));
  };

  return (
    <div>
      {loggedIn ? (
        <div>
          <h1>Calendar</h1>
          <Slider id={1} />

          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
            tileClassName={combinedTileClassName}
          />
          <div>
            {selectedDate && (
              <>
                <p>Selected Date: {selectedDate.toDateString()}</p>
                {error && <p>Error: {error}</p>}
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
              </>
            )}
            <button onClick={handleAddEntryClick}>Add Entry</button>
            {showCreateForm && <CreateEntryWithFileUpload selectedDate={selectedDate} />}
          </div>
        </div>
      ) : (
        <p>Please log in to view the calendar.</p>
      )}
    </div>
  );
};

export default CalendarComponent;