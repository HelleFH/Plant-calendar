import React, { useState, useEffect } from 'react';

const Slider = () => {
    const [quotes, setQuotes] = useState([]);
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const response = await fetch('/data/quotes.json'); // Adjust the path
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
            }, 5000);
        }

        return () => clearInterval(intervalId);
    }, [isPaused, quotes]);

    const togglePause = () => {
        setIsPaused((prevState) => !prevState);
    };

    return (
        <div className="slider">
            {quotes.length > 0 && (
                <div className="quote">{quotes[currentQuoteIndex].quote}</div>
            )}
            <button className="pause" onClick={togglePause}>
                {isPaused ? 'Resume' : 'Pause'}
            </button>
        </div>
    );
};

export default Slider;
