// Signup.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signUpAsync } from "../slices/authSlice.js";

export const Signup = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    password2: "",
  });

  const { email, username, password, password2 } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(signUpAsync(username, email, password, password2));
  };

  return (
    <form id="register" tabIndex="502" onSubmit={onSubmit}>
      <h3>Register</h3>
      <div className="name">
        <input
          required
          type="text"
          name="username"
          onChange={onChange}
          value={username}
        />
        <label>Username</label>
      </div>
      <div className="email">
        <input
          required
          type="email"
          name="email"
          onChange={onChange}
          value={email}
        />
        <label>Email</label>
      </div>
      <div className="passwd">
        <input
          required
          type="password"
          name="password"
          onChange={onChange}
          value={password}
        />
        <label>Password</label>
      </div>
      <div className="passwd">
        <input
          required
          type="password"
          name="password2"
          onChange={onChange}
          value={password2}
        />
        <label>Confirm Password</label>
      </div>
      <div className="submit">
        <button className="highlight">Register</button>
      </div>
    </form>
  );
};