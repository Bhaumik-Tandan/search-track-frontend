import React, { ReactElement, SetStateAction, Dispatch, useEffect, useState } from 'react';
import apiHelper from '../helper/apiHelper';

interface SearchResult {
  _id: string;
  url: string;
}

interface SearchProps {
  user?: { _id?: string };
  setUser: Dispatch<SetStateAction<any>>;
}

function Search({ user, setUser }: SearchProps): ReactElement {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await apiHelper.get('/search');
        setSearchResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <main>
      <button
      onClick={() => {
        setUser(undefined);
        localStorage.clear();
        try {
          apiHelper.get("/auth/logout");
        } catch (e) {
          // Handle any errors during the logout request (optional)
        }
        window.location.reload(); // Refreshes or reloads the browser window
      }}
      
      >
       Logout
      </button>
      {searchResults.map((result) => (
          <div key={result._id}>
            <p>URL: {result.url}</p>
          </div>
        ))}
    </main>
  );
}

export default Search;
