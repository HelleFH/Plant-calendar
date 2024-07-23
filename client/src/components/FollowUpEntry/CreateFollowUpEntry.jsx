import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import ImageUpload from '../imageUpload'; // Adjust to handle multiple images
import CustomModal from '../CustomModal/CustomModal';
import axiosInstance from '../axiosInstance';
import styles from './CreateFollowUpEntry.module.scss';

const NewFollowUpEntry = ({ isOpen, onClose, oldEntryID, oldEntryName, oldEntryDate, name, selectedDate, handleAddFollowUpEntry }) => {
  const [files, setFiles] = useState([]); // Array to handle multiple files
  const [previewSrcs, setPreviewSrcs] = useState([]); // Array of previews
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const initialFollowUpState = {
    notes: '',
    date: selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : ''
  };

  const [followUpEntry, setFollowUpEntry] = useState(initialFollowUpState);

  useEffect(() => {
    if (selectedDate) {
      setFollowUpEntry((prevEntry) => ({
        ...prevEntry,
        date: new Date(selectedDate).toISOString().split('T')[0],
      }));
    }
  }, [selectedDate]);

  const createFollowUpEntry = async () => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file)); // Append each file to FormData
      formData.append('name', oldEntryName);
      formData.append('entryDate', oldEntryDate);
      formData.append('notes', followUpEntry.notes);
      formData.append('date', followUpEntry.date);
      formData.append('userID', localStorage.getItem('userId'));
      formData.append('entryID', oldEntryID);

      await axiosInstance.post('/upload/follow-up', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFiles([]);
      setPreviewSrcs([]);
      handleAddFollowUpEntry(followUpEntry, followUpEntry.date);
      resetForm();
      onClose();
      navigate('/calendar');
    } catch (error) {
      console.error('Error creating entry:', error);
      setErrorMsg('Error creating entry, please try again.');
    }
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

  const handleInputChange = (event) => {
    setFollowUpEntry({
      ...followUpEntry,
      [event.target.name]: event.target.value,
    });
  };

  const handleEntrySubmit = async (e) => {
    e.preventDefault();
    if (!followUpEntry.notes) {
      setErrorMsg('Notes are required');
      return;
    }
    await createFollowUpEntry();
  };

  const resetForm = () => {
    setFollowUpEntry(initialFollowUpState);
    setFiles([]);
    setPreviewSrcs([]);
    setErrorMsg('');
  };

  const handleCancel = () => {
    onClose();
    navigate('/calendar');
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Create Follow-Up Entry">
      <Form onSubmit={handleEntrySubmit} encType="multipart/form-data">
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <ImageUpload
          onDrop={onDrop}
          files={files}
          previewSrcs={previewSrcs} // Pass the array of previews
        />
        <div className={styles.formContainer}>
          <div>
            <label htmlFor="followUpDate">Date</label>
            <input
              type="date"
              id="followUpDate"
              name="date"
              value={followUpEntry.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group margin-bottom">
            <textarea
              type="text"
              placeholder="Notes"
              name="notes"
              className="form-control width-100"
              value={followUpEntry.notes}
              onChange={handleInputChange}
              style={{ height: '150px', verticalAlign: 'top' }}
              required
            />
          </div>
        </div>
        <div className='margin-top flex-row'>
          <Link type="button" onClick={handleCancel}>
            Cancel
          </Link>
          <div className='flex-row-right'>
            <button type="button" className="primary-button" onClick={resetForm}>
              Clear Form
            </button>
            <button className="secondary-button" type="submit">
              Submit
            </button>
          </div>
        </div>
      </Form>
    </CustomModal>
  );
};

export default NewFollowUpEntry;
