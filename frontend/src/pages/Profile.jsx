import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, bankAPI } from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ customer_name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await bankAPI.getBalance();
      setUser(response.data);
      setFormData({ customer_name: response.data.customer_name, email: response.data.email });
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      await bankAPI.updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      await bankAPI.changePassword(passwordData);
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setPasswordData({ current_password: '', new_password: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Password change failed' });
    }
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center"><div className="text-white text-2xl">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Profile</h1>
          <Link to="/dashboard" className="bg-blue-500/20 hover:bg-blue-500/30 text-white px-6 py-2 rounded-xl border border-blue-400 transition">Back to Dashboard</Link>
        </div>

        {message.text && <div className={`px-4 py-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-500/20 border border-green-500 text-green-100' : 'bg-red-500/20 border border-red-500 text-red-100'}`}>{message.text}</div>}

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Account Information</h2>
            <button onClick={() => setEditMode(!editMode)} className="bg-blue-500/20 hover:bg-blue-500/30 text-white px-4 py-2 rounded-xl border border-blue-400 transition">{editMode ? 'Cancel' : 'Edit'}</button>
          </div>

          {!editMode ? (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-blue-200 text-sm">Full Name</p>
                <p className="text-white text-lg font-semibold">{user?.customer_name}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-blue-200 text-sm">Email</p>
                <p className="text-white text-lg font-semibold">{user?.email}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-blue-200 text-sm">Account Balance</p>
                <p className="text-white text-lg font-semibold">${parseFloat(user?.account_balance || 0).toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-blue-100 mb-2 font-medium">Full Name</label>
                <input type="text" required value={formData.customer_name} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
              <div>
                <label className="block text-blue-100 mb-2 font-medium">Email</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-lg">Update Profile</button>
            </form>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-blue-100 mb-2 font-medium">Current Password</label>
              <input type="password" required value={passwordData.current_password} onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-blue-100 mb-2 font-medium">New Password</label>
              <input type="password" required value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-lg">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}
