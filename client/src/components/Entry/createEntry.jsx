import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import ImageUpload from '../imageUpload';
import styles from './CreateEntry.module.scss';
import CustomModal from '../CustomModal/CustomModal';
import axiosInstance from '../axiosInstance';

const CreateEntryWithFileUpload = ({ isOpen, onClose, selectedDate, setRefresh }) => {
  const [files, setFiles] = useState([]);
  const [previewSrcs, setPreviewSrcs] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const [showSearchPlantModal, setShowSearchPlantModal] = useState(false);

  // Function to format date to YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Initialize entry state with selectedDate if provided
  const [entry, setEntry] = useState({
    name: '',
    notes: '',
    date: selectedDate ? formatDate(selectedDate) : '',
    sunlight: '',
    water: '',
  });

  useEffect(() => {
    // Update entry.date if selectedDate changes
    if (selectedDate) {
      setEntry((prevEntry) => ({
        ...prevEntry,
        date: formatDate(selectedDate),
      }));
    }
  }, [selectedDate]);

  const createEntry = async () => {
  try {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    formData.append('name', entry.name);
    formData.append('notes', entry.notes);
    formData.append('sunlight', entry.sunlight);
    formData.append('water', entry.water);
    formData.append('date', entry.date); // Ensure the date is correctly formatted
    formData.append('username', localStorage.getItem('username'));
    formData.append('userID', localStorage.getItem('userId'));

    await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    setFiles([]);
    setPreviewSrcs([]);
    onCloseAndNavigate();
    setRefresh(prev => !prev);

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
    setFiles(prevFiles => [...prevFiles, ...newFiles]);

    const newPreviews = newFiles.map(file => {
      const fileReader = new FileReader();
      return new Promise(resolve => {
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.readAsDataURL(file);
      });
    });

    Promise.all(newPreviews).then(previews => {
      setPreviewSrcs(prevSrcs => [...prevSrcs, ...previews]);
    });
  };

  const handleEntrySubmit = async (e) => {
    e.preventDefault();
    if (!entry.name) {
      setErrorMsg('Name is required');
      return;
    }
    await createEntry();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEntry(prevEntry => ({
      ...prevEntry,
      [name]: value,
    }));
  };

  const handleSavePlantName = (name, sunlight, water) => {
    setEntry(prevEntry => ({
      ...prevEntry,
      name: name,
      sunlight,
      water,
    }));
    setShowSearchPlantModal(false);
  };

  const handleOpenSearchPlantModal = (e) => {
    e.preventDefault();
    setShowSearchPlantModal(true);
  };

  const handleClearForm = () => {
    setEntry({
      name: '',
      notes: '',
      date: selectedDate ? formatDate(selectedDate) : '',
      sunlight: '',
      water: '',
    });
    setFiles([]);
    setPreviewSrcs([]);
    setErrorMsg('');
  };

  const handleCancel = () => {
    onClose();
    navigate('/calendar');
  };

  const handleDelete = (index) => {
    setPreviewSrcs(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Create Entry">
      <Form onSubmit={handleEntrySubmit} encType="multipart/form-data">
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <ImageUpload
          onDelete={handleDelete}
          onDrop={onDrop}
          files={files}
          previewSrcs={previewSrcs}
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
          <div>
            <label htmlFor="entryDate">Date</label>
            <input
              type="date"
              id="entryDate"
              name="date"
              value={entry.date}
              onChange={handleInputChange}
              required
            />
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
        </div>
      </Form>
    </CustomModal>
  );
};

export default CreateEntryWithFileUpload;
