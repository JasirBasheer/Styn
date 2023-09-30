import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/authSlice';
import { StyledForm } from './StyledForm';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components'

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth =useSelector((state) => state.auth);

    console.log(auth);

        useEffect(() => {
            if(auth._id){
                navigate("/cart")
            }
        }, [auth._id, navigate])
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
const handleSubmit = (e) =>{
    e.preventDefault()

    dispatch(loginUser(user))
}
  return (
    <div className='login-container'>
    <StyledForm onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        required
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        required
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <button>
        {auth.loginStatus === 'pending' ? <ClipLoader color="#121716" size={16}/> : 'Login'}
      </button>
      <Link to={"/register"} style={{color: "black", justifyContent: "start",display: "flex",fontSize:"14px"}}>Create an account ?</Link>
      {auth.loginStatus === 'rejected' ? <p style={{color: "red", justifyContent: "start",display: "flex",fontSize:"16px"}}>{auth.loginError}</p> : null}
      
      <p></p>

    </StyledForm>
  </div>
);
};

export default Login;

