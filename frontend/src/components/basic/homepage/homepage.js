import React from 'react';
import './homepage.css';
import './homepage.jpeg';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Login from '../login/login';
import HomepageHeader from '../header/header';
import auth from '../../../services/AuthServices';

function Homepage(props) {
  if (auth.retriveToken() && auth.retriveToken() !== 'undefined') {
    console.log('Logged In');
    return <Navigate to="/user/home" replace={true} />; // Sử dụng Navigate thay vì Redirect
  } else {
    console.log('Not Logged In');
    return (
      <div>
        <div className="parallax">
          <HomepageHeader />
          <Login />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Homepage);
