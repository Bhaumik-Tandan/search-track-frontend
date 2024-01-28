import React, { useState, useEffect } from 'react';

interface User {
  name: string;
  // Add other user properties as needed
}

function Dashboard({ user, onLogout }: { user: User | null; onLogout: () => void }) {
  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={onLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Login</h2>
          <a href="http://localhost:4500/api/v1/auth/google">Login with Google</a>
        </div>
      )}
    </div>
  );
}


function AuthApp() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:4500/api/v1/auth/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const data: User = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = () => {
    fetch('http://localhost:4500/api/v1/auth/logout', { credentials: 'include' })
      .then(() => {
        setUser(null);
        document.cookie = 'yourAuthCookieName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      })
      .catch((error) => console.error('Error logging out:', error));
  };

  return (
    <div>
      <div>
        <Dashboard user={user} onLogout={handleLogout} />
      </div>
    </div>
  );
}

export default AuthApp;
