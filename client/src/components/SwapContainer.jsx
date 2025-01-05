import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
const SwapContainer = () => {
  const [admissionNumber1, setAdmissionNumber1] = useState('');
  const [admissionNumber2, setAdmissionNumber2] = useState('');
  const { Hostel } = useParams(); 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`hostelallotment-production.up.railway.app/api/swapRooms/${Hostel}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        admissionNumber1,
        admissionNumber2,
      }),
      credentials:'include'
    });

    if (response.ok) {
      alert('Rooms swapped successfully');
    } else {
      alert('Failed to swap rooms');
    }
  };

  return (
    <div className="swap-container">
      <h2>SWAP HOSTEL ROOMS</h2>
      <p>Enter the admission numbers of the students whose rooms you want to swap.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="admissionNumber1">Admission Number 1:</label>
          <input
            type="text"
            id="admissionNumber1"
            value={admissionNumber1}
            onChange={(e) => setAdmissionNumber1(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="admissionNumber2">Admission Number 2:</label>
          <input
            type="text"
            id="admissionNumber2"
            value={admissionNumber2}
            onChange={(e) => setAdmissionNumber2(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="swap-submit-btn">Swap Rooms</button>
      </form>
    </div>
  );
};

export default SwapContainer;
