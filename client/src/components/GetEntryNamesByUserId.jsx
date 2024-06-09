import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';

const EntryNamesByUserId = ({ userID }) => {
  const [entryNames, setEntryNames] = useState([]);

  useEffect(() => {
    const fetchEntryNames = async () => {
      try {
        const userID = localStorage.getItem('userId')
        const response = await axiosInstance.get(`entries/userID/${userID}/names`);

        setEntryNames(response.data.entryNames);
      } catch (error) {
        console.error('Error fetching entry names:', error);
      }
    };

    // Fetch entry names when the component mounts
    fetchEntryNames();
  }, [userID]); // Fetch entry names whenever the userID changes

  return (
    <div>
      <h2>Entry Names for User ID: {userID}</h2>
      <ul>
        {entryNames.map((entryName, index) => (
          <li key={index}>{entryName}</li>
        ))}
      </ul>
    </div>
  );
};

export default EntryNamesByUserId;