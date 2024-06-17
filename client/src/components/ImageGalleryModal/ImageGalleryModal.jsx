import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa'; // Import FaTimes for close icon
import { useSwipeable } from 'react-swipeable';
import Modal from 'react-modal';
import * as styles from './ImageGalleryModal.module.scss'; // Import all styles

const ImageGalleryModal = ({ isOpen, onClose, urls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0); // Reset index when modal is opened
  }, [isOpen]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? urls.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === urls.length - 1 ? 0 : prevIndex + 1));
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: goToNext,
    onSwipedRight: goToPrevious,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      className={styles.modalOverlay}
      style={{
        overlay: {
          position: 'fixed',
          inset: '0px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          border:'none',
          margin:'0 auto'
        
        },
        content: {
          padding: '0',
          height: 'fit-content',
          width:'99vw',
          position: 'absolute',
          backgroundColor: 'white',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '500px',
          margin: '0 auto',
          borderRadius:'0px'
           // Center horizontally
        },
      }}
    >
      <button
        className={styles.closeButton}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#333',
          zIndex: '1000', 
        }}
        onClick={onClose}
      >
        <FaTimes />
      </button>

      <div className={styles.imageGallery}>
        <button className={`${styles.navBtn} ${styles.leftNav}`} onClick={goToPrevious}>
          <FaChevronLeft />
        </button>
        <div className={styles.imagesContainer} {...swipeHandlers}>
          {urls.length > 0 && (
            <a href={urls[currentIndex]} target="_blank" rel="noopener noreferrer">
              <img
                src={urls[currentIndex]}
                alt={`Image ${currentIndex}`}
                className={styles.image}
              />
            </a>
          )}
        </div>
        <button className={`${styles.navBtn} ${styles.rightNav}`} onClick={goToNext}>
          <FaChevronRight />
        </button>
      </div>

      <div className={styles.thumbnailContainer}>
        {urls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Thumbnail ${index}`}
            className={`${styles.thumbnail} ${index === currentIndex ? styles.activeThumbnail : ''}`}
            onClick={() => handleThumbnailClick(index)}
          />
        ))}
      </div>
    </Modal>
  );
};

export default ImageGalleryModal;