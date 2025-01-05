import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
const EditRow = ({ admissionNumber, currentRoom, fetchStudents }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newAdmissionNumber, setNewAdmissionNumber] = useState(admissionNumber);
  const { Hostel } = useParams(); 
  const handleEditClick = async () => {
    if (isEditing) {
      try {
        const response = await fetch(`hostelallotment-production.up.railway.app/api/updateRoom/${Hostel}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newAdmissionNumber,
            roomNumber: currentRoom,
          }),
          credentials:'include'
        });

        if (response.ok) {
          alert("Update successful. Refreshing data...");
          await fetchStudents(); // Refresh student data after a successful update
        } else {
          throw new Error('Failed to update admission number');
        }
      } catch (error) {
        alert("Failed to update admission number");
        console.error(error);
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <tr>
      <td>{currentRoom}</td>
      <td>
        {isEditing ? (
          <input
            type="text"
            value={newAdmissionNumber}
            onChange={(e) => setNewAdmissionNumber(e.target.value)}
          />
        ) : (
          admissionNumber
        )}
      </td>
      <td>
        <button onClick={handleEditClick}>
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </td>
    </tr>
  );
};

export default EditRow;
