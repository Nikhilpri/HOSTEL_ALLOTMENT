import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useParams } from 'react-router-dom';

const AllotedContainer = () => {
  const [loading, setLoading] = useState(false);
  const { Hostel } = useParams(); 
  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(`hostelallotment-production.up.railway.app/api/download/${Hostel}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'students.xlsx');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        console.error('Failed to download file');
        alert('Failed to download file');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during file download');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="alloted-container">
      <button onClick={handleDownload} className="download-btn">
        Download Alloted List
      </button>
      {loading && (
        <div className="loader-container">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      )}
    </div>
  );
};

export default AllotedContainer;
