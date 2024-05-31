import React, { useState, useEffect } from 'react';
import styles from './NavbarComponent.module.scss';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>
        <h1>Calendar</h1>
      </div>
      <div className={`${styles.navbarLinks} ${isOpen ? styles.navbarLinksOpen : ''}`}>
        {username && <div className={styles.username}>Hello, {username}</div>}
        <a href="/logout">Logout</a>
      </div>
      <div className={styles.navbarToggle} onClick={toggleMenu}>
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </div>
    </nav>
  );
};

export default Navbar;