// Dashboard.tsx
import React from 'react';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {user && (
        <>
          <p>Hello, {user.name}!</p>
          <button onClick={onLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default Dashboard;
