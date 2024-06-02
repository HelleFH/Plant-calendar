import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LogoutConfirmationModalComponent.module.scss';
import CustomModal from '../CustomModal/CustomModal';

const LogoutConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className={styles.modalOverlay}
      contentLabel="Logout Confirmation Modal"
      title="Confirm Logout"
    >
     
        <div>
          Are you sure you want to logout?
        </div>
        
        


        <div className="flex-row-right margin-top">

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
              Logout
            </button>
          </div>

        </div>

    </CustomModal>
  );
};

export default LogoutConfirmationModal;