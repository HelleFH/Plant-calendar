import { useState, useEffect } from 'react';
import getEntriesByDateAndUsername from '../components/GetEntriesByDateAndUsername';

const useEntries = (selectedDate) => {
  const [entries, setEntries] = useState([]);
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    
        const highlightedDatesPromises = datesInRange.map(async (date) => {
          const formattedDate = date.toISOString().split('T')[0];
          const entriesData = await getEntriesByDateAndUsername(formattedDate, username);
          if (entriesData.length > 0) {
            return date.toDateString();
          }
          return null;
        });
    
        const highlightedDates = await Promise.all(highlightedDatesPromises);
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
  }, [selectedDate]);

  return {
    entries,
    highlightedDates,
    error,
    setEntries,
  };
};

export default useEntries;