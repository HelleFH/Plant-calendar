import { useState, useEffect } from 'react';
import getEntriesByDateAndId from '../../Utils/GetEntriesByDateAndId';

const useEntries = (selectedDate, refresh) => {
  const [entries, setEntries] = useState([]);
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [error, setError] = useState(null);

  const formatDateToLocal = (date) => {
    const offset = date.getTimezoneOffset();
    const newDate = new Date(date.getTime() - (offset * 60 * 1000));
    return newDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchEntries = async (date) => {
      try {
        const formattedDate = formatDateToLocal(date);
        const userID = localStorage.getItem('userId');
        const entriesData = await getEntriesByDateAndId(formattedDate, userID);
        setEntries(entriesData);
      } catch (error) {
        console.error('Error occurred while fetching entries:', error);
        setError('An error occurred while fetching entries.');
      }
    };

    const fetchAndSaveEntryDates = async () => {
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

        const highlightedDatesPromises = datesInRange.map(async (date) => {
          const formattedDate = formatDateToLocal(date);
          const entriesData = await getEntriesByDateAndId(formattedDate, userID);
          if (entriesData.length > 0) {
            return formattedDate;
          }
          return null;
        });

        const highlightedDates = await Promise.all(highlightedDatesPromises);
        console.log('Highlighted Dates:', highlightedDates); // Debugging line
        setHighlightedDates(highlightedDates.filter(date => date !== null));
      } catch (error) {
        console.error('Error occurred while fetching entries:', error);
        setError('An error occurred while fetching entries.');
      }
    };

    if (selectedDate) {
      fetchEntries(selectedDate);
      fetchAndSaveEntryDates();
    }
  }, [selectedDate, refresh]);

  return {
    entries,
    highlightedDates,
    error,
    setEntries,
  };
};

export default useEntries;