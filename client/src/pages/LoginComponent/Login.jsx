import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../components/axiosInstance";
import { toast } from "react-toastify";
import styles from './LoginComponent.module.scss';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Ensure navigate is correctly used from react-router-dom

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    let email = e.target.email.value;
    let password = e.target.password.value;

    if (email.length > 0 && password.length > 0) {
      const formData = {
        email,
        password,
      };
      try {
        const response = await axiosInstance.post(
          '/login',
          formData
        );
        const { token, username } = response.data;
        localStorage.setItem('auth', JSON.stringify(token));
        localStorage.setItem('username', JSON.stringify(username)); // Store username in local storage
        toast.success("Login successful");
        navigate("/calendar");
      } catch (err) {
        console.log(err);
        toast.error(err.message);
      }
    } else {
      toast.error("Please fill all inputs");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>
      <div className={styles.headerContainer}>
        <div className={styles.background}></div>
      </div>
      <h1 className={styles.header}>Plant Planner</h1>
      <h2>Welcome back!</h2>
      <div className={styles.content}>
        <p>Please enter your details</p>
        <form className={styles.form} onSubmit={handleLoginSubmit}>
          <div className={styles.credentialInput}>
            <input type="email" placeholder="Email" name="email" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
            />
            {showPassword ? (
              <FaEyeSlash
                className={styles.faEye}
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              />
            ) : (
              <FaEye
                className={styles.faEye}
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              />
            )}
          </div>
          <div>
            <input type="checkbox" id="remember-checkbox" />
            <label htmlFor="remember-checkbox">Remember for 30 days</label>
          </div>
          <button className={styles.loginButton} type="submit">Log In</button>
          <a href="#">Forgot password?</a>
        </form>
      </div>
      <h4 className="margin-top">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </h4>
    </div>
  );
};

export default Login;