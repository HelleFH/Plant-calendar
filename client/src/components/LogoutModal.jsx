import React from 'react';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to log out?</p>
        <div className="modal-buttons">
          <button className="primary-button" onClick={onConfirm}>Yes</button>
          <button className="secondary-button" onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;