import React, { useEffect, useState } from 'react'
import User from './types/User';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
function App() {
    const [user,setUser]=useState<User|null>(null);

    useEffect(()=>{
       (async () => {
        try {
            const response = await fetch('/auth/me', {
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
          })();

    },[])
  return user?(
   <Dashboard user={user} setUser={setUser}/>
  ):(
    <Login/>
  )

}

export default App;