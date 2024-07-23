import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { useSwipeable } from 'react-swipeable';
import Modal from 'react-modal';
import styles from './ImageGalleryModal.module.scss';

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
        },
        content: {
          padding: '0',
          width: '90vw',
          maxWidth: '800px',
          margin: '0 auto',
          borderRadius: '10px',
        },
      }}
    >
      <button
        className={styles.closeButton}
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
