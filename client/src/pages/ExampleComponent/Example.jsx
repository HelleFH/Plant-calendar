import axiosInstance from '../../components/axiosInstance';
import React, { useEffect, useState } from 'react';
import CalendarEntry from '../../components/CalendarEntryComponent/CalendarEntry';
import Navbar from '../../components/Navbar/Navbar';
import styles from './ExampleComponent.module.scss';



const Example = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const userID =  localStorage.getItem('userId'); // Removes leading and trailing quotes if present
                if (!userID) {
          throw new Error('No user ID found in local storage');
        }

        console.log("Fetched userID from localStorage: ", userID); // Debugging log

        const response = await axiosInstance.get(`/entries/userID/${userID}?sortBy=name`);
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, []);
  
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
<div className={styles.ExampleContainer}>
      {entries.length > 0 && (
            <ul className={styles.entryListContainer}>
              <h4>Entries</h4>
              {entries.map((entry, index) => (
                <CalendarEntry
                  className={styles.calendarEntry}
                  key={index}
                  entry={entry}
                  onUpdateEntry={onUpdateEntry}
                  onDeleteEntry={onDeleteEntry}
                />
              ))}
            </ul>
          )}    </div>
          </div>
  );
};


export default Example;
