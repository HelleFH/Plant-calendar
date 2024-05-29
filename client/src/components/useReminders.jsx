import { useState, useEffect } from 'react';
import getRemindersByDateAndUsername from '../components/GetRemindersbyDateAndUsername';

const useReminders = (selectedDate) => {
  const [reminders, setReminders] = useState([]);
  const [highlightedReminderDates, setHighlightedReminderDates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRemindersForSelectedDate = async () => {
      try {
        const username = localStorage.getItem('username');
        if (!username) return;

        const formattedDate = selectedDate.toDateString(); // Use the same format as entries
        const remindersData = await getRemindersByDateAndUsername(formattedDate, username);
        setReminders(remindersData);
      } catch (error) {
        console.error('Error occurred while fetching reminders:', error);
        setError('An error occurred while fetching reminders.');
      }
    };

    if (selectedDate) {
      fetchRemindersForSelectedDate();
    }
  }, [selectedDate]);

  useEffect(() => {
    const fetchAndSaveReminderDatesForMonth = async () => {
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
          const formattedDate = date.toDateString(); // Use the same format as entries
          const remindersData = await getRemindersByDateAndUsername(formattedDate, username);
          if (remindersData.length > 0) {
            highlightedDates.push(formattedDate);
          }
        }

        setHighlightedReminderDates(highlightedDates);
        localStorage.setItem('highlightedReminderDates', JSON.stringify(highlightedDates));
      } catch (error) {
        console.error('Error occurred while fetching reminder dates:', error);
        setError('An error occurred while fetching reminder dates.');
      }
    };

    if (selectedDate) {
      fetchAndSaveReminderDatesForMonth();
    }
  }, [selectedDate]);

  return {
    reminders,
    highlightedReminderDates,
    error,
    setReminders,
  };
};

export default useReminders;