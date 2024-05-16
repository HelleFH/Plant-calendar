import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchPlantAPI from './SearchPlantAPI'; // Import the SearchPlantAPI component
import Modal from 'react-modal';
import ImageUpload from './ImageUpload'; // Import Modal from react-modal

// Set app element to prevent accessibility issue

const CreateEntryWithFileUpload = ({ selectedDate }) => {
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // State for controlling the modal visibility

  const [entry, setEntry] = useState({
    name: '',
    notes: '',
    date: selectedDate,
    plantName: '', // Add plantName to entry state
    sunlight: '', // Add plantName to entry state
    watering: '', // Add plantName to entry state


  });

  const createEntry = async () => {
    try {
      // Check if a file is selected
      if (!file) {
        // If no file is selected, set error message and proceed without uploading image
        setErrorMsg('');
      } else {
        // If a file is selected, proceed with image upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', entry.name);
        formData.append('notes', entry.notes);
        formData.append('sunlight', entry.sunlight);
        formData.append('watering', entry.watering);
        formData.append('date', entry.date); // Include the date field
        formData.append('username', localStorage.getItem('username')); // Include the username from local storage
    
        await axios.post(`http://localhost:3001/api/v1/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
  
      // Reset form state and navigate to home page
      setFile(null);
      setPreviewSrc('');
      setIsPreviewAvailable(false);
      navigate('/calendar');
    } catch (error) {
      console.error('Error creating entry:', error);
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

  const handleSavePlantName = (name, sunlight, watering) => {
    setEntry({
      ...entry,
      name: name, // Add the selected plant name to the entry
      sunlight: sunlight, // Save the selected plant sunlight in the entry
      watering: watering, // Save the selected plant watering in the entry
    });

 
  };
  const handleOpenModal = (e) => {
    e.preventDefault(); // Prevent form submission
    setShowModal(true); // Open the modal
  };
  return (
    <>
      {/* Modal component */}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
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
            width: '50%', // Adjust width as needed
          },
        }}
        contentLabel="Search Modal"
      >
        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
        <SearchPlantAPI onSelectPlant={() => {}} setShowModal={setShowModal} savePlantName={handleSavePlantName} />
      </Modal>

      <Link to='/calendar'>
        <button className='button mt-3 mb-3 btn btn-outline-warning float-right'>
          Back
        </button>
      </Link>
      <Form className="search-form" onSubmit={handleEntrySubmit} encType="multipart/form-data">
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <ImageUpload
          onDrop={onDrop}
          file={file}
          previewSrc={previewSrc}
          isPreviewAvailable={isPreviewAvailable}
        />
        <div className='form-container'>
          {/* Entry form inputs */}
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              name="name"
              className="form-control"
              value={entry.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Sunlight"
              name="sunlight"
              className="form-control"
              value={entry.sunlight}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Watering"
              name="watering"
              className="form-control"
              value={entry.watering}
              onChange={handleInputChange}
            />
          </div>
          {/* Button to open the modal */}
          <div className='form-group'>
          <button
            className="mt-2 btn btn-primary"
            onClick={handleOpenModal}
          >
            Search Database
          </button>
          </div>
          <div className="form-group">
            <textarea
              type="text"
              placeholder="Notes"
              name="notes"
              className="form-control"
              value={entry.notes}
              onChange={handleInputChange}
              style={{ height: '150px', verticalAlign: 'top' }}
            />
          </div>
          
        </div>
        <div className='d-flex w-100 float-right justify-content-end gap-2'>
          <Link to="/calendar" className="mt-4 mb-4 w-25 button button--blue">
            Cancel
          </Link>
          <button className="mt-4 mb-4 w-25 button button--orange" type="submit">
            Submit
          </button>
        </div>
      </Form>
    </>
  );
};

export default CreateEntryWithFileUpload;
