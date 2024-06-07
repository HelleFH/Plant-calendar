import axiosInstance from '../../components/axiosInstance';
import React, { useEffect, useState } from 'react';
import CalendarEntry from '../../components/CalendarEntryComponent/CalendarEntry';
import Navbar from '../../components/Navbar/Navbar';
import styles from './AllEntriesListComponent.module.scss';

const AllEntriesList = () => {
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

        const response = await axiosInstance.get(`/entries/userID/${userID}?sortBy=${sortBy}`);
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

  return (
    <div>
      <Navbar />
      <div className={styles.AllEntriesListContainer}>

        {entries.length > 0 && (
          <ul className={styles.EntryList}>
            <h1 className='margin-top'>All Entries</h1>
            <div className={styles.sortButtons}>
              <button className={sortBy === 'name' ? 'selected' : ''} onClick={() => setSortBy('name')}>
                Sort by Name
              </button>
              <button className={sortBy === 'date' ? 'selected' : ''} onClick={() => setSortBy('date')}>
                Sort by Date
              </button>
            </div>
            {entries.map((entry, index) => (
              <CalendarEntry
                className={styles.calendarEntry}
                key={index}
                entry={entry}
                onUpdateEntry={onUpdateEntry}
                onDeleteEntry={onDeleteEntry}
                selectedDate={entry.date} // Pass the entry date as selectedDate
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllEntriesList;