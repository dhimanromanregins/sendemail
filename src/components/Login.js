import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../login.css"

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username,
        password,
      });
      if (response.data.token) { // Assuming token is returned upon successful login
        // Store token in local storage
        localStorage.setItem('token', response.data.token);
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
      toast.error('An error occurred during login');
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-content">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <div className="login-options">
          <p>Don't have an account? <a href="/register">Sign up</a></p>
          <p>Forgot your password? <a href="/reset-password">Reset password</a></p>
        </div>
      </div>
    </div>
  );
}
