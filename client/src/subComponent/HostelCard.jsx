import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const HostelCard = ({ imageSrc, altText, title }) => {
  const [role, setRole] = useState('');
  const [navigateTo, setNavigateTo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('hostelallotment-production.up.railway.app/api/check-session', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        setRole(data.role);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching role:', err);
        setLoading(false); // Make sure to stop loading in case of error too
      });
  }, []);

  function handleClick(title) {
    if (role === 'user') {
      setNavigateTo(`/Hostel/${title}`);
    } else if (role === 'admin') {
      setNavigateTo(`/admin/${title}`);
    }
  }

  if (navigateTo) {
    return <Navigate to={navigateTo} />;
  }

  return (
    <div className={`hostel-image ${loading ? 'loading' : ''}`} onClick={() => !loading && handleClick(title)}>
      <img src={imageSrc} alt={altText} />
      <p>{title}</p>
    </div>
  );
};

export default HostelCard;
