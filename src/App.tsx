import React, { useState, useEffect } from 'react';
import {  ChangeEvent } from 'react';
interface User {
  name: string;
  // Add other user properties as needed
}

interface SearchResult {
  _id: string;
  url: string;
  userId: string;
}


function Dashboard({ user, onLogout }: { user: User | null; onLogout: () => void }) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const fetchData = async () => {
    try {
      const response = await fetch('https://search-track.cyclic.app/api/v1/search', { credentials: 'include' });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data || []); // Add a default value if data?.search is undefined
      } else {
        console.error('Error fetching data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [user]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    // If the search term is empty, show all results
    if (term === '') {
      fetchData(); // Fetch data again to reset the results
    } else {
      // Filter the results based on the search term
      const filteredResults = searchResults.filter(
        (result) =>
          result.url.toLowerCase().includes(term.toLowerCase()) ||
          result.userId.toLowerCase().includes(term.toLowerCase())
      );

      setSearchResults(filteredResults);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <button onClick={onLogout}>Logout</button>
        <input
          type="text"
          placeholder="Search by URL or User ID"
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 mb-4 border border-gray-300 rounded"
        />
  
        {searchResults.map((result) => (
          <div key={result._id}>
            <p>URL: {result.url}</p>
          </div>
        ))}
      </main>
      ) : (
        <div>
          <h2>Login</h2>
          <a href="https://search-track.cyclic.app/api/v1/auth/google">Login with Google</a>
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
        const response = await fetch('https://search-track.cyclic.app/api/v1/auth/me', {
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
    fetch('https://search-track.cyclic.app/api/v1/auth/logout', { credentials: 'include' })
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
