import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import ImageUpload from '../imageUpload';
import SearchPlantAPI from '../SearchAPIComponent/SearchPlantAPI';
import styles from './CreateEntryComponent.module.scss';
import CustomModal from '../CustomModal/CustomModal';
import axiosInstance from '../axiosInstance';

const CreateEntryWithFileUpload = ({ isOpen, onClose, selectedDate }) => {
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const [showSearchPlantModal, setShowSearchPlantModal] = useState(false);

  const initialEntryState = {
    name: '',
    notes: '',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    sunlight: '',
    water: '',
  };

  const [entry, setEntry] = useState(initialEntryState);

  useEffect(() => {
    if (selectedDate) {
      setEntry((prevEntry) => ({
        ...prevEntry,
        date: selectedDate.toISOString().split('T')[0],
      }));
    }
  }, [selectedDate]);

  const createEntry = async () => {
    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      formData.append('name', entry.name);
      formData.append('notes', entry.notes);
      formData.append('sunlight', entry.sunlight);
      formData.append('water', entry.water);
      
      // Set the time component of the date to midnight
      const selectedDateMidnight = new Date(entry.date);
      selectedDateMidnight.setHours(0, 0, 0, 0);
      
      // Use the midnight date for the form data
      formData.append('date', selectedDateMidnight.toISOString());
  
      formData.append('username', localStorage.getItem('username'));
      formData.append('userID', localStorage.getItem('userId'));
  
      await axiosInstance.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setFile(null);
      setPreviewSrc('');
      setIsPreviewAvailable(false);
      onClose();  // Close the modal after creating the entry
      navigate('/calendar');  // Navigate to the calendar page
    } catch (error) {
      console.error('Error creating entry:', error);
      setErrorMsg('Error creating entry, please try again.');
    }
  };
  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);

    setIsPreviewAvailable(Boolean(uploadedFile.name.match(/\.(jpeg|jpg|png)$/)));
  };

  const handleEntrySubmit = async (e) => {
    e.preventDefault();
    if (!entry.name) {
      setErrorMsg('Name is required');
      return;
    }
    try {
      await createEntry();
    } catch (error) {
      console.error('Error creating entry:', error);
    }
  };

  const handleInputChange = (event) => {
    setEntry({
      ...entry,
      [event.target.name]: event.target.value,
    });
  };

  const handleSavePlantName = (name, sunlight, water) => {
    setEntry({
      ...entry,
      name: name,
      sunlight,
      water,
    });
    setShowSearchPlantModal(false);
  };

  const handleOpenSearchPlantModal = (e) => {
    e.preventDefault();
    setShowSearchPlantModal(true);
  };

  const handleClearForm = () => {
    setEntry(initialEntryState);
    setFile(null);
    setPreviewSrc('');
    setIsPreviewAvailable(false);
    setErrorMsg('');
  };

  const handleCancel = () => {
    onClose();  // Close the CreateEntryWithFileUpload modal
    navigate('/calendar');  // Navigate to the calendar page
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Create Entry">
      <Form onSubmit={handleEntrySubmit} encType="multipart/form-data">
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <ImageUpload
          onDrop={onDrop}
          file={file}
          previewSrc={previewSrc}
          isPreviewAvailable={isPreviewAvailable}
        />
        <div className={styles.formContainer}>
          <div className='flex-row'>
            <div className={styles.nameContainer}>
              <input
                type="text"
                placeholder="Name"
                name="name"
                className="form-control"
                value={entry.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <button
              className="primary-button"
              onClick={handleOpenSearchPlantModal}
            >
              Search Database
            </button>
          </div>
          <div>
            <input
              type="text"
              placeholder="Sunlight"
              name="sunlight"
              className="form-control"
              value={entry.sunlight}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Water"
              name="water"
              className="form-control"
              value={entry.water}
              onChange={handleInputChange}
            />
          </div>
          <div className='form-group'>
          </div>
          <div className="form-group margin-bottom">
            <textarea
              type="text"
              placeholder="Notes"
              name="notes"
              className="form-control width-100"
              value={entry.notes}
              onChange={handleInputChange}
              style={{ height: '150px', verticalAlign: 'top' }}
            />
          </div>
        </div>
        <div className='margin-top flex-row'>
          <Link type="button" onClick={handleCancel}>
            Cancel
          </Link>
          <div className='flex-row-right'>
            <button type="button" className="primary-button" onClick={handleClearForm}>
              Clear Form
            </button>
            <button className="secondary-button" type="submit">
              Submit
            </button>
          </div>
        </div>
      </Form>
      <SearchPlantAPI
        isOpen={showSearchPlantModal}
        onSelectPlant={handleSavePlantName}
        closeModal={() => setShowSearchPlantModal(false)}
      />
    </CustomModal>
  );
};

export default CreateEntryWithFileUpload;