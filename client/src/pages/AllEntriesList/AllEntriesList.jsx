import axiosInstance from '../../components/axiosInstance';
import React, { useEffect, useState } from 'react';
import CalendarEntry from '../../components/Entry/CalendarEntry';
import Navbar from '../../components/Navbar/Navbar';
import styles from './AllEntriesList.module.scss';

const AllEntriesList = () => {
  const [setRefresh] = useState(false);
  const [entries, setEntries] = useState([]);
  const [sortBy, setSortBy] = useState('name'); // Initial sort by name

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const userID = localStorage.getItem('userId');
        if (!userID) {
          throw new Error('No user ID found in local storage');
        }

        console.log("Fetched userID from localStorage: ", userID);

        const response = await axiosInstance.get(`/entries/sorted/userID/${userID}?sortBy=${sortBy}`);
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, [sortBy]); // Fetch entries again when sortBy changes

  const onUpdateEntry = (updatedEntry) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) => (entry._id === updatedEntry._id ? updatedEntry : entry))
    );
  };

  const onDeleteEntry = (entryId) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== entryId));
  };

  // Utility function to group entries by date
  const groupEntriesByDate = (entries) => {
    return entries.reduce((acc, entry) => {
      const date = new Date(entry.date).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    }, {});
  };

  // Group entries by date
  const groupedEntries = groupEntriesByDate(entries);

  return (
    <div>
      <Navbar />
      <div className={styles.AllEntriesListContainer}>
        {entries.length > 0 && (
          <div>
            <h1 className='margin-top'>All Entries</h1>
            <div className={styles.sortButtons}>
              <button className={sortBy === 'name' ? 'selected' : ''} onClick={() => setSortBy('name')}>
                Sort by Name
              </button>
              <button className={sortBy === 'date' ? 'selected' : ''} onClick={() => setSortBy('date')}>
                Sort by Date
              </button>
            </div>
            <ul className={styles.EntryList}>
              {sortBy === 'date' ? (
                Object.keys(groupedEntries).map((date) => (
                  <div key={date}>
                    <h4>{date}</h4>
                    {groupedEntries[date].map((entry) => (
                      <CalendarEntry
                        className={styles.calendarEntry}
                        key={entry._id}
                        entry={entry}
                        onUpdateEntry={onUpdateEntry}
                        onDeleteEntry={onDeleteEntry}
                        selectedDate={entry.date}
                        setEntries={setEntries}
                        setRefresh={setRefresh}
                      />
                    ))}
                  </div>
                ))
              ) : (
                entries.map((entry) => (
                  <CalendarEntry
                    className={styles.calendarEntry}
                    key={entry._id}
                    entry={entry}
                    onUpdateEntry={onUpdateEntry}
                    onDeleteEntry={onDeleteEntry}
                    selectedDate={entry.date}
                    setEntries={setEntries}
                    setRefresh={setRefresh}
                  />
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEntriesList;