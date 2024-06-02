import React from 'react';
import Modal from 'react-modal';
import styles from './CustomModalComponent.module.scss';

const CustomModal = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true} // Enable closing when clicking outside
      className={styles.modalOverlay}
      contentLabel={title}
    >
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <span
            className={styles.modalClose}
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </span>
        </div>
        <div className={styles.lineContainer}>
          <hr className="long-line"></hr>
        </div>
        <div>{children}</div>
      </div>
    </Modal>
  );
};

export default CustomModal;