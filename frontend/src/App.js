import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // State to store the message
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);  // For loading state
  const [error, setError] = useState(null);      // For error state

  // Fetch data from Flask API
  useEffect(() => {
    axios.get('http://127.0.0.1:5000')  // Flask API URL
      .then(response => {
        setMessage(response.data.message);  // Set the message in state
        setLoading(false);  // Stop loading when data is fetched
      })
      .catch(err => {
        setError(err.message);  // Set error message if request fails
        setLoading(false);  // Stop loading if there's an error
      });
  }, []);  // Empty dependency array, so it only runs once on mount

  return (
    <div className="App">
      {loading && <h1>Loading...</h1>}  {/* Show loading message */}
      {error && <h1>Error: {error}</h1>}  {/* Show error message */}
      {!loading && !error && <h1>{message}</h1>}  {/* Show the fetched message */}
    </div>
  );
}

export default App;
