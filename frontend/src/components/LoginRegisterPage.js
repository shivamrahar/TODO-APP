import React, { useState } from 'react';
import axios from 'axios';
import TodoForm from './TodoForm';

const LoginRegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/login', {
        email,
        password,
      });
      const data = response.data;
      localStorage.setItem('user', JSON.stringify(data));
      if (data.message === 'Login successful') {
        setLoginSuccess(true);
        setIsLoggedIn(true); // Set isLoggedIn to true
        window.alert('Login successful!');
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      {!isLoggedIn && (
        <div className="TodoWrapper">
          <h1>Login or Register</h1>
          {loginSuccess && <p>Login successful!</p>}
          <form className="TodoForm" onSubmit={handleSubmit}>
            <input
              type="text"
              className="todo-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="todo-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="todo-btn">
              Submit
            </button>
          </form>
        </div>
      )}
      {isLoggedIn && <TodoForm email={email} />} {/* Pass user email to TodoForm */}
    </div>
  );
};

export default LoginRegisterPage;
