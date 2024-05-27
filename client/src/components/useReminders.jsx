import { useState, useEffect } from 'react';
import getRemindersByDateAndUsername from '../components/GetRemindersbyDateAndUsername';

const useReminders = (selectedDate) => {
  const [reminders, setReminders] = useState([]);
  const [highlightedReminderDates, setHighlightedReminderDates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    if (selectedDate) {
      fetchReminders(selectedDate);
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

  return {
    reminders,
    highlightedReminderDates,
    error,
    setReminders,
  };
};

export default useReminders;