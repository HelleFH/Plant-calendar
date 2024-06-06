import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CustomModal from '../CustomModal/CustomModal';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import ImageUpload from '../imageUpload';

const CreateFollowUpEntry = ({ isOpen, onClose, oldEntryID, name, sunlight, water }) => {
    const [file, setFile] = useState(null);
    const [followUpDate, setFollowUpDate] = useState('');
    const [previewSrc, setPreviewSrc] = useState('');
    const [isPreviewAvailable, setIsPreviewAvailable] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const initialEntryState = {
        notes: '',
    };

    const [entry, setEntry] = useState(initialEntryState);

    const createEntry = async () => {
        try {
            const formData = new FormData();
            if (file) formData.append('file', file);
            formData.append('notes', entry.notes);
            formData.append('date', followUpDate);
            formData.append('userID', localStorage.getItem('userId'));
            formData.append('entryID', oldEntryID); // Use entryID here

            await axiosInstance.post('/upload/follow-up', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setFile(null);
            setPreviewSrc('');
            setIsPreviewAvailable(false);
            onClose();
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
        await createEntry();
    };

    const handleInputChange = (event) => {
        setEntry({
            ...entry,
            [event.target.name]: event.target.value,
        });
    };

    const handleClearForm = () => {
        setEntry(initialEntryState);
        setFile(null);
        setPreviewSrc('');
        setIsPreviewAvailable(false);
        setErrorMsg('');
        setFollowUpDate('');
    };

    const handleCancel = () => {
        onClose();
        navigate('/calendar');
    };

    return (
        <CustomModal isOpen={isOpen} onClose={onClose} title="Follow-Up Entry">
            <div>
                <h3>{name}</h3>
                <label>Sunlight:</label>
                <p>{sunlight}</p>
                <hr className="long-line"></hr>
                <label>Water:</label>
                <p>{water}</p>
                <hr className="long-line margin-bottom"></hr>
            </div>

            <Form onSubmit={handleEntrySubmit} encType="multipart/form-data">
                {errorMsg && <p className="errorMsg">{errorMsg}</p>}
                <ImageUpload
                    onDrop={onDrop}
                    file={file}
                    previewSrc={previewSrc}
                    isPreviewAvailable={isPreviewAvailable}
                />
                <div>
                    <div>
                        <label htmlFor="followUpDate">Date</label>
                        <input
                            type="date"
                            id="followUpDate"
                            value={followUpDate}
                            onChange={(e) => setFollowUpDate(e.target.value)}
                        />
                    </div>
                    <div className='form-group margin-bottom'>
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
        </CustomModal>
    );
};

export default CreateFollowUpEntry;