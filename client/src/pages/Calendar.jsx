import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CreateListingWithFileUpload from '../components/createListing';

const CalendarComponent = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if the user is logged in by verifying the presence of JWT token in local storage
    const token = localStorage.getItem('auth');
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  const handleDateChange = (date) => {
    try {
      setSelectedDate(date);
      console.log('Selected date:', date);
    } catch (error) {
      console.error('Error occurred while handling date change:', error);
      setError('An error occurred while handling date change.');
    }
  };
  

  return (
    <div>
      {loggedIn ? (
        <div>
          <h1>Calendar</h1>
          <Calendar value={selectedDate} onChange={handleDateChange} />
          <p>Selected Date: {selectedDate.toDateString()}</p>
          {error && <p>Error: {error}</p>}
          <CreateListingWithFileUpload selectedDate={selectedDate} />
        </div>
      ) : (
        <p>Please log in to view the calendar.</p>
      )}
    </div>
  );
};

export default CalendarComponent;
