import React, { useEffect, useState } from "react";

import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import styles from './RegisterComponent.module.scss';




const Login = () => {
  const [ showPassword, setShowPassword ] = useState(false);
  const navigate = useNavigate();
  const [ token, setToken ] = useState(JSON.parse(localStorage.getItem("auth")) || "");



  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    let name = e.target.name.value;
    let lastname = e.target.lastname.value;
    let email = e.target.email.value;
    let password = e.target.password.value;
    let confirmPassword = e.target.confirmPassword.value;

    if(name.length > 0 && lastname.length > 0 && email.length > 0 && password.length > 0 && confirmPassword.length > 0){

      if(password === confirmPassword){
        const formData = {
          username: name + " " + lastname,
          email,
          password
        };
        try{
        const response = await axios.post("http://localhost:3001/api/v1/register", formData);
         toast.success("Registration successfull");
         navigate("/login");
       }catch(err){
         toast.error(err.message);
       }
      }else{
        toast.error("Passwords don't match");
      }
    

    }else{
      toast.error("Please fill all inputs");
    }


  }

  useEffect(() => {
    if(token !== ""){
      toast.success("You already logged in");
      navigate("/calendar");
    }
  }, []);

  return (
    <div>
    <div className={styles.registerContainer}>
    <h1 className={styles.header}>Plant Planner</h1>

          <div>
          <div className={styles.registerContent}>

            <h2>Welcome to the Plant Planner!</h2>
            <h4>Please enter your details</h4>
            <form className={styles.registerForm} onSubmit={handleRegisterSubmit}>
              <div className={styles.nameContainer}>
            <input type="text" placeholder="Name" name="name" required={true} />
            <input type="text" placeholder="Last name" name="lastname" required={true} />
            </div>
             <div> <input type="email" placeholder="Email" name="email" required={true} />
             </div>
              <div>
                <input type={showPassword ? "text" : "password"} placeholder="Password" name="password" required={true} />
                {showPassword ? <FaEyeSlash className={styles.faEye} onClick={() => {setShowPassword(!showPassword)}} /> : <FaEye className={styles.faEye} onClick={() => {setShowPassword(!showPassword)}} />}
                
              </div>
              <div>
                <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" name="confirmPassword" required={true} />
                {showPassword ? <FaEyeSlash className={styles.faEye} onClick={() => {setShowPassword(!showPassword)}} /> : <FaEye className={styles.faEye} onClick={() => {setShowPassword(!showPassword)}} />}
                
              </div>
              <div>
                <button className={styles.signupButton} type="submit">Sign Up</button>
            
              </div>
            </form>
     

        </div>
        
        </div>
        
     
      </div>
      <h4 className={styles.loginLink}>
            Already have an account? <Link to="/login">Login</Link>
          </h4>
      </div>
  );
};

export default Login;
