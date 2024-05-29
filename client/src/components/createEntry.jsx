import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import ImageUpload from './ImageUpload';
import SearchPlantAPI from './SearchPlantAPI';

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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
        },
      }}
      contentLabel="Create Entry Modal"
    >
      <span className="close" onClick={onClose}>&times;</span>
      <Form className="search-form" onSubmit={handleEntrySubmit} encType="multipart/form-data">
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <ImageUpload
          onDrop={onDrop}
          file={file}
          previewSrc={previewSrc}
          isPreviewAvailable={isPreviewAvailable}
        />
        <div className='form-container'>
          <div className='flex-row'>
          <div>
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
          <div className=" form-group margin-bottom">
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
          <Link to="/calendar">
            Cancel
          </Link>
          <div>
          <button type="button" className="primary-button" onClick={handleClearForm}>
            Clear Form
          </button>
          <button className="secondary-button" type="submit">
            Submit
          </button>
  
        </div>
        </div>
      </Form>

      <Modal
        isOpen={showSearchPlantModal}
        onRequestClose={() => setShowSearchPlantModal(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
          },
        }}
        contentLabel="Search Plant Modal"
      >
        <span className="close" onClick={() => setShowSearchPlantModal(false)}>&times;</span>
        <SearchPlantAPI onSelectPlant={handleSavePlantName} />
      </Modal>
    </Modal>
  );
};

export default CreateEntryWithFileUpload;
