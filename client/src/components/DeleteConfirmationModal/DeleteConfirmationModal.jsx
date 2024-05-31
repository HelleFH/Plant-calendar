import React from 'react';
import { Link } from 'react-router-dom';
import styles from './DeleteConfirmationModalComponent.module.scss';
import Modal from 'react-modal';

const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className={styles.modalOverlay}
      contentLabel="Delete Modal"
    >
      <div className={styles.modalContent}
      >

        <span
        className={styles.modalClose}
          type="button"
          aria-label="Close"
          onClick={onCancel}
        >
          &times;
        </span>
        
        <h3 className="margin-bottom" id="deleteModalLabel">
          Confirm Deletion
        </h3>
        
        <div>
          Are you sure you want to delete this entry?
        </div>
        <div className={`margin-bottom ${styles.lineContainer}`}> 
              <hr className="long-line margin-top" ></hr>
            </div>
        <div className="flex-row-right">
          
          <Link
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Cancel
          </Link>
          <button
            type="button"
            className="secondary-button"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;