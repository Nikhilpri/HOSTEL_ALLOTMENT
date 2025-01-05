import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const TableContainer = () => {
  const { Hostel } = useParams();
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`hostelallotment-production.up.railway.app/upload/${Hostel}`, {
        method: 'POST',
        body: formData,
        credentials:'include'
      });

      if (response.ok) {
        console.log('File uploaded successfully');
        alert('File uploaded successfully');
        setFile(null);
      } else {
        console.error('File upload failed');
        alert('File upload failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="admin-form">
      <h2>Upload Hostel Student List</h2>
      <p>Please select the Excel file containing the student list for the hostel: <strong>{Hostel}</strong></p>
      <form onSubmit={handleSubmit}>
          <div className="admin-row-file-upload">
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              className="file-input"
              onChange={handleFileChange}
            />
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default TableContainer;
