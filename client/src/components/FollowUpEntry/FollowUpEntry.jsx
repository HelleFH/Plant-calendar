import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ImageUpload from '../imageUpload';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import styles from './FollowUpEntry.module.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import handleSubmitUpdateFollowUp from '../HandleSubmitUpdateFollowUp';
import handleDeleteFollowUp from '../HandleDeleteFollowUp';
const FollowUpEntry = ({
  followUpEntry,
  onDeleteFollowUp,
  setRefresh,
  handleUpdateFollowUpEntry,
  onSelectDate,

}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedFollowUpEntry, setEditedFollowUpEntry] = useState({ ...followUpEntry });
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(followUpEntry.cloudinaryUrl);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [selectedDate] = useState(followUpEntry.date);

  const contentRef = useRef(null);

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

  const handleConfirmDelete = async () => {
    await onDeleteFollowUp(idToDelete);
    setShowDeleteModal(false);
    setRefresh((prev) => !prev); // Trigger refresh
  };
  
  const handleGoToDate = (event) => {
    event.preventDefault();
    if (onSelectDate && followUpEntry && followUpEntry.entryDate) {
      onSelectDate(new Date(followUpEntry.entryDate));
    }
  };

  return (
    <li className={styles.CalendarEntry}>
      <div className='flex-row'>
        <h5 onClick={(e) => { e.preventDefault(); toggleExpand(); }}>{formatDate(followUpEntry.date)}</h5>
        <div className='flex-row-center'>
        <h4>Update for {followUpEntry.name}</h4><h6 onClick={handleGoToDate} className={styles.viewEntryLink}value={followUpEntry.entryDate}>(Go to Entry)</h6>
        </div>
        <i
          onClick={toggleExpand}
          className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} ${styles.chevron}`}
        ></i>
      </div>

      <div
        className={`${styles.entryDetails} ${isExpanded ? styles.expanded : ''}`}
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
              file={file}
              previewSrc={previewSrc}
              isPreviewAvailable={true}
            />
            <label>Notes:</label>
            <textarea name="notes" value={editedFollowUpEntry.notes} onChange={handleChange} />
            <div className="flex-row-right">
              <Link onClick={() => setIsEditing(false)}>Cancel</Link>
              <button className="secondary-button" 
                onClick={() => {
                  handleSubmitUpdateFollowUp(followUpEntry._id, followUpEntry.entryID, editedFollowUpEntry, file, selectedDate, handleUpdateFollowUpEntry, handleDeleteFollowUp);
                  setIsEditing(false);
                }}>Save</button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.lineContainer}>
              <hr className="long-line"></hr>
            </div>
            {followUpEntry.cloudinaryUrl && <img className="margin-top margin-bottom" src={followUpEntry.cloudinaryUrl} alt={followUpEntry.name} />}
            <div className={styles.EntryFormContainer}>
              <hr className="long-line"></hr>
              <label>Notes:</label>
              <p>{followUpEntry.notes}</p>
              <hr className="long-line margin-bottom"></hr>
            </div>
            <div className="flex-row-right margin-top margin-bottom">
              <Link
                className={styles.deleteButton}
                onClick={() => {
                  setIdToDelete(followUpEntry._id); // Set idToDelete to entry._id
                  setShowDeleteModal(true);
                }}
              >
                Delete
              </Link>
              {showDeleteModal && (
                <DeleteConfirmationModal
                  onConfirm={handleConfirmDelete}
                  isOpen={showDeleteModal}
                  onCancel={() => setShowDeleteModal(false)}
                />
              )}
              <button className="primary-button" onClick={() => setIsEditing(true)}>Edit Entry</button>
            </div>
          </>
        )}
      </div>
    </li>
  );
};

export default FollowUpEntry;