import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';

const Login = (props) => {
  const [credentials, setCredentials]=useState({email: "", password:""});
  let navigate=useNavigate();

  useEffect(() => {
    // Apply background image to the body when the component is mounted
    document.body.style.backgroundImage = "url('/images/login.jpg')";
    document.body.style.backgroundSize = '100%';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundAttachment = 'fixed';
    
  
    // Clean up the background when the component is unmounted
    return () => {
      document.body.style.backgroundImage = ''; // Reset to default or previous background
    };
  }, []);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const response=await fetch("http://localhost:5000/api/auth/login", {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({email: credentials.email, password: credentials.password})
    })
    
    const json=await response.json();
    console.log(json);
    if (json.success) {
      props.showAlert("Logged in successfully", "success");
      localStorage.setItem('token', json.authToken);
      navigate("/");
   }
    else{
      props.showAlert("Invalid Credentials", "danger");
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

    return (
    <div>
      <h2>Login to Continue with iNotebook</h2>
      <form className='my-5' onSubmit={handleSubmit}>
  <div className="form-group">
    <label htmlFor="email">Email address</label>
    <input type="email" onChange={onChange}className="form-control col-md-6" id="email" name="email" value= {credentials.email} aria-describedby="emailHelp"/>
  </div>
  <div className="form-group">
    <label htmlFor="password">Password</label>
    <input type="password" onChange={onChange} value= {credentials.password} className="form-control col-md-6" id="password" name='password'/>
  </div>
  <button type="submit" className="btn btn-outline-success">Submit</button>
</form>
    </div>
  )
}

export default Login
