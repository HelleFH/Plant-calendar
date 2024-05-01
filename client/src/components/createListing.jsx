import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ImageUpload from './imageUpload';
import axios from 'axios';

const CreateListingWithFileUpload = ({ selectedDate }) => {
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const [listing, setListing] = useState({
    title: '',
    description: '',
    location: '',
    date: selectedDate,
  });
  const createListing = async () => {
    try {
      if (!file) {
        setErrorMsg('Please select a file to add.');
        return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', listing.title);
      formData.append('description', listing.description);
      formData.append('location', listing.location);
      formData.append('date', listing.date); // Include the date field
      formData.append('username', localStorage.getItem('username')); // Include the username from local storage
  
      await axios.post(`http://localhost:3001/api/v1/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Reset form state and navigate to home page
      setFile(null);
      setPreviewSrc('');
      setIsPreviewAvailable(false);
      navigate('/');
    } catch (error) {
      throw error; // Throw the error for the caller to handle
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
  
  
  const handleListingSubmit = async (e) => {
    e.preventDefault();
    try {
      await createListing();
    } catch (error) {
      // Handle error
      console.error('Error creating listing:', error);
    }
  };

  const handleInputChange = (event) => {
    setListing({
      ...listing,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <Link to='/'>
        <button className='button mt-3 mb-3 btn btn-outline-warning float-right'>
          Back to Listings
        </button>
      </Link>
      <Form className="search-form" onSubmit={handleListingSubmit} encType="multipart/form-data">
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <ImageUpload
          onDrop={onDrop}
          file={file}
          previewSrc={previewSrc}
          isPreviewAvailable={isPreviewAvailable}
        />
        <div className='form-container'>
          {/* Listing form inputs */}
          <div className="form-group">
            <input
              type="text"
              placeholder="Title"
              name="title"
              className="form-control"
              value={listing.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <textarea
              type="text"
              placeholder="Description"
              name="description"
              className="form-control"
              value={listing.description}
              onChange={handleInputChange}
              style={{ height: '150px', verticalAlign: 'top' }}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Location"
              name="location"
              className="form-control"
              value={listing.location}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className='d-flex w-100 float-right justify-content-end gap-2'>
          <Link to="/" className="mt-4 mb-4 w-25 button button--blue">
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

export default CreateListingWithFileUpload;
