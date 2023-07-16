import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LogIn from './page/login';
import Home from './page/home';
import SetAccount from './component/user/SetAccount'
import { useDispatch } from 'react-redux';
import React,{ useEffect } from 'react';
import { keep } from './store/reducer/authSlice';




function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(keep(localStorage.getItem("token")));
    }
  }, [dispatch])

  return (
    <Router>
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/home" element={<Home />} />
      <Route path="/set-pass/:token" element={<SetAccount />} />
    </Routes>
  </Router>
  );
}

export default App;