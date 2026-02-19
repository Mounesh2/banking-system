import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Services() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const services = [
    { name: 'Fund Transfer', icon: '💸', path: '/dashboard', desc: 'Transfer money to other accounts' },
    { name: 'Account Statement', icon: '📄', path: '/statement', desc: 'View transaction history' },
    { name: 'Profile', icon: '👤', path: '/profile', desc: 'Manage your profile' },
    { name: 'Cards', icon: '💳', path: '/cards', desc: 'Manage debit/credit cards' },
    { name: 'Deposits', icon: '🏦', path: '/deposits', desc: 'Fixed & recurring deposits' },
    { name: 'Loans', icon: '💰', path: '/loans', desc: 'Apply for loans' },
    { name: 'Insurance', icon: '🛡️', path: '/insurance', desc: 'Insurance services' },
    { name: 'Investments', icon: '📈', path: '/investments', desc: 'Mutual funds & stocks' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Services</h1>
          <div className="flex gap-3">
            <Link to="/dashboard" className="bg-blue-500/20 hover:bg-blue-500/30 text-white px-6 py-2 rounded-xl border border-blue-400 transition">Dashboard</Link>
            <button onClick={handleLogout} className="bg-red-500/20 hover:bg-red-500/30 text-white px-6 py-2 rounded-xl border border-red-400 transition">Logout</button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {services.map((service) => (
            <Link key={service.name} to={service.path} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition transform hover:scale-105">
              <div className="text-5xl mb-3">{service.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{service.name}</h3>
              <p className="text-blue-200 text-sm">{service.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
