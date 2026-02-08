import React, { useState } from 'react';
import { FaHome, FaBell, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', icon: FaHome, label: 'Home' },
    { id: 'notifications', icon: FaBell, label: 'Alerts' },
    { id: 'profile', icon: FaUser, label: 'Profile' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="navbar navbar-desktop">
        <div className="navbar-brand">
          <span className="brand-icon">✨</span>
          <h1 className="brand-text">Flincky</h1>
        </div>

        <div className="navbar-menu">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              className={`nav-item ${activeTab === id ? 'active' : ''}`}
              onClick={() => handleNavClick(id)}
              aria-label={label}
            >
              <Icon className="nav-icon" />
              <span className="nav-label">{label}</span>
            </button>
          ))}
        </div>

        <div className="navbar-actions">
          <span className="user-badge">@{user?.name || user?.username || 'user'}</span>
          <button type="button" className="btn-logout" onClick={handleLogout} aria-label="Logout">
            <FaSignOutAlt />
          </button>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="navbar navbar-mobile">
        <div className="navbar-brand">
          <span className="brand-icon">✨</span>
          <h1 className="brand-text">F</h1>
        </div>

        <button 
          type="button" 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-user-info">
              <div className="mobile-user-avatar">
                {(user?.name || user?.username || 'user').charAt(0).toUpperCase()}
              </div>
              <span className="mobile-user-name">@{user?.name || user?.username || 'user'}</span>
            </div>
            
            <div className="mobile-nav-items">
              {navItems.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  className={`mobile-nav-item ${activeTab === id ? 'active' : ''}`}
                  onClick={() => handleNavClick(id)}
                  aria-label={label}
                >
                  <Icon className="mobile-nav-icon" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <button type="button" className="mobile-logout-btn" onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
