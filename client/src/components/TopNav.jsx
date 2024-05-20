import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TopNav.css';

const TopNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="topnav">
      <div className="topnav-left">
        <Link to="/" className="topnav-logo">MySite</Link>
      </div>
      <div className="topnav-right">
        <div className={`topnav-links ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={toggleMenu}>Home</Link>
          <Link to="/about" onClick={toggleMenu}>About</Link>
          <Link to="/services" onClick={toggleMenu}>Services</Link>
          <Link to="/contact" onClick={toggleMenu}>Contact</Link>
        </div>
        <div className="topnav-icon" onClick={toggleMenu}>
          <i className="fa fa-bars"></i>
        </div>
      </div>
    </div>
  );
};

export default TopNav;