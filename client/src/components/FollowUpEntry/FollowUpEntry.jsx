// FollowUpEntry.js

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ImageUpload from '../imageUpload';
import moment from 'moment';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import handleSubmitUpdate from '../HandleSubmitUpdate';
import handleDeleteEntry from '../HandleDeleteEntry';
import styles from '../CalendarEntryComponent/CalendarEntryComponent.module.scss';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Make sure this is included
import axiosInstance from '../axiosInstance';

const FollowUpEntry = ({ entry, onUpdateEntry,  onSelectDate,  onDeleteEntry, selectedDate, oldName, oldSunlight, oldWater }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedFollowUpEntry, setEditedFollowUpEntry] = useState(entry);
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(entry.cloudinaryUrl);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [followUpEntries, setFollowUpEntries] = useState([]);

  const contentRef = useRef(null);

  useEffect(() => {
    const fetchFollowUpEntriesByEntryId = async () => {
      try {
        const response = await axiosInstance.get(`entries/follow-up/${entry._id}`);
        console.log('Entry ID:', entry._id); // Log the entry ID
    
        console.log('Follow-up entry data:', response.data); // Log the response data
    
        setFollowUpEntries(response.data);
        
        // Update previewSrc with the Cloudinary URL from the follow-up entry
        if (response.data.length > 0) {
          setPreviewSrc(response.data[0].cloudinaryUrl);
        }
      } catch (error) {
        console.error('Error fetching follow-up entries by entry ID:', error);
      }
    };
  
    if (entry._id) {
      fetchFollowUpEntriesByEntryId();
    }
  }, [entry._id]);

  const handleChange = (e) => {
    setEditedFollowUpEntry({ ...editedFollowUpEntry, [e.target.name]: e.target.value });
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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const formatDate = (date) => {
    return moment(date).format('MMMM Do');
  };

  const handleGoToDate = (event) => {
    event.preventDefault();
    if (onSelectDate && followUpEntries.length > 0 && followUpEntries[0].date) {
      onSelectDate(new Date(followUpEntries[0].date));
    }
  };
  return (
    <li className={styles.CalendarEntry}>
      {followUpEntries.map((followUpEntry, index) => (
        <div key={index}>
          <div className="flex-row">
            <p>
              (<Link to="#" onClick={handleGoToDate}>{formatDate(followUpEntry.date)}</Link>)
            </p>
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
                  <label>Notes:</label>
                  <textarea name="notes" value={editedFollowUpEntry.notes} onChange={handleChange} />
                  <div className="flex-row-right">
                    <Link onClick={() => setIsEditing(false)}>Cancel</Link>
                    <button className="secondary-button" onClick={() => handleSubmitUpdate(followUpEntry._id, editedFollowUpEntry, file, selectedDate, onUpdateEntry, handleDeleteEntry).then(() => setIsEditing(false))}>Save</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.lineContainer}>
                  <hr className="long-line"></hr>
                </div>
                <img className="margin-top margin-bottom" src={followUpEntry.cloudinaryUrl} alt={followUpEntry.name} />
                <div className={styles.EntryFormContainer}>
                  <hr className="long-line"></hr>
                  <label>Notes:</label>
                  <p>{followUpEntry.notes}</p>
                  <hr className="long-line"></hr>
                </div>
                <div className='flex-row-right margin-top margin-bottom'>
                  <Link
                    className={styles.deleteButton}
                    onClick={() => {
                      setIdToDelete(followUpEntry._id);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Link>
                  {showDeleteModal && (
                    <DeleteConfirmationModal
                      isOpen={showDeleteModal}
                      onCancel={() => setShowDeleteModal(false)}
                      onConfirm={async () => {
                        await handleDeleteEntry(followUpEntry._id, onDeleteEntry);
                        setShowDeleteModal(false);
                      }}
                    />
                  )}
                  <button className="primary-button" onClick={() => setIsEditing(true)}>Edit Entry</button>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </li>
  );
};

export default FollowUpEntry;