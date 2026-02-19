import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [formData, setFormData] = useState({ security_answer: '', new_password: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const questions = {
    pet: "What is your pet's name?",
    city: "What city were you born in?",
    school: "What is your school name?",
    color: "What is your favorite color?"
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);
    try {
      const response = await authAPI.getSecurityQuestion(email);
      setSecurityQuestion(response.data.security_question);
      setStep(2);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Email not found' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email, ...formData });
      setMessage({ type: 'success', text: 'Password reset successful!' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Reset failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">KodBank</h1>
          <p className="text-blue-200">Reset Your Password</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6">Forgot Password</h2>

          {message.text && (
            <div className={`px-4 py-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-500/20 border border-green-500 text-green-100' : 'bg-red-500/20 border border-red-500 text-red-100'}`}>
              {message.text}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div>
                <label className="block text-blue-100 mb-2 font-medium">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="john@example.com" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition transform hover:scale-105 disabled:opacity-50 shadow-lg">
                {loading ? 'Checking...' : 'Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-5">
              <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-4 mb-4">
                <p className="text-blue-100 text-sm font-medium">{questions[securityQuestion]}</p>
              </div>
              <div>
                <label className="block text-blue-100 mb-2 font-medium">Your Answer</label>
                <input type="text" required value={formData.security_answer} onChange={(e) => setFormData({ ...formData, security_answer: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="Your answer" />
              </div>
              <div>
                <label className="block text-blue-100 mb-2 font-medium">New Password</label>
                <input type="password" required value={formData.new_password} onChange={(e) => setFormData({ ...formData, new_password: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition transform hover:scale-105 disabled:opacity-50 shadow-lg">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <p className="text-blue-100 text-center mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-300 hover:text-white font-semibold transition">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
