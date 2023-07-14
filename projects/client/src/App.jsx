import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LogIn from './page/login';
import Home from './page/home';
import SetAccount from './component/user/SetAccount'




function App() {

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