import { BrowserRouter as Router, NavLink, Route, Routes } from 'react-router-dom';
import { ChartNoAxesCombined, CircleHelp, LayoutDashboard, Lightbulb, PiggyBank } from 'lucide-react';
import Tracker from './Tracker.jsx';
import ChatToggle from './ChatToggle.jsx';
import Saving from './Saving.jsx';
import Tips from './Tips.jsx';
import Guide from './Guide.jsx';
import Footer from './Footer.jsx';
import './App.css';

const navigation = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/savings', label: 'Savings plan', icon: PiggyBank },
  { to: '/tips', label: 'Business tips', icon: Lightbulb },
  { to: '/guide', label: 'Startup guide', icon: CircleHelp },
];

function App() {
  return (
    <Router>
      <div className="app-background">
        <header className="topbar">
          <NavLink className="brand" to="/" aria-label="SmartBiz home">
            <span className="brand-mark"><ChartNoAxesCombined size={21} /></span>
            <span className="brand-name">smart<span>biz</span></span>
          </NavLink>
          <nav className="main-nav" aria-label="Main navigation">
            {navigation.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <Icon size={17} strokeWidth={1.9} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="account-chip" aria-label="Your workspace">
            <span className="account-avatar">S</span>
            <span className="account-label">My business</span>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Tracker />} />
            <Route path="/savings" element={<Saving />} />
            <Route path="/tips" element={<Tips />} />
            <Route path="/guide" element={<Guide />} />
          </Routes>
        </main>
        <Footer />
        <ChatToggle />
      </div>
    </Router>
  );
}

export default App;
