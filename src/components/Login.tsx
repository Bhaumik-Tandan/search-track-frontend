import React from 'react';

const API_URL = process.env.REACT_APP_API + "/api/v1";

function Login() {
  const handleLoginClick = () => {
    const newURL = API_URL + "/auth/google";
    console.log(newURL);
    window.location.href = newURL;
  };

  return (
    <div>
      <h2>Login</h2>
      <a href="#" onClick={handleLoginClick}>Login with Google</a>
    </div>
  );
}

export default Login;
