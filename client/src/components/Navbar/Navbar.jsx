import React, { useState, useEffect, useRef } from 'react';
import styles from './NavbarComponent.module.scss';
import LogoutConfirmationModal from '../LogoutConfirmationModalComponent/LogoutConfirmationModal';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const navbarRef = useRef(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      try {
        setUsername(JSON.parse(storedUsername));
      } catch (error) {
        setUsername(storedUsername);
      }
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('auth');
    setShowLogoutModal(false);
    navigate("/"); // Redirect to the landing page
  };

  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className={styles.navbar} ref={navbarRef}>
      <div className={styles.navbarLogo}>
        <h1>Calendar</h1>
      </div>
      <div className={`${styles.navbarLinks} ${isOpen ? styles.navbarLinksOpen : ''}`}>
        {username && <div className={styles.username}>Hello, {username}</div>}
        
        <a href="/logout" onClick={handleLogoutClick}>Logout</a>
      </div>
      <div className={styles.navbarToggle} onClick={toggleMenu}>
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </div>

      <LogoutConfirmationModal 
        isOpen={showLogoutModal}
        onCancel={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </nav>
  );
};

export default Navbar;