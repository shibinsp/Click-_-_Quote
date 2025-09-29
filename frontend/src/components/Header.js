import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo">
        <img 
          src="/logo.png" 
          alt="UK Power Networks" 
          className="logo-image"
        />
      </div>
      
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/" className="active">New Application</Link></li>
          <li><Link to="/">New MPAN Request</Link></li>
          <li><Link to="/">Useful Guides</Link></li>
          <li><Link to="/">Contact Us</Link></li>
        </ul>
      </nav>
      
      <div className="header-actions">
        {isAuthenticated ? (
          <div className="user-info">
            <span className="user-email">{userEmail}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate('/login')}>
            Log In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
