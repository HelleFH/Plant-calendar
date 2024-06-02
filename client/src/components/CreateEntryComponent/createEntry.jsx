import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import ImageUpload from '../ImageUpload';
import SearchPlantAPI from '../SearchAPIComponent/SearchPlantAPI';
import styles from './CreateEntryComponent.module.scss';
import CustomModal from '../CustomModal/CustomModal';

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
    date: selectedDate,
    sunlight: '',
    water: '',
  };

  const [entry, setEntry] = useState(initialEntryState);

  const createEntry = async () => {
    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      formData.append('name', entry.name);
      formData.append('notes', entry.notes);
      formData.append('sunlight', entry.sunlight);
      formData.append('water', entry.water);
      formData.append('date', entry.date);
      formData.append('username', localStorage.getItem('username'));

      await axios.post(`http://localhost:3001/api/v1/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFile(null);
      setPreviewSrc('');
      setIsPreviewAvailable(false);
      navigate('/calendar');
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
    <Form className="search-form" onSubmit={handleEntrySubmit} encType="multipart/form-data">
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
