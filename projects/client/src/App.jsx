import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import { keep } from './store/reducer/authSlice'
import axios from "axios";

import { useEffect, useState } from "react";
import LogIn from './page/login';
import Home from './page/home';




function App() {


  
  return (
    <Router>
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </Router>
  );
}

export default App;