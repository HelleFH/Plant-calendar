import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import handleDeleteEntry from '../components/HandleDeleteEntry';
import getEntriesByDateAndUsername from '../components/GetEntriesByDateAndUsername';
import CalendarEntry from '../components/CalendarEntry';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import CreateEntryWithFileUpload from '../components/createEntry';
import Slider from '../components/Slider';


const CalendarComponent = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('auth');
    setLoggedIn(!!token);
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedDate) {
      fetchEntries(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
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

        const highlightedDates = [];
        for (const date of datesInRange) {
          const formattedDate = date.toISOString().split('T')[0];
          const entriesData = await getEntriesByDateAndUsername(formattedDate, username);
          if (entriesData.length > 0) {
            highlightedDates.push(date.toDateString());
          }
        }

        setHighlightedDates(highlightedDates);
        localStorage.setItem('highlightedDates', JSON.stringify(highlightedDates));
      } catch (error) {
        console.error('Error occurred while fetching entries:', error);
        setError('An error occurred while fetching entries.');
      }
    };

    if (selectedDate) {
      fetchAndSaveEntryDates();
    }
  }, [selectedDate]);

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

  const handleDateChange = (date) => {
    setSelectedDate(selectedDate && selectedDate.getTime() === date.getTime() ? null : date);
  };

  const tileClassName = ({ date }) => {
    const formattedDate = date.toDateString();
    return highlightedDates.includes(formattedDate) ? 'highlighted' : null;
  };

  const handleAddEntryClick = () => {
    setShowCreateForm(true);
  };

  const openDeleteModal = (id) => {
    setIdToDelete(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setIdToDelete(null);
    setShowDeleteModal(false);
  };

  const handleUpdateEntry = (updatedEntry) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) => (entry._id === updatedEntry._id ? updatedEntry : entry))
    );
  };

  return (
    <div>
      {loggedIn ? (
        <div>
          <h1>Calendar</h1>
          <Slider id={1} />

          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
            tileClassName={tileClassName}
          />
          <div>
            {selectedDate && (
              <>
                <p>Selected Date: {selectedDate.toDateString()}</p>
                {error && <p>Error: {error}</p>}
                {entries.length > 0 ? (
                  <ul>
                    {entries.map((entry, index) => (
                      
                      <CalendarEntry
                        key={index}
                        entry={entry}
                        onUpdateEntry={handleUpdateEntry}
                        handleDeleteEntry={openDeleteModal}
                        selectedDate={selectedDate}
                        setEntries={setEntries} // Pass setEntries here

                      />
                    ))}
                  </ul>
                ) : (
                  <p>No entries found for the selected date.</p>
                )}
              </>
            )}
            <button onClick={handleAddEntryClick}>Add Entry</button>
            {showCreateForm && <CreateEntryWithFileUpload selectedDate={selectedDate} />}
          </div>
     
        </div>
      ) : (
        <p>Please log in to view the calendar.</p>
      )}
    </div>
  );
};

export default CalendarComponent;
