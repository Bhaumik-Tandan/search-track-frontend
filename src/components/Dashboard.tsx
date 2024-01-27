// components/Dashboard.js
import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [user, setUser] = useState<any>(null); // Use any as the type

  useEffect(() => {
    // Fetch user data from your backend
    fetch('http://localhost:4500/api/v1/auth/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((error) => console.error('Error fetching user:', error));
  }, []);

  const handleLogout = () => {
    // Perform logout on the backend
    fetch('http://localhost:4500/api/v1/auth/logout', { credentials: 'include' })
      .then(() => setUser(null))
      .catch((error) => console.error('Error logging out:', error));
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Please log in to access the dashboard.</p>
      )}
    </div>
  );
}

export default Dashboard;
