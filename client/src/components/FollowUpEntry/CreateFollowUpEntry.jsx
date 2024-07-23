import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomModal from '../CustomModal/CustomModal';
import axiosInstance from '../axiosInstance';
import { Form } from 'react-bootstrap';
import ImageUpload from '../imageUpload';
import styles from './CreateFollowUpEntry.module.scss';

const NewFollowUpEntry = ({ isOpen, onClose, oldEntryID, oldEntryName, oldEntryDate, name, selectedDate, handleAddFollowUpEntry }) => {
    const [files, setFiles] = useState([]); // Manage multiple files
    const [followUpDate, setFollowUpDate] = useState('');
    const [previewSrcs, setPreviewSrcs] = useState([]); // Manage multiple previews
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const [followUpEntry, setFollowUpEntry] = useState({
        notes: '',
    });

    useEffect(() => {
        if (selectedDate) {
            const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
            setFollowUpDate(formattedDate);
        }
    }, [selectedDate]);

    const createFollowUpEntry = async () => {
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('images', file); // 'images' matches the Multer field name
            });
            formData.append('name', oldEntryName);
            formData.append('entryDate', oldEntryDate);
            formData.append('notes', followUpEntry.notes);
            formData.append('date', followUpDate);
            formData.append('userID', localStorage.getItem('userId'));
            formData.append('entryID', oldEntryID);

            const response = await axiosInstance.post('/upload/follow-up', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const newFollowUpEntry = response.data;
            handleAddFollowUpEntry(newFollowUpEntry, followUpDate);

            resetForm();
            onClose();
            navigate('/calendar');
        } catch (error) {
            console.error('Error creating entry:', error);
            setErrorMsg('Error creating entry, please try again.');
        }
    };

    const onDrop = (droppedFiles) => {
        setFiles(droppedFiles);

        // Update preview sources
        const filePreviews = droppedFiles.map(file => {
            const reader = new FileReader();
            return new Promise(resolve => {
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(filePreviews).then(previews => {
            setPreviewSrcs(previews);
        });
    };

    const handleEntrySubmit = async (e) => {
        e.preventDefault();
        await createFollowUpEntry();
    };

    const handleInputChange = (event) => {
        setFollowUpEntry({
            ...followUpEntry,
            [event.target.name]: event.target.value,
        });
    };

    const resetForm = () => {
        setFollowUpEntry({
            notes: '',
        });
        setFiles([]);
        setPreviewSrcs([]);
        setErrorMsg('');
        setFollowUpDate('');
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <CustomModal isOpen={isOpen} onClose={onClose} title="Follow-Up Entry">
            <h3>{name}</h3>
            <Form onSubmit={handleEntrySubmit} className={styles.followUpFormContainer} encType="multipart/form-data">
                {errorMsg && <p className="errorMsg">{errorMsg}</p>}
                <ImageUpload
                    onDrop={onDrop}
                    previewSrcs={previewSrcs} // Pass multiple previews
                />
                <div>
                    <label htmlFor="followUpDate">Date</label>
                    <input
                        type="date"
                        id="followUpDate"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        required // Ensure date is provided
                    />
                </div>
                <div className='form-group margin-bottom'>
                    <textarea
                        type="text"
                        placeholder="Notes"
                        name="notes"
                        className="form-control width-100"
                        value={followUpEntry.notes}
                        onChange={handleInputChange}
                        style={{ height: '150px', verticalAlign: 'top' }}
                    />
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
