import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
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
      
      <button className="login-btn">Log In</button>
    </header>
  );
};

export default Header;
