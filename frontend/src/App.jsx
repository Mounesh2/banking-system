import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Services from './pages/Services';
import Statement from './pages/Statement';
import ForgotPassword from './pages/ForgotPassword';
import Cards from './pages/Cards';
import Deposits from './pages/Deposits';
import Loans from './pages/Loans';
import Insurance from './pages/Insurance';
import Investments from './pages/Investments';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/services" element={<Services />} />
        <Route path="/statement" element={<Statement />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/deposits" element={<Deposits />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/insurance" element={<Insurance />} />
        <Route path="/investments" element={<Investments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
