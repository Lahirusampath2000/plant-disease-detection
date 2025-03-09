import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from "./components/HomePage";
import ImageUpload from './components/imageUpload';
import Register from "./components/auth/Register";
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload-image" element={<ImageUpload/>}/>
        </Routes>
      </Router>
    );
  }
}

export default App;