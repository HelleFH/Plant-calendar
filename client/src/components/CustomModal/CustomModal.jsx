import React from 'react';
import Modal from 'react-modal';
import styles from './CustomModal.module.scss';


const CustomModal = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true} 
      className={styles.modalOverlay}
      contentLabel={title}
    >
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h4>{title}</h4>
          <span
            className={styles.modalClose}
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </span>
        </div>
          <hr className="long-line"></hr>
        <div>{children}</div>
      </div>
    </Modal>
  );
};

export default CustomModal;