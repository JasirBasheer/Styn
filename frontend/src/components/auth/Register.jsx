import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../features/authSlice';
import { StyledForm } from './StyledForm';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const Register = () => {
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
        name: "",
        email: "",
        password: "",
    });
const handleSubmit = (e) =>{
    e.preventDefault()

    dispatch(registerUser(user))
}
  return (
    <div className='login-container'>
    <StyledForm onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <input
        type="text"
        placeholder="Name"
        required
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
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
        {auth.registerStatus === 'pending' ? <ClipLoader color="#121716" size={16}/> : 'Sign Up'}
      </button>
      <Link to={"/login"} style={{color: "black", justifyContent: "start",display: "flex",fontSize:"14px"}}>Already have an account. Login?</Link>
      {auth.registerStatus === 'rejected' ? <p style={{color: "red", justifyContent: "start",display: "flex",fontSize:"16px"}}>{auth.registerError}</p> : null}
      <p></p>

    </StyledForm>
  </div>
);
};

export default Register
