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
    isPreviewAvailable: PropTypes.bool,  // Change to bool
  };
  return (
    <div className="upload-section">
      <div
        className='upload-zone'
        style={{ cursor: 'pointer' }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div>
          <input
            type="file"
            className='margin-top'
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
      </div>

      {previewSrc ? (
        isPreviewAvailable ? (
          <div className="image-preview margin-top">
            <img className="preview-image" style={{maxHeight:'250px', margin:'0 auto'}} src={previewSrc} alt="Preview" />
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