import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ImageUpload from '../imageUpload';
import moment from 'moment';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import handleSubmitUpdate from '../HandleSubmitUpdate';
import handleDeleteEntry from '../HandleDeleteEntry';
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
      <div>
        <div className="flex-row">
   
            <p to="#" onClick={(e) => {e.preventDefault(); toggleExpand(); }}>{formatDate(entry.date)}</p>
   
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
                <button
                  className="secondary-button"
                  onClick={() =>
                    handleSubmitUpdate(entry._id, editedFollowUpEntry, file, selectedDate, onUpdateEntry, onDeleteEntry).then(() => setIsEditing(false))
                  }
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.lineContainer}>
                <hr className="long-line"></hr>
              </div>
              <img className="margin-top margin-bottom" src={entry.cloudinaryUrl} alt={entry.name} />
              <div className={styles.EntryFormContainer}>
                <hr className="long-line"></hr>
                <label>Notes:</label>
                <p>{entry.notes}</p>
                <hr className="long-line"></hr>
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
                      await handleDeleteEntry(entry._id, onDeleteEntry);
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
    </li>
  );
};

export default FollowUpEntry;