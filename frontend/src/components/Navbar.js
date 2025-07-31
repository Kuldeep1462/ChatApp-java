import React from 'react';
import '../style/navbar.css';

function Navbar({ user }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15.5C21 16.3284 20.3284 17 19.5 17H7L3 21V4.5C3 3.67157 3.67157 3 4.5 3H19.5C20.3284 3 21 3.67157 21 4.5V15.5Z" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#3B0764"/>
          </svg>
          <span className="navbar-title">ChatBOT</span>
        </span>
      </div>
      <div className="navbar-center">
        <button className="navbar-link active" type="button">Chat</button>
      </div>
      <div className="navbar-right">
        {user && (
          <div className="navbar-userid">
            Your ID: <span className="navbar-userid-value">{user.userId}</span>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 