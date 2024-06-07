import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ImageUpload from '../imageUpload';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import handleSubmitUpdate from '../HandleSubmitUpdate';
import handleDeleteEntry from '../HandleDeleteEntry';
import SetCalendarReminder from '../SetReminderComponent/SetCalendarReminder';
import handleDeleteReminder from '../HandleDeleteReminder';
import moment from 'moment';
import styles from '../CalendarEntryComponent/CalendarEntryComponent.module.scss';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Make sure this is included
import axiosInstance from '../axiosInstance';
import CreateFollowUpEntry from '../FollowUpEntry/CreateFollowUpEntry';
import FollowUpEntry from '../FollowUpEntry/FollowUpEntry';
import useEntries from '../useEntries';

const CalendarEntry = ({ entry, onUpdateEntry, onDeleteEntry, selectedDate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedEntry, setEditedEntry] = useState(entry);
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(entry.cloudinaryUrl);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [followUpEntries, setFollowUpEntries] = useState([]);

  const [username, setUsername] = useState('');
  const [reminders, setReminders] = useState([]);

  const contentRef = useRef(null);
  const formattedSelectedDate = selectedDate instanceof Date ? selectedDate.toISOString() : selectedDate;


  useEffect(() => {
    const fetchFollowUpEntriesByEntryId = async () => {
      try {
        const response = await axiosInstance.get(`entries/follow-up/${entry._id}`);
        setFollowUpEntries(response.data);
      } catch (error) {
        console.error('Error fetching follow-up entries by entry ID:', error);
      }
    };

    if (entry._id) {
      fetchFollowUpEntriesByEntryId();
    }
  }, [entry._id]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchRemindersByEntryId = async () => {
      try {
        const response = await axiosInstance.get(`reminders/entry/${entry._id}`);
        setReminders(response.data);
      } catch (error) {
        console.error('Error fetching reminders by entry ID:', error);
      }
    };

    if (entry._id) {
      fetchRemindersByEntryId();
    }
  }, [entry._id]);

  const handleChange = (e) => {
    setEditedEntry({ ...editedEntry, [e.target.name]: e.target.value });
  };

  const onDrop = (acceptedFiles) => {
    const currentFile = acceptedFiles[0];
    setFile(currentFile);

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setPreviewSrc(reader.result);
    });

    reader.readAsDataURL(currentFile);
  };

  const toggleReminderModal = () => {
    setIsReminderModalOpen(!isReminderModalOpen);
  };

  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleUpdateEntry = (updatedEntry) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) => (entry._id === updatedEntry._id ? updatedEntry : entry))
    );
  };

  return (
    <li className={styles.CalendarEntry}>

      <div className="flex-row">
        <h4 onClick={toggleExpand} className={styles.entryName}>
          {entry.name}      	

        </h4>
        <i
          onClick={toggleExpand}
          className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} ${styles.chevron}`}
        ></i>
      </div>

      <div
        className={` ${styles.entryDetails} ${isExpanded ? styles.expanded : ''}`}
        ref={contentRef}
        style={
          isExpanded
            ? { height: contentRef.current.scrollHeight }
            : { height: 0 }
        }
      >
        {isEditing ? (
          <>
            <div className={styles.editFormContainer}>
              <ImageUpload
                onDrop={onDrop}
                file={file}
                previewSrc={previewSrc}
                isPreviewAvailable={true}
              />
              <label>Name:</label>
              <input type="text" name="name" value={editedEntry.name} onChange={handleChange} />
              <label>Notes:</label>
              <textarea name="notes" value={editedEntry.notes} onChange={handleChange} />
              <label>Sunlight:</label>
              <input type="text" name="sunlight" value={editedEntry.sunlight} onChange={handleChange} />
              <label>Water:</label>
              <input type="text" name="water" value={editedEntry.water} onChange={handleChange} />
              <div className="flex-row-right">
                <Link onClick={() => setIsEditing(false)}>Cancel</Link>
                <button className="secondary-button" onClick={() => handleSubmitUpdate(entry._id, editedEntry, file, selectedDate, handleUpdateEntry, handleDeleteEntry).then(() => setIsEditing(false))}>Save</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.lineContainer}>
              <hr className="long-line"></hr>
            </div>
            {entry.cloudinaryUrl && <img className="margin-top margin-bottom" src={entry.cloudinaryUrl} alt={entry.name} />}

            <div className={styles.EntryFormContainer}>
              <hr className="long-line"></hr>
              <label>Notes:</label>
              <p>{entry.notes}</p>
              <hr className="long-line"></hr>

              <label>Sunlight:</label>
              <p>{entry.sunlight}</p>
              <hr className="long-line"></hr>
              <label>Water:</label>
              <p>{entry.water}</p>
              <hr className="long-line margin-bottom"></hr>
            </div>
            {isCreateModalOpen && (
              <CreateFollowUpEntry
                isOpen={isCreateModalOpen}
                onClose={handleCloseModal}
                selectedDate={formattedSelectedDate}
                oldEntryID={entry._id}
                oldEntryName={entry.name} // Pass the entry name here
                sunlight={entry.sunlight}
                water={entry.water}
                name={entry.name}
              />

            )}
            <div className={styles.followUpContainer}>

            <h4>Other entries for {entry.name} </h4>
            <div className={styles.FollowUpListContainer}>

              {followUpEntries.length > 0 && (
                <ul className={styles.EntryList}>
                  {followUpEntries.map((followUpEntry, index) => (
                    <FollowUpEntry
                      key={index}
                      entry={followUpEntry}
                      selectedDate={selectedDate}
                      onUpdateEntry={handleUpdateEntry}
                      onDeleteEntry={onDeleteEntry}
                    />
                    
                  ))}
                </ul>
                
              )}
                <Link className={styles.addEntryLink} onClick={toggleCreateModal}>
              + Add Entry
            </Link>
            </div>
            </div>
            <SetCalendarReminder
              isOpen={isReminderModalOpen}
              onClose={toggleReminderModal}
              date={selectedDate}
              entryId={entry._id}
              username={username}
            />
          
            <div className={styles.lineContainer}>
              <hr className="long-line"></hr>
            </div>
            <div className="margin-top flex-row">
              <p>Reminders:</p>
              <button className="primary-button" onClick={toggleReminderModal}>
                <i className="fas fa-bell"></i> Set Reminder
              </button>
            </div>
            <ul className="flex-right margin-top">
              {reminders.map((reminder) => (
                <li className="flex-row" key={reminder._id}>
                  <span>
                    {moment(reminder.date).format('MMMM Do YYYY')} - {reminder.description}
                  </span>
                  <span>
                    <i
                      className="fas fa-trash"
                      onClick={() => handleDeleteReminder(reminder._id)}
                      style={{ cursor: 'pointer', marginLeft: '10px' }}
                    ></i>
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex-row-right margin-top margin-bottom">
              <Link
                className={styles.deleteButton}
                onClick={() => {
                  setIdToDelete(entry._id);
                  setShowDeleteModal(true);
                }}
              >
                Delete
              </Link>
              {showDeleteModal && (
                <DeleteConfirmationModal
                  isOpen={showDeleteModal}
                  onCancel={() => setShowDeleteModal(false)}
                  onConfirm={() => handleDeleteEntry(idToDelete)}
                />
              )}
              <button className="secondary-button" onClick={() => setIsEditing(true)}>
                Edit
              </button>
            </div>
          </>
        )}
      </div>
    </li>
  );
};

export default CalendarEntry;
