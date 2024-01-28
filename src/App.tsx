import React, { useEffect, useState } from 'react';
import apiHelper from './helper/apiHelper';
import Login from './components/Login';
import CONSTANTS from "./constants";

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenParam = urlParams.get(CONSTANTS.TOKEN);
        if (tokenParam) {
          localStorage.setItem(CONSTANTS.TOKEN, tokenParam);

          // Remove token from URL and replace it with localhost:3000
          const newUrl = window.location.href.replace(`?${CONSTANTS.TOKEN}=${tokenParam}`, '');
          window.history.replaceState({}, document.title, newUrl);
        }

        const response = await apiHelper.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return user ? (
    <div>App</div>
  ) : (
    <Login />
  );
}

export default App;
