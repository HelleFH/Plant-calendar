import { useState, useEffect } from 'react';
import getFollowUpEntriesByDateAndId from '../../Utils/getFollowUpEntriesByDateAndId';

const useFollowUpEntries = (selectedDate, refresh) => {
  const [followUpEntries, setFollowUpEntries] = useState([]);
  const [highlightedFollowUpDates, setHighlightedFollowUpDates] = useState([]);
  const [error, setError] = useState(null);

  const formatDateToLocal = (date) => {
    const offset = date.getTimezoneOffset();
    const newDate = new Date(date.getTime() - (offset * 60 * 1000));
    return newDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchFollowUpEntries = async (date) => {
      try {
        const formattedDate = formatDateToLocal(date);
        const userID = localStorage.getItem('userId');
        const followUpEntriesData = await getFollowUpEntriesByDateAndId(formattedDate, userID);
        setFollowUpEntries(followUpEntriesData);
      } catch (error) {
        console.error('Error occurred while fetching entries:', error);
        setError('An error occurred while fetching entries.');
      }
    };

    const fetchAndSaveFollowUpEntryDates = async () => {
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

        const highlightedFollowUpDatesPromises = datesInRange.map(async (date) => {
          const formattedDate = formatDateToLocal(date);
          const followUpEntriesData = await getFollowUpEntriesByDateAndId(formattedDate, userID);
          if (followUpEntriesData.length > 0) {
            return formattedDate;
          }
          return null;
        });

        const highlightedFollowUpDates = await Promise.all(highlightedFollowUpDatesPromises);
        setHighlightedFollowUpDates(highlightedFollowUpDates.filter(date => date !== null));
      } catch (error) {
        console.error('Error occurred while fetching entries:', error);
        setError('An error occurred while fetching entries.');
      }
    };

    if (selectedDate) {
      fetchFollowUpEntries(selectedDate);
      fetchAndSaveFollowUpEntryDates();
    }
  }, [selectedDate, refresh]);

  return {
    followUpEntries,
    highlightedFollowUpDates,
    error,
    setFollowUpEntries,
  };
};

export default useFollowUpEntries;
