import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div>
      <div className='modal-backdrop show'></div>
      <div className='modal' tabIndex='-1' role='dialog' style={{ display: 'block' }}>
        <div className='modal-dialog' role='document'>
          <div className='modal-content text-dark'>
            <div className='modal-header'>
              <h5 className='modal-title' id='deleteModalLabel'>
                Confirm Deletion
              </h5>
              <button
                type='button'
                className='btn-close'
                aria-label='Close'
                onClick={onCancel}
              ></button>
            </div>
            <div className='modal-body'>
              Are you sure you want to delete this entry?
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type='button'
                className='btn btn-danger'
                onClick={onConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
