import axiosInstance from '../../components/axiosInstance';
import React, { useEffect, useState } from 'react';
import CalendarEntry from '../../components/CalendarEntry/CalendarEntry';
import Navbar from '../../components/Navbar/Navbar';
import styles from './AllEntriesList.module.scss';

const AllEntriesList = ({ setRefresh }) => {
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

  const handleDeleteEntry = async (deletedEntryId) => {
    try {
      await axiosInstance.delete(`entries/${deletedEntryId}`);
      setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== deletedEntryId));
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const groupEntriesByDate = (entries) => {
    return entries.reduce((groupedEntries, entry) => {
      const date = new Date(entry.date).toDateString();
      if (!groupedEntries[date]) {
        groupedEntries[date] = [];
      }
      groupedEntries[date].push(entry);
      return groupedEntries;
    }, {});
  };

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
            {sortBy === 'date' ? (
              Object.keys(groupedEntries).map((date, index) => (
                <div key={index}>
                  <h5 className='margin-top'>{date}</h5>
                  <ul className={styles.EntryList}>
                    {groupedEntries[date].map((entry) => (
                      <CalendarEntry
                        className={styles.calendarEntry}
                        key={entry._id}
                        entry={entry}
                        onUpdateEntry={onUpdateEntry}
                        selectedDate={entry.date}
                        onDeleteEntry={handleDeleteEntry}
                        setRefresh={setRefresh}
                      />
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <ul className={styles.EntryList}>
                {entries.map((entry) => (
                  <CalendarEntry
                    className={styles.calendarEntry}
                    key={entry._id}
                    entry={entry}
                    onUpdateEntry={onUpdateEntry}
                    selectedDate={entry.date}
                    onDeleteEntry={handleDeleteEntry}
                    setRefresh={setRefresh}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEntriesList;