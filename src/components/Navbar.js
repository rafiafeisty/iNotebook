import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import './custom.scss'; // Import the custom styles



const Navbar = () => {
  let navigate=useNavigate();
//handleLogout function
const handleLogout=()=>{
  localStorage.removeItem('token');
  navigate('/login')
}


  //using location hook
  let location = useLocation();
  
  return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <Link className="navbar-brand mx-3" to="/">iNotebook</Link>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <Link className={`nav-link ${location.pathname==="/"?"active":""}`} to="/">Home <span className="sr-only">(current)</span></Link>
      </li>
      <li className="nav-item">
        <Link className={`nav-link ${location.pathname==="/about"?"active":""}`} to="/about">About</Link>
      </li>
        
    </ul>
    {!localStorage.getItem('token')?<form className="form-inline my-2 my-lg-0">
    <Link type="button" className="btn custom-login mx-2" to="/login">Login</Link>
    <Link type="button" className="btn custom-signup mx-2" to="/signup">SignUp</Link>
    </form>:<button className='btn custom-login mx-2' onClick={handleLogout}>Logout</button>}
  </div>
</nav>
  )
}

export default Navbar
