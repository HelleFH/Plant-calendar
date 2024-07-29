import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import ImageUpload from '../imageUpload'; // Adjust to handle multiple images
import SearchPlantAPI from '../SearchAPI/SearchPlantAPI';
import styles from './CreateEntry.module.scss';
import CustomModal from '../CustomModal/CustomModal';
import axiosInstance from '../axiosInstance';
import handleDeleteImage from '../../Utils/HandleDeleteImage';

const CreateEntryWithFileUpload = ({ isOpen, onClose, selectedDate, setRefresh }) => {
  const [files, setFiles] = useState([]); // Array to handle multiple files
  const [previewSrcs, setPreviewSrcs] = useState([]); // Array of previews
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
      files.forEach((file) => formData.append('images', file)); // Append each file to FormData
      formData.append('name', entry.name);
      formData.append('notes', entry.notes);
      formData.append('sunlight', entry.sunlight);
      formData.append('water', entry.water);
  
      const selectedDateMidnight = new Date(entry.date);
      selectedDateMidnight.setHours(0, 0, 0, 0);
  
      formData.append('date', selectedDateMidnight.toISOString());
      formData.append('username', localStorage.getItem('username'));
      formData.append('userID', localStorage.getItem('userId'));
  
      await axiosInstance.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Clear state
      setFiles([]);
      setPreviewSrcs([]);
      onCloseAndNavigate();
      setRefresh((prev) => !prev);
  
    } catch (error) {
      console.error('Error creating entry:', error);
      setErrorMsg('Error creating entry, please try again.');
    }
  };

  const onCloseAndNavigate = () => {
    onClose();
    navigate('/calendar');
  };

  const onDrop = (droppedFiles) => {
    const newFiles = Array.from(droppedFiles);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    const newPreviews = newFiles.map(file => {
      const fileReader = new FileReader();
      return new Promise(resolve => {
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.readAsDataURL(file);
      });
    });

    Promise.all(newPreviews).then(previews => {
      setPreviewSrcs((prevSrcs) => [...prevSrcs, ...previews]);
    });
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
    setFiles([]);
    setPreviewSrcs([]);
    setErrorMsg('');
  };

  const handleCancel = () => {
    onClose();
    navigate('/calendar');
  };
  const handleDelete = (index) => {
    setPreviewSrcs(prevPreviews =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Create Entry">
      <Form onSubmit={handleEntrySubmit} encType="multipart/form-data">
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <ImageUpload
                onDelete={handleDelete}

          onDrop={onDrop}
          files={files}
          previewSrcs={previewSrcs} // Pass the array of previews
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
