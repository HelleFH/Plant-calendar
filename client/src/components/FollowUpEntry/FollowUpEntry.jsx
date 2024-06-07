import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ImageUpload from '../imageUpload';
import moment from 'moment';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import handleUpdateFollowUp from '../HandleUpdateFollowUp';
import handleDeleteFollowUp from '../HandleDeleteFollowUp';
import styles from '../FollowUpEntry/FollowUpEntryComponent.module.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';

const FollowUpEntry = ({ entry, onUpdateEntry, onSelectDate, onDeleteEntry, selectedDate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedFollowUpEntry, setEditedFollowUpEntry] = useState(entry);
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(entry.cloudinaryUrl);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

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

  return (
    <li className={styles.CalendarEntry}>
      <div className={styles.FollowUpHeader}>
        <h5 onClick={(e) => {e.preventDefault(); toggleExpand(); }}>{formatDate(entry.date)}</h5>
        <h4>Update for {entry.name}</h4>
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
            <label>Name:</label>
            <input type="text" name="name" value={editedFollowUpEntry.name} onChange={handleChange} />
            <label>Notes:</label>
            <textarea name="notes" value={editedFollowUpEntry.notes} onChange={handleChange} />
           
            <div className="flex-row-right">
              <Link onClick={() => setIsEditing(false)}>Cancel</Link>
              <button className="secondary-button" onClick={() => handleUpdateFollowUp(entry._id, editedFollowUpEntry, file, selectedDate, onUpdateEntry, onDeleteEntry).then(() => setIsEditing(false))}>Save</button>
            </div>
          </div>
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
             
              <hr className="long-line margin-bottom"></hr>
            </div>
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
                  onConfirm={async () => {
                    await handleDeleteFollowUp(entry._id, onDeleteEntry);
                    setShowDeleteModal(false);
                  }}
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