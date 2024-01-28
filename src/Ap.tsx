import React, { useState, useEffect } from 'react';

interface User {
  name: string;
  // Add other user properties as needed
}

interface SearchResult {
  _id: string;
  url: string;
  userId: string;
}

const handleFetchError = (error: Error) => {
  console.error('Error fetching data:', error);
};

const fetchWithToken = async (url: string, options?: RequestInit): Promise<Response> => {
  const token = localStorage.getItem('token');
  const headers = {
    ...options?.headers,
    Authorization: token ? `Bearer ${token}` : '',
  };
  const requestOptions: RequestInit = {
    ...options,
    headers,
  };
  return await fetch(url, requestOptions);
};

function Dashboard({ user, onLogout }: { user: User | null; onLogout: () => void }) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const tokenQueryParamName = 'yourTokenQueryParamName'; // Replace with your actual query parameter name
  const localStorageKey = 'yourLocalStorageKey'; // Replace with your actual local storage key

  const getTokenFromQueryParam = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get(tokenQueryParamName);
  };

  const storeTokenInLocalStorage = (token: string) => {
    localStorage.setItem(localStorageKey, token);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getTokenFromQueryParam();
      
      if (!token) {
        // Handle the case when the token is not present or invalid
        // You can redirect the user to the login page or take appropriate action
        console.error('Token not found in the query parameter');
        return;
      }

      storeTokenInLocalStorage(token);

      const response = await fetchWithToken('/search', {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data || []);
      } else {
        handleFetchError(new Error(response.statusText));
      }
    } catch (error:any) {
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term === '') {
      fetchData();
    } else {
      try {
        const token = getTokenFromQueryParam();
        const response = await fetchWithToken(`/search?term=${term}`, {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSearchResults(data || []);
        } else {
          handleFetchError(new Error(response.statusText));
        }
      } catch (error:any) {
        handleFetchError(error);
      }
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
          {loading ? (
            <p>Loading...</p>
          ) : (
            searchResults.map((result) => (
              <div key={result._id}>
                <p>URL: {result.url}</p>
              </div>
            ))
          )}
        </main>
      ) : (
        <div>
          <h2>Login</h2>
          <a href="/auth/google">Login with Google</a>
        </div>
      )}
    </div>
  );
}


function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetchWithToken('/auth/me', {
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
    fetchWithToken('/auth/logout', { credentials: 'include' })
      .then(() => {
        setUser(null);
        localStorage.removeItem('token');
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

export default App;
