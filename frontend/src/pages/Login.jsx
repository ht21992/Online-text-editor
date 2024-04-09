// Login.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAsync } from "../slices/authSlice";

export const Login = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAsync({ email, password }));
  };

  return (
    <form id="login" tabIndex="500" onSubmit={onSubmit}>
      <h3>Login</h3>
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
      <div className="submit">
        <button className="highlight">Login</button>
      </div>
    </form>
  );
};