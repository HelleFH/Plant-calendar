import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem('auth');
    if (token) {
      // If the user is logged in, redirect to the calendar page
      navigate('/calendar');
    }
  }, [navigate]);

  return (
    <div className='landing-main'>
      <h1>Landing Page</h1>
      <p>Hello and welcome!</p>
      <Link className="primary-button" to="/login">Login</Link>
      <Link className="secondary-button" to="/register">Register</Link>
    </div>
  );
};

export default Landing;
