import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import styles from '../SliderComponent/Slider.module.scss';
import quotesData from './quotes';

const Slider = () => {
    const [quotes, setQuotes] = useState([]);
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        // Set the quotes from the imported data
        setQuotes(quotesData);
        setCurrentQuoteIndex(Math.floor(Math.random() * quotesData.length)); // Set random initial index
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
                    <p className={styles.quoteAuthor}><strong>- {quotes[currentQuoteIndex].author}</strong></p>
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