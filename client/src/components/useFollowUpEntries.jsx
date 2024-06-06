import { useState, useEffect } from 'react';
import getFollowUpEntriesByDateAndId from './getFollowUpEntriesByDateAndId';

const useFollowUpEntries = (selectedDate) => {
  const [followUpEntries, setFollowUpEntries] = useState([]);
  const [highlightedFollowUpDates, setHighlightedFollowUpDates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntries = async (date) => {
      try {
        const formattedDate = date.toISOString().split('T')[0];
        const userID = localStorage.getItem('userId');
        const entriesData = await getFollowUpEntriesByDateAndId(formattedDate, userID);
        setFollowUpEntries(entriesData);
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
          const formattedDate = date.toISOString().split('T')[0];
          const entriesData = await getFollowUpEntriesByDateAndId(formattedDate, userID);
          if (entriesData.length > 0) {
            return date.toDateString();
          }
          return null;
        });

        const highlightedFollowUpDates = await Promise.all(highlightedDatesPromises);
        setHighlightedFollowUpDates(highlightedFollowUpDates.filter(date => date !== null));
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
    followUpEntries,
    highlightedFollowUpDates,
    error,
    setFollowUpEntries,
  };
};

export default useFollowUpEntries;