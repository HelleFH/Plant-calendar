import React from 'react';
import { Link } from 'react-router-dom';
import styles from './DeleteConfirmationModal.module.scss';
import CustomModal from '../CustomModal/CustomModal';

const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className={styles.modalOverlay}
      contentLabel="Delete Modal"
      title="Confirm Delete"
    >
     
        <div className='margin-top'>
          Are you sure you want to delete this entry?
        </div>
  
        <div className="flex-row-right margin-top">
          
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
    </CustomModal>
  );
};

export default DeleteConfirmationModal;