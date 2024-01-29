import React, { useState, useEffect, ChangeEvent } from 'react';
import SearchResult from '../types/SearchResult';
import DashboardProps from '../types/DashboardProps';

function Dashboard({ user, setUser }: DashboardProps) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    try {
      const url = `/search?page=${currentPage}&limit=10${searchTerm ? `&query=${encodeURIComponent(searchTerm)}` : ''}`;
      const response = await fetch(url, { credentials: 'include' });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data || []);
      } else {
        console.error('Error fetching data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, currentPage, searchTerm]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    setCurrentPage(1); // Reset to the first page when searching
  };

  const onLogout = () => {
    fetch('/auth/logout', { credentials: 'include' })
      .then(() => {
        setUser(null);
        document.cookie = 'customSessionCookieName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      })
      .catch((error) => console.error('Error logging out:', error));
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
          <a href="/auth/google">Login with Google</a>
        </div>
      )}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous Page
        </button>
        <span>Page {currentPage}</span>
        <button onClick={() => setCurrentPage((prev) => prev + 1)}>Next Page</button>
      </div>
    </div>
  );
}

export default Dashboard;
