import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import logoutIcon from '../images/logout.svg';

const Navbar = () => {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const response = await fetch('hostelallotment-production.up.railway.app/api/logout', {
        method: 'GET', // Changed to GET to match your backend route
        credentials: 'include', // Include cookies in the request
      });

      const data = await response.json();
      
      if (data.success) {
        navigate('/login'); // Redirect to login page or homepage after logout
      } else {
        console.error('Failed to logout:', data.message);
        alert('Failed to logout');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during logout');
    }
  };

  return (
    <header>
      <div className="header-content">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="navbar-text">HOSTEL ALLOTMENT</h1>
        <button className="logout-btn" onClick={handleClick}>
          <img src={logoutIcon} alt="LOGOUT" />
          LOGOUT
        </button>
      </div>
    </header>
  );
};

export default Navbar;
