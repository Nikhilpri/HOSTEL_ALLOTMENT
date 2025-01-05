// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';
import { FaUser, FaLock } from 'react-icons/fa';

const Login = ({ setIsAuthenticated ,setIsAuthenticatedStudent}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    fetch('hostelallotment-production.up.railway.app/login-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username:username, password:password }),
      credentials: "include"
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Update the seat status in the UI
          alert("Successfully logged in");
          if(data.role==="admin")
          setIsAuthenticated(true);
          else if(data.role==="user")
          setIsAuthenticatedStudent(true);
        
            navigate("/home-page");

          // Redirect to the desired page or perform other actions
        } else {
          alert('Failed to Log In , Invalid credentials');
          setPassword('');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <h3>FOR STUDENT LOGIN TRY USERNAME BETWEEN 21JE0002 TO 21JE1000 AND PASSWORD AS 12345678</h3>
        <br/>
        <h3>FOR ADMIN LOGIN TRY USERNAME AS ADMIN@ISM AND PASSWORD AS ISM@1234</h3>
      </div>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.logo}></div>
        <h2>Log In!</h2>
        <p>Enter your details to get access</p>
        <div className={styles.inputGroup}>
          <FaUser className="icon" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <FaLock className="icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <button type="submit" className={styles.button}>Log In</button>
        <div className={styles.forgotPassword}>
          {/* <a href="#">Forgot Password?</a> */}
        </div>
      </form>
    </div>
  );
};

export default Login;
