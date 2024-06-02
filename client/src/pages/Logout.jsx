import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Logout = () => {

    const navigate = useNavigate();
    
    useEffect(() => {
        localStorage.removeItem("auth");
        setTimeout(() => {
            navigate("/login");
        }, 3001);
    }, []);

 
}

export default Logout