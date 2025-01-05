import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import EditRow from '../subComponent/EditRow.jsx';

const FetchStudents = () => {
  const { Hostel } = useParams(); // Extract the hostel name from the URL
  const [students, setStudents] = useState([]);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await fetch(`hostelallotment-production.up.railway.app/api/students/${Hostel}`, {credentials:'include'});
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }, [Hostel]); // Dependency array includes Hostel

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]); // Dependency array includes fetchStudents

  return (
    <div className='edit-container'>
      <table>
        <thead>
          <tr>
            <th>Room</th>
            <th>Admission No</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <EditRow
              key={index}
              currentRoom={student.room_number}
              admissionNumber={(student.student_alloted=="NA")?"Vacant":student.student_alloted}
              fetchStudents={fetchStudents} // Pass the function as a prop
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FetchStudents;
