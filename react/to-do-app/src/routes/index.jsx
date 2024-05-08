import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
// import RequireAuth from '../components/RequireAuth';

const AppRoutes = () => {
  return (
    <Routes>
       {/* <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
        </Route> */}
      <Route path="/" element={<Home />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  )
}

export default AppRoutes;