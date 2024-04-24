import React from 'react';
import PropTypes from 'prop-types';


const ImageUpload = ({ onDrop, file, previewSrc, isPreviewAvailable }) => {
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    onDrop([selectedFile]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFile = event.dataTransfer.files[0];
    onDrop([droppedFile]);
  };
  ImageUpload.propTypes = {
    onDrop: PropTypes.func.isRequired,
    file: PropTypes.object,
    previewSrc: PropTypes.string,
    isPreviewAvailable: PropTypes.array,  // Change to array
  };

  return (
    <div className="upload-section w-100">
      <div
        className='upload-zone'
        style={{ cursor: 'pointer' }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className='bg-light text-dark mt-2 mb-2 w-75  p-1'>
          <input
            type="file"
            className='text-dark ml-1'
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
      </div>

      {previewSrc ? (
        isPreviewAvailable ? (
          <div className="image-preview">
            <img className="preview-image" src={previewSrc} alt="Preview" />
          </div>
        ) : (
          <div className="preview-message">
            <p>No preview available for this file</p>
          </div>
        )
      ) : (
        <div className="preview-message">
        </div>
      )}
    </div>
  );
};

export default ImageUpload;