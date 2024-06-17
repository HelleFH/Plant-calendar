import { useState, useEffect } from 'react';
import getFollowUpEntriesByDateAndId from '../../Utils/getFollowUpEntriesByDateAndId'


const useFollowUpEntries = (selectedDate, refresh) => {
  const [followUpEntries, setFollowUpEntries] = useState([]);
  const [highlightedFollowUpDates, setHighlightedFollowUpDates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowUpEntries = async (date) => {
      try {
        const formattedDate = date.toISOString().split('T')[0];
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
          const formattedDate = date.toISOString().split('T')[0];
          const followUpEntriesData = await getFollowUpEntriesByDateAndId(formattedDate, userID);
          if (followUpEntriesData.length > 0) {
            return date.toDateString();
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
  }, [selectedDate, refresh]); // Add refresh to the dependency array

  return {
    followUpEntries,
    highlightedFollowUpDates,
    error,
    setFollowUpEntries,
  };
};

export default useFollowUpEntries;