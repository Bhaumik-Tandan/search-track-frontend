// Home.tsx
import React from 'react';

interface HomeProps {
  user: any;
  onLogin: () => void;
}

const Home: React.FC<HomeProps> = ({ user, onLogin }) => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {user ? (
        <p>Hello, {user.name}!</p>
      ) : (
        <button onClick={onLogin}>Login with Google</button>
      )}
    </div>
  );
};

export default Home;
