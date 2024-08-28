import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const Signup = (props) => {
  const [credentials, setCredentials]=useState({name:"",email: "", password:"", cpassword:""});

  let navigate=useNavigate();

  useEffect(() => {
    // Apply background image to the body when the component is mounted
    document.body.style.backgroundImage = "url('/images/tech.jpg')";
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
    const {name, email, password}=credentials;
    const response=await fetch("http://localhost:5000/api/auth/createuser", {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({name, email, password})
    })
    const json=await response.json();
    console.log(json);
    if (json.success) {
      props.showAlert("Account created successfully", "success");
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

    <div className='container'>
      <h1>Create your Account on iNotebook</h1>
      <form className='my-4' onSubmit={handleSubmit}>
  <div className="form-group">
    <label htmlFor="name">Name</label>
    <input type="text" name="name" className="form-control col-md-5" id="name" onChange={onChange} aria-describedby="emailHelp"/>
  </div>
  <div className="form-group">
    <label htmlFor="email">Email address</label>
    <input type="email" name="email" className="form-control col-md-5" id="email" onChange={onChange} aria-describedby="emailHelp"/>
  </div>
  <div className="form-group">
    <label htmlFor="password">Password</label>
    <input type="password" name="password" className="form-control col-md-5" onChange={onChange} minLength={5} required id="password"/>
  </div>
  <div className="form-group">
    <label htmlFor="cpassword">Confirm Password</label>
    <input type="password" name="cpassword" minLength={5} onChange={onChange}className="form-control col-md-5" required id="cpassword"/>
  </div>
  <button type="submit" className="btn btn-outline-success">Submit</button>
</form>
    </div>
  )
}

export default Signup
