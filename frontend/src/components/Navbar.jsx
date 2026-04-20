import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiTool } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Parse user from local storage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    toggleMenu();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <NavLink to="/" className="nav-brand">
          <FiTool /> Fix<span>mate</span>
        </NavLink>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <NavLink to="/" className="nav-link" onClick={toggleMenu}>Home</NavLink>
          <NavLink to="/services" className="nav-link" onClick={toggleMenu}>Services</NavLink>
          <NavLink to="/contact" className="nav-link" onClick={toggleMenu}>Contact</NavLink>
          
          {user ? (
            <>
              <NavLink to="/dashboard" className="nav-link" onClick={toggleMenu}>Dashboard</NavLink>
              <NavLink to="/settings" className="nav-link" onClick={toggleMenu}>Settings</NavLink>
              <button className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink to="/auth" className="btn btn-primary" onClick={toggleMenu}>Login</NavLink>
          )}
        </div>

        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
