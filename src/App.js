import React from 'react';
import { PlaidLink } from 'react-plaid-link';
import axios from 'axios';
import { useState, useEffect } from 'react';

function App() {
  const [linkToken, setLinktoken] = useState();
  useEffect(async () => {
    const response = await axios.post('http://localhost:4090/create_link_token');
    setLinktoken(response.data);
  }, []);
  const handleOnSuccess = async (public_token, metadata) => {
    // send token to client server
    var data = {
      public_token: public_token,
    };
    var response = await axios.post('/exchange_public_token', data);
    console.log(response);
    //to do set accessToken into sessionStorage then move onto UI calls in other components.
    sessionStorage.setItem('accessToken', response.data['access_token']);
  };
  return (
    <div>
      {linkToken ? (
        <PlaidLink token={linkToken.toString()} env='development' onSuccess={handleOnSuccess}>
          Connect Bank Account
        </PlaidLink>
      ) : null}
    </div>
  );
}

export default App;
