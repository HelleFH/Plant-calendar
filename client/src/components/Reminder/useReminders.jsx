import { useState, useEffect } from 'react';
import getRemindersByDateAndUserID from '../../Utils/GetRemindersbyDateAndUserID';

const useReminders = (selectedDate, refresh) => {
  const [reminders, setReminders] = useState([]);
  const [highlightedReminderDates, setHighlightedReminderDates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReminders = async (date) => {
      try {
        const formattedDate = date.toISOString().split('T')[0];
        const userID = localStorage.getItem('userId');
        const remindersData = await getRemindersByDateAndUserID(formattedDate, userID);
        setReminders(remindersData);
      } catch (error) {
        console.error('Error occurred while fetching entries:', error);
        setError('An error occurred while fetching entries.');
      }
    };

    const fetchAndSaveReminderDates = async () => {
      try {
        const userID = localStorage.getItem('userId');
        if (!userID) return;

        const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

        const datesInRange = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          datesInRange.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }

        const highlightedReminderDatesPromises = datesInRange.map(async (date) => {
          const formattedDate = date.toISOString().split('T')[0];
          const remindersData = await getRemindersByDateAndUserID(formattedDate, userID);
          if (remindersData.length > 0) {
            return date.toDateString();
          }
          return null;
        });

        const highlightedReminderDates = await Promise.all(highlightedReminderDatesPromises);
        setHighlightedReminderDates(highlightedReminderDates.filter(date => date !== null));
      } catch (error) {
        console.error('Error occurred while fetching entries:', error);
        setError('An error occurred while fetching entries.');
      }
    };

    if (selectedDate) {
      fetchReminders(selectedDate);
      fetchAndSaveReminderDates();
    }
  }, [selectedDate, refresh]); 

  return {
    reminders,
    highlightedReminderDates,
    error,
    setReminders,
  };
};

export default useReminders;