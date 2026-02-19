import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', customer_password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">KodBank</h1>
          <p className="text-blue-200">Welcome Back</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6">Login</h2>
          {location.state?.message && <div className="bg-green-500/20 border border-green-500 text-green-100 px-4 py-3 rounded-lg mb-4">{location.state.message}</div>}
          {error && <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-blue-100 mb-2 font-medium">Email</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-blue-100 mb-2 font-medium">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={formData.customer_password} onChange={(e) => setFormData({ ...formData, customer_password: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white transition">
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition transform hover:scale-105 disabled:opacity-50 shadow-lg">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-blue-300 hover:text-white text-sm transition">Forgot Password?</Link>
          </div>
          <p className="text-blue-100 text-center mt-6">Don't have an account? <Link to="/register" className="text-blue-300 hover:text-white font-semibold transition">Register</Link></p>
        </div>
      </div>
    </div>
  );
}
