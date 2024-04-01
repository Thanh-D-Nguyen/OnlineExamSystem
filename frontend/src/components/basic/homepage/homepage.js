import React, { useEffect } from 'react';
import './homepage.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Login from '../login/login';
import HomepageHeader from '../header/header';
import auth from '../../../services/AuthServices';

function Homepage() {
  const navigate = useNavigate();
  const user = useSelector(state => state.user);

  useEffect(() => {
    const token = auth.retrieveToken();
    if (token && token !== 'undefined') {
      console.log('Logged In');
      navigate('/user/home');
    } else {
      console.log('Not Logged In');
    }
  }, [navigate]);

  // Render logic remains outside of useEffect
  return (
    <div className="parallax">
      <HomepageHeader />
      <Login />
    </div>
  );
}

export default Homepage;
