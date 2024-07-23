import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ImageUpload from '../imageUpload';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import NewCalendarReminder from '../Reminder/SetCalendarReminder';
import moment from 'moment';
import styles from './CalendarEntry.module.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axiosInstance from '../axiosInstance';
import CreateFollowUpEntry from '../FollowUpEntry/CreateFollowUpEntry';
import FollowUpEntry from '../FollowUpEntry/FollowUpEntry';
import handleSubmitUpdate from '../../Utils/HandleSubmitUpdate';
import ImageGalleryModal from '../ImageGalleryModal/ImageGalleryModal';
import handleDeleteEntry from '../../Utils/HandleDeleteEntry';
import Reminder from '../Reminder/Reminder';

const CalendarEntry = ({
  entry,
  setEntries,
  setRefresh,
  followUpDate,
  isModal,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedEntry, setEditedEntry] = useState({ ...entry });
  const [files, setFiles] = useState([]);
  const [previewSrcs, setPreviewSrcs] = useState([]);
  const [cloudinaryUrls, setCloudinaryUrls] = useState(entry.images?.map(img => img.cloudinaryUrl) || []);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImageGalleryModalOpen, setIsImageGalleryModalOpen] = useState(false);

  const [followUpEntries, setFollowUpEntries] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [username, setUsername] = useState('');
  const [selectedDate, setSelectedDate] = useState(entry.date);

  const contentRef = useRef(null);

  useEffect(() => {
    if (entry._id) {
      fetchFollowUpEntriesByEntryId();
      fetchRemindersByEntryId();
    }
  }, [entry._id]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const fetchRemindersByEntryId = async () => {
    try {
      const response = await axiosInstance.get(`/reminders/entry/${entry._id}`);
      setReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders by entry ID:', error);
    }
  };

  const fetchFollowUpEntriesByEntryId = async () => {
    try {
      const response = await axiosInstance.get(`/entries/follow-up/${entry._id}`);
      setFollowUpEntries(response.data);

      const followUpUrls = response.data.flatMap(entry => entry.images?.map(img => img.cloudinaryUrl) || []);
      setCloudinaryUrls(prevUrls => [...prevUrls, ...followUpUrls]);
    } catch (error) {
      console.error('Error fetching follow-up entries by entry ID:', error);
    }
  };

  const handleChange = (e) => {
    setEditedEntry({ ...editedEntry, [e.target.name]: e.target.value });
  };

  const handleDeleteReminder = async (deletedReminderId) => {
    try {
      await axiosInstance.delete(`/reminders/${deletedReminderId}`);
      setReminders(prevReminders =>
        prevReminders.filter(reminder => reminder._id !== deletedReminderId)
      );
      fetchRemindersByEntryId();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const handleDeleteFollowUpByEntryID = async (deletedFollowUpId) => {
    try {
      await axiosInstance.delete(`/entries/follow-up/${deletedFollowUpId}`);
      setFollowUpEntries(prevFollowUpEntries =>
        prevFollowUpEntries.filter(entry => entry._id !== deletedFollowUpId)
      );
      fetchFollowUpEntriesByEntryId();
    } catch (error) {
      console.error('Error deleting follow-up:', error);
    }
  };

  const onDrop = (acceptedFiles) => {
    const currentFile = acceptedFiles[0];
    setFiles([currentFile]);

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setPreviewSrcs([reader.result]);
    });

    reader.readAsDataURL(currentFile);
  };

  const handleDeleteImage = async (index) => {
    const imageUrl = cloudinaryUrls[index];

    try {
      // Call Cloudinary API to delete the image
      const response = await axiosInstance.post('/delete-image', { url: imageUrl });
      if (response.data.success) {
        setCloudinaryUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
        setPreviewSrcs((prevSrcs) => prevSrcs.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }
  };

  const toggleReminderModal = () => {
    setIsReminderModalOpen(prev => !prev);
  };

  const toggleImageGalleryModal = () => {
    setIsImageGalleryModalOpen(prev => !prev);
  };

  const toggleCreateModal = () => {
    setIsCreateModalOpen(prev => !prev);
  };

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    fetchFollowUpEntriesByEntryId();
  };
  const onUpdateFollowUpEntry = (updatedFollowUpEntry) => {
    setFollowUpEntries((prevFollowUpEntries) =>
      prevFollowUpEntries.map((followUpEntry) =>
        followUpEntry._id === updatedFollowUpEntry._id
          ? updatedFollowUpEntry
          : followUpEntry
      )
    );
    fetchFollowUpEntriesByEntryId();
    setRefresh((prev) => !prev);
  };
  const handleUpdateEntry = (updatedEntry) => {
    setEntries(prevEntries =>
      prevEntries.map(entry => (entry._id === updatedEntry._id ? updatedEntry : entry))
    );
    setEditedEntry(updatedEntry);
    setRefresh(prev => !prev);
  };
  
  const handleUpdateFollowUpEntry = (updatedFollowUpEntry) => {
    setFollowUpEntries(prevFollowUpEntries =>
      prevFollowUpEntries.map(followUpEntry =>
        followUpEntry.entryID === updatedFollowUpEntry.entryID
          ? updatedFollowUpEntry
          : followUpEntry
      )
    );
    setRefresh(prev => !prev);
  };


  const handleConfirmDelete = () => {
    if (idToDelete) {
      handleDeleteEntry(
        idToDelete,
        setEntries,
        setFollowUpEntries,
        setReminders,
        fetchFollowUpEntriesByEntryId,
        fetchRemindersByEntryId,
        setRefresh
      );
      setShowDeleteModal(false);
    } else {
      console.error('No ID provided for deletion.');
    }
  };

  const handleAddFollowUpEntry = (newFollowUpEntry) => {
    setFollowUpEntries(prevFollowUpEntries => [
      ...prevFollowUpEntries,
      newFollowUpEntry,
    ]);
    fetchFollowUpEntriesByEntryId();
  };

  const handleAddReminder = (newReminder) => {
    setReminders(prevReminders => [...prevReminders, newReminder]);
    fetchRemindersByEntryId();
  };

  const handleSelectedDateChange = (date) => {
    setSelectedDate(date);
  };

  const allUrls = [entry.cloudinaryUrl, ...cloudinaryUrls].filter(Boolean);

  return (
    <li className={styles.CalendarEntry}>
      <div className="flex-row">
        <h4 onClick={toggleExpand} className={styles.entryName}>
          {entry.name}
        </h4>
        <i
          onClick={toggleExpand}
          className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} ${styles.chevron} ${isModal ? styles.entryChevronModal : 'hidden'}`}
        ></i>
      </div>

      <div
        className={`${styles.entryDetails} ${isExpanded ? styles.expanded : ''} ${isModal ? styles.entryDetailsModal : ''}`}
        ref={contentRef}
        style={
          isExpanded
            ? { height: contentRef.current.scrollHeight }
            : { height: 0 }
        }
      >
        {isEditing ? (
          <div className={styles.editFormContainer}>
            <ImageUpload
              onDrop={onDrop}
              previewSrcs={previewSrcs}
              onDelete={handleDeleteImage}
              isPreviewAvailable={!!previewSrcs.length}
            />
            <button
              className="primary-button"
              onClick={() => {
                handleSubmitUpdate(entry._id, editedEntry, files[0], selectedDate, handleUpdateEntry, handleDeleteEntry);
                setIsEditing(false);
              }}
            >
              Save
            </button>
            <button className="secondary-button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <>
            <div className="margin-top">
              <h5 className="margin-bottom padding-bottom">
                Added on {moment(entry.date).format('MMMM Do YYYY')}
              </h5>
              {allUrls.length > 0 && (
                <div>
                  {allUrls.map((url, index) => (
                    <div key={index} className="image-container">
                      <img
                        src={url}
                        alt={`Image ${index}`}
                        className="image-preview"
                        onError={(e) => {
                          console.error('Error loading image:', e.target.src);
                          e.target.src = 'fallback-image-url'; // Optional: Use a fallback image URL
                        }}
                      />
                      {isEditing && (
                        <button onClick={() => handleDeleteImage(index)}>Delete</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <Link onClick={toggleImageGalleryModal} className={styles.galleryLink}>
                <h5>View All Images for {entry.name}</h5>
              </Link>

              <div className={styles.EntryFormContainer}>
                <hr className="long-line" />
                <label>Notes:</label>
                <p>{entry.notes}</p>
                <hr className="long-line" />
                <label>Sunlight:</label>
                <p>{entry.sunlight}</p>
                <hr className="long-line" />
                <label>Water:</label>
                <p>{entry.water}</p>
                <hr className="long-line margin-bottom" />
              </div>
            </div>
            {isCreateModalOpen && (
              <CreateFollowUpEntry
                isOpen={isCreateModalOpen}
                onClose={handleCloseModal}
                followUpDate={selectedDate}
                oldEntryID={entry._id}
                oldEntryName={entry.name}
                oldEntryDate={entry.date}
                sunlight={entry.sunlight}
                water={entry.water}
                name={entry.name}
                handleAddFollowUpEntry={handleAddFollowUpEntry}
                selectedDate={selectedDate}
                handleSelectedDateChange={handleSelectedDateChange}
              />
            )}

            <div className="flex-row-right margin-top margin-bottom">
              <Link
                className={styles.deleteButton}
                onClick={(e) => {
                  e.preventDefault();
                  setIdToDelete(entry._id);
                  setShowDeleteModal(true);
                }}
              >
                Delete
              </Link>
              <button className="primary-button" onClick={() => setIsEditing(true)}>
                Edit
              </button>
              <ImageGalleryModal
                entryID={entry._id}
                onClose={toggleImageGalleryModal}
                isOpen={isImageGalleryModalOpen}
                urls={allUrls}
              />
            </div>
            <div className={styles.followUpContainer}>
              <div className={styles.FollowUpListContainer}>
                <div className="flex-row">
                  <h4>Updates for {entry.name}</h4>
                  <button className={`primary-button ${styles.followUpButton}`} onClick={toggleCreateModal}>
                    + Add an Update
                  </button>
                </div>
                {followUpEntries.length > 0 && (
                  <ul className={styles.FollowUpEntryList}>
                    {followUpEntries.map((followUpEntry, index) => (
                      <FollowUpEntry
                        key={index}
                        followUpEntry={followUpEntry}
                        selectedDate={followUpDate}
                        onUpdateFollowUpEntry={onUpdateFollowUpEntry}
                        onDeleteFollowUp={handleDeleteFollowUpByEntryID}
                        setFollowUpEntries={setFollowUpEntries}
                        setRefresh={setRefresh}
                        handleUpdateFollowUpEntry={handleUpdateFollowUpEntry}
                        className={styles.followUpEntry}
                      />
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <NewCalendarReminder
              isOpen={isReminderModalOpen}
              onClose={toggleReminderModal}
              date={selectedDate}
              entryID={entry._id}
              handleAddReminder={handleAddReminder}
            />
            {showDeleteModal && (
              <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
              />
            )}
          </>
        )}
      </div>
    </li>
  );
};

export default CalendarEntry;
