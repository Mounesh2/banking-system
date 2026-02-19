import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ customer_name: '', email: '', customer_password: '', security_question: 'pet', security_answer: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.register(formData);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">KodBank</h1>
          <p className="text-blue-200">Modern Banking Made Simple</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6">Create Account</h2>
          {error && <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-blue-100 mb-2 font-medium">Full Name</label>
              <input type="text" required value={formData.customer_name} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="John Doe" />
            </div>
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

            <div>
              <label className="block text-blue-100 mb-2 font-medium">Security Question</label>
              <select value={formData.security_question} onChange={(e) => setFormData({ ...formData, security_question: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
                <option value="pet">What is your pet's name?</option>
                <option value="city">What city were you born in?</option>
                <option value="school">What is your school name?</option>
                <option value="color">What is your favorite color?</option>
              </select>
            </div>

            <div>
              <label className="block text-blue-100 mb-2 font-medium">Security Answer</label>
              <input type="text" required value={formData.security_answer} onChange={(e) => setFormData({ ...formData, security_answer: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="Your answer" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition transform hover:scale-105 disabled:opacity-50 shadow-lg">
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
          <p className="text-blue-100 text-center mt-6">Already have an account? <Link to="/login" className="text-blue-300 hover:text-white font-semibold transition">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
