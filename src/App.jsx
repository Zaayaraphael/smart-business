import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Tracker from './Tracker.jsx';
import ChatToggle from './ChatToggle.jsx';
import Saving from './Saving.jsx';
import Tips from './Tips.jsx';
import Guide from './Guide.jsx';

import Footer from './Footer.jsx';
import './App.css';

function App() {
  return (
<>
<div className='app-background'>
    <h1 className='smart-biz' style={{ color: 'black', textAlign: 'center', paddingTop: '10px'}}>My Smart Business Tracker</h1> 
    <p className='p' style={{ color: 'black', textAlign: 'center'}}>Welcome to My Smart Business Tracker. A platform where you can tracker your business growth. </p>
    <br />
    <Router>

      <div className="app-container">
        <nav className="navbar">
          
          
          <ChatToggle />
        
          <ul>
            <li><Link to="/">Tracker</Link></li>
            <li><Link to="/savings">Savings</Link></li>
            <li><Link to="/tips">Tips</Link></li>
            <li><Link to="/guide">Startup Guide</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Tracker />} />
          <Route path="/saving" element={<Saving />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/guide" element={<Guide />} />
        </Routes>

        
      </div>
      <Footer />
    </Router>
    </div>
    </>
    
  );
}

export default App;









