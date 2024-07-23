import React from 'react';
import PropTypes from 'prop-types';

const ImageUpload = ({ onDrop, previewSrcs }) => {
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    onDrop(selectedFiles);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFiles = Array.from(event.dataTransfer.files);
    onDrop(droppedFiles);
  };

  return (
    <div className="upload-section">
      <div
        className='upload-zone'
        style={{ cursor: 'pointer' }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className='margin-top'
          onChange={handleFileChange}
          accept="image/*"
          multiple
        />
      </div>

      {previewSrcs.length > 0 ? (
        <div className="image-preview-container margin-top">
          {previewSrcs.map((src, index) => (
            <div key={index} className="image-preview">
              <img className="preview-image" style={{maxHeight:'250px', margin:'0 auto'}} src={src} alt={`Preview ${index}`} />
            </div>
          ))}
        </div>
      ) : (
        <div className="preview-message">
          <p>No previews available</p>
        </div>
      )}
    </div>
  );
};

ImageUpload.propTypes = {
  onDrop: PropTypes.func.isRequired,
  previewSrcs: PropTypes.arrayOf(PropTypes.string),
};

export default ImageUpload;
