// App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Dashboard from './Dashboard';
import Home from './Home';

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:4500/api/v1/auth/me')
      .then((res) => res.json())
      .then((userData) => setUser(userData))
      .catch((error) => console.error('Error fetching user:', error));
  }, []);

  const handleLogin = () => {
    window.location.href = 'http://localhost:4500/api/v1/auth/google';
  };

  const handleLogout = () => {
    fetch('http://localhost:4500/api/v1/auth/logout', { method: 'GET' })
      .then(() => setUser(null))
      .catch((error) => console.error('Error logging out:', error));
  };

  return (
    <Router>
      <div>
        <Switch>
          <Route path="/dashboard">
            <Dashboard user={user} onLogout={handleLogout} />
          </Route>
          <Route path="/">
            <Home user={user} onLogin={handleLogin} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
