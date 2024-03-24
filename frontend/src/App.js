import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import { Provider } from 'react-redux';
import store from './store';

import Homepage from './components/basic/homepage/homepage';
import Dashboard from './components/dashboard/backbone';
import TraineeRegister from './components/trainee/register/traineeregister';
import MainPortal from './components/trainee/examPortal/portal';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/user" element={<Dashboard />} />
          <Route path="/user/:options" element={<Dashboard />} />
          <Route path="/trainee/register" element={<TraineeRegister />} />
          <Route path="/trainee/taketest" element={<MainPortal />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;