import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import styles from '../SliderComponent/SliderComponent.module.scss';

const Slider = () => {
    const [quotes, setQuotes] = useState([]);
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const response = await fetch('/data/quotes.json'); 
                const data = await response.json();
                setQuotes(data);
                setCurrentQuoteIndex(Math.floor(Math.random() * data.length)); // Set random initial index
            } catch (error) {
                console.error('Error fetching quotes:', error);
            }
        };

        fetchQuotes();
    }, []);

    useEffect(() => {
        let intervalId;

        if (!isPaused && quotes.length > 0) {
            intervalId = setInterval(() => {
                setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
            }, 20000);
        }

        return () => clearInterval(intervalId);
    }, [isPaused, quotes]);

    const togglePause = () => {
        setIsPaused((prevState) => !prevState);
    };

    return (
        <div className={styles.slider}>
            {quotes.length > 0 && (
                <div className={styles.quote}>
                    <p className={styles.quoteText}>{quotes[currentQuoteIndex].quote}</p>
                    <p className={styles.quoteAuthor} ><strong>- {quotes[currentQuoteIndex].author}</strong></p>
                </div>
            )}
            <FontAwesomeIcon
                icon={isPaused ? faPlay : faPause}
                className={styles.pause}
                onClick={togglePause}
            />
        </div>
    );
};

export default Slider;