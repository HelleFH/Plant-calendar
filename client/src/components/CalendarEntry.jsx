import React, { useState } from 'react';
import axios from 'axios';
import ImageUpload from '../components/ImageUpload';
import handleDeleteEntry from './HandleDeleteEntry';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const CalendarEntry = ({
  entry,
  onUpdateEntry,
  selectedDate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntry, setEditedEntry] = useState(entry);
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(entry.cloudinaryUrl);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Add state for delete modal
  const [idToDelete, setIdToDelete] = useState(null); // Add state for entry id to delete

  const handleChange = (e) => {
    setEditedEntry({ ...editedEntry, [e.target.name]: e.target.value });
  };
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', editedEntry.name);
  formData.append('notes', editedEntry.notes);
  formData.append('sunlight', editedEntry.sunlight);
  formData.append('watering', editedEntry.watering);
  formData.append('username', entry.username);
  formData.append('date', entry.date);

  const handleSubmitUpdate = async () => {
    try {
      // Prepare data for updating the entry
      const data = {
        name: editedEntry.name,
        notes: editedEntry.notes,
        sunlight: editedEntry.sunlight,
        watering: editedEntry.watering,
        // Ensure date is a single value
        date: selectedDate,
        // Ensure username is a string
        username: entry.username.toString(),
      };
  
      // If there's a new file, upload it first
      if (file && entry.cloudinaryUrl) {
        const uploadResponse = await axios.post(`http://localhost:3001/api/v1/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Update cloudinaryUrl in the data
        data.cloudinaryUrl = uploadResponse.data.cloudinaryUrl;
      }
  
      // Send PUT request to update the entry
      const updateResponse = await axios.put(`http://localhost:3001/api/v1/entries/${entry._id}`, data);
  
      // Update the parent component with the new entry data
      onUpdateEntry(data);
  
      // Delete the old entry
      await handleDeleteEntry(entry._id);
    } catch (error) {
      console.error('Error updating entry:', error);
      throw error; // Throw the error for the caller to handle
    }
  };
  
  const onDrop = (acceptedFiles) => {
    const currentFile = acceptedFiles[0];
    setFile(currentFile);

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setPreviewSrc(reader.result);
    });

    reader.readAsDataURL(currentFile);
  };

  return (
    <li>
      {isEditing ? (
        <>
          <ImageUpload
            onDrop={onDrop}
            file={file}
            previewSrc={previewSrc}
            isPreviewAvailable={true}
          />
          <div>
            <label>Name:</label>
            <input type="text" name="name" value={editedEntry.name} onChange={handleChange} />
          </div>
          <div>
            <label>Notes:</label>
            <textarea name="notes" value={editedEntry.notes} onChange={handleChange} />
          </div>
          <div>
            <label>Sunlight:</label>
            <input type="text" name="sunlight" value={editedEntry.sunlight} onChange={handleChange} />
          </div>
          <div>
            <label>Watering:</label>
            <input type="text" name="watering" value={editedEntry.watering} onChange={handleChange} />
          </div>
          <button onClick={handleSubmitUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p>Name: {entry.name}</p>
          <p>Notes: {entry.notes}</p>
          <p>Sunlight: {entry.sunlight}</p>
          <p>Watering: {entry.watering}</p>
          {entry.cloudinaryUrl && <img src={entry.cloudinaryUrl} alt={entry.name} />}
          <button onClick={() => setIsEditing(true)}>Edit Entry</button>
          <button onClick={() => {
            setIdToDelete(entry._id); // Set the id of the entry to be deleted
            setShowDeleteModal(true); // Show delete confirmation modal
          }}>Delete Entry</button>

          {/* Delete confirmation modal */}
          {showDeleteModal && (
            <DeleteConfirmationModal
              isOpen={showDeleteModal}
              onCancel={() => setShowDeleteModal(false)} // Close the modal when canceled
              onConfirm={async () => {
                await handleDeleteEntry(entry._id); // Delete the entry
                setShowDeleteModal(false); // Close the modal after deletion
              }}
            />
          )}
        </>
      )}
    </li>
  );
};

export default CalendarEntry;
