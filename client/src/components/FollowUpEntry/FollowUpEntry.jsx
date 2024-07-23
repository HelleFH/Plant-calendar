import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ImageUpload from '../imageUpload';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import styles from './FollowUpEntry.module.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import handleSubmitUpdateFollowUp from '../../Utils/HandleSubmitUpdateFollowUp';
import { handleDeleteFollowUpById } from '../../Utils/HandleDeleteFollowUp';
import ViewEntryModal from '../ViewEntryModal/ViewEntryModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';

const FollowUpEntry = ({
  followUpEntry = {},
  onDeleteFollowUp,
  setRefresh,
  handleUpdateFollowUpEntry,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedFollowUpEntry, setEditedFollowUpEntry] = useState({ ...followUpEntry });
  const [files, setFiles] = useState([]); // Manage multiple files
  const [previewSrcs, setPreviewSrcs] = useState(followUpEntry.cloudinaryUrl ? [followUpEntry.cloudinaryUrl] : []); // Initialize with existing URL
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [selectedDate] = useState(followUpEntry.date);
  const [isViewEntryModalOpen, setIsViewEntryModalOpen] = useState(false);
  const [isTextOptionVisible, setIsTextOptionVisible] = useState(false);

  const contentRef = useRef(null);

  const handleChange = (e) => {
    setEditedFollowUpEntry({ ...editedFollowUpEntry, [e.target.name]: e.target.value });
  };

  const onDrop = (acceptedFiles) => {
    // Update files and preview sources
    const updatedFiles = [...files, ...acceptedFiles];
    setFiles(updatedFiles);

    // Generate previews for new files
    const filePreviews = acceptedFiles.map(file => {
      const reader = new FileReader();
      return new Promise(resolve => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePreviews).then(previews => {
      setPreviewSrcs([...previewSrcs, ...previews]);
    });
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
    setRefresh(prev => !prev); // Trigger refresh
  };

  const handleViewEntryClick = () => {
    setIsViewEntryModalOpen(true);
    setIsTextOptionVisible(false);
  };

  const toggleVisibility = () => {
    setIsTextOptionVisible(!isTextOptionVisible);
  };

  const handleCloseModal = () => {
    setIsViewEntryModalOpen(false);
  };

  return (
    <li className={styles.CalendarEntry}>
      <div className='flex-row'>
        <h5 onClick={(e) => { e.preventDefault(); toggleExpand(); }}>{formatDate(followUpEntry.date)}</h5>
        <h4>Update for {followUpEntry.name}</h4>
        <FontAwesomeIcon
          onClick={toggleVisibility}
          icon={faEllipsisH}
          className={styles.iconLink}
          style={{ cursor: 'pointer' }}
        />
        {isTextOptionVisible && (
          <button onClick={handleViewEntryClick} className={styles.textButton}>
            View main entry
          </button>
        )}
        <h6>{followUpEntry.entryDate}</h6>

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
              files={files} // Pass multiple files
              previewSrcs={previewSrcs} // Pass multiple previews
              isPreviewAvailable={true}
            />
            <label>Notes:</label>
            <textarea name="notes" value={editedFollowUpEntry.notes} onChange={handleChange} />
            <div className="flex-row-right">
              <Link onClick={() => setIsEditing(false)}>Cancel</Link>
              <button className="secondary-button"
                onClick={() => {
                  handleSubmitUpdateFollowUp(followUpEntry._id, followUpEntry.entryID, followUpEntry.name, followUpEntry.entryDate, editedFollowUpEntry, files, selectedDate, handleUpdateFollowUpEntry, handleDeleteFollowUpById, setRefresh);
                  setIsEditing(false);
                }}>Save</button>
            </div>
          </div>
        ) : (
          <>
            <hr className="long-line"></hr>
            {followUpEntry.cloudinaryUrl && (
              <img className="margin-top margin-bottom" src={followUpEntry.cloudinaryUrl} alt={followUpEntry.name} />
            )}
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
            <ViewEntryModal
              isOpen={isViewEntryModalOpen}
              onClose={handleCloseModal}
              entryID={followUpEntry.entryID} // Pass entryID to fetch specific details
            />
          </>
        )}
      </div>
    </li>
  );
};

export default FollowUpEntry;