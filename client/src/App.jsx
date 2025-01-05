import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Navbar';
import HomePage from "./pages/HomePage";
import Login from './pages/Login';
import SeatSelection from './pages/SeatSelection';
import AdminHome from './pages/AdminHome';
import NotFound from './pages/NotFound';
import Seat from './components/Seat';

const LayoutWithHeader = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
  </>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticatedStudent, setIsAuthenticatedStudent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('hostelallotment-production.up.railway.app/api/check-session', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        if(data.role==='admin'){
          setIsAuthenticated(data.isAuthenticated);
        }
        else if(data.role==='student'){
          setIsAuthenticatedStudent(data.isAuthenticated);
        }
        
        setIsLoading(false); // Set loading to false after checking the session
      });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>; // Or any loading indicator you prefer
  }
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated}
      setIsAuthenticatedStudent={setIsAuthenticatedStudent} />} />
        <Route
          path="/Hostel/:Hostel"
          element={
            isAuthenticated||isAuthenticatedStudent ? <LayoutWithHeader><SeatSelection /></LayoutWithHeader> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin/:Hostel"
          element={
            isAuthenticated ? <LayoutWithHeader><AdminHome /></LayoutWithHeader> : <Navigate to="/login" />
          }
        />
        <Route
          path="/home-page"
          element={
            isAuthenticated ||isAuthenticatedStudent ? <LayoutWithHeader><HomePage /></LayoutWithHeader> : <Navigate to="/login" />
          }
        />
        <Route path="/" element={<Navigate to={isAuthenticated ||isAuthenticatedStudent? "/home-page" : "/login"} />} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
      </Routes>
    </Router>
  );
}

export default App;
