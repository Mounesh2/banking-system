import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, bankAPI } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transferData, setTransferData] = useState({ recipient_email: '', amount: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [transferLoading, setTransferLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => { fetchBalance(); fetchTransactions(); }, []);

  const fetchBalance = async () => {
    try {
      const response = await bankAPI.getBalance();
      setUser(response.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await bankAPI.getTransactions();
      setTransactions(response.data);
    } catch (err) {
      console.error('Failed to fetch transactions');
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setTransferLoading(true);
    try {
      const response = await bankAPI.transfer({ recipient_email: transferData.recipient_email, amount: parseFloat(transferData.amount) });
      setMessage({ type: 'success', text: response.data.message });
      setTransferData({ recipient_email: '', amount: '' });
      fetchBalance();
      fetchTransactions();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Transfer failed' });
    } finally {
      setTransferLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center"><div className="text-white text-2xl">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">KodBank</h1>
            <p className="text-blue-200">Welcome back, {user?.customer_name}</p>
          </div>
          <div className="flex gap-3">
            <Link to="/services" className="bg-purple-500/20 hover:bg-purple-500/30 text-white px-6 py-2 rounded-xl border border-purple-400 transition">Services</Link>
            <Link to="/profile" className="bg-blue-500/20 hover:bg-blue-500/30 text-white px-6 py-2 rounded-xl border border-blue-400 transition">Profile</Link>
            <button onClick={handleLogout} className="bg-red-500/20 hover:bg-red-500/30 text-white px-6 py-2 rounded-xl border border-red-400 transition">Logout</button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Account Balance</h2>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-lg">
              <p className="text-blue-100 text-sm mb-2">Available Balance</p>
              <p className="text-5xl font-bold text-white">${parseFloat(user?.account_balance || 0).toFixed(2)}</p>
              <p className="text-blue-100 text-sm mt-4">{user?.email}</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Transfer Money</h2>
            {message.text && <div className={`px-4 py-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-500/20 border border-green-500 text-green-100' : 'bg-red-500/20 border border-red-500 text-red-100'}`}>{message.text}</div>}
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-blue-100 mb-2 font-medium">Recipient Email</label>
                <input type="email" required value={transferData.recipient_email} onChange={(e) => setTransferData({ ...transferData, recipient_email: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="recipient@example.com" />
              </div>
              <div>
                <label className="block text-blue-100 mb-2 font-medium">Amount</label>
                <input type="number" step="0.01" min="0.01" required value={transferData.amount} onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="0.00" />
              </div>
              <button type="submit" disabled={transferLoading} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition transform hover:scale-105 disabled:opacity-50 shadow-lg">
                {transferLoading ? 'Processing...' : 'Transfer'}
              </button>
            </form>
          </div>
        </div>
        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Transaction History</h2>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-blue-200 text-center py-4">No transactions yet</p>
            ) : (
              transactions.map((t) => (
                <div key={t.transaction_id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">{t.type === 'sent' ? '↑ Sent to' : '↓ Received from'} {t.other_party}</p>
                      <p className="text-blue-200 text-sm">{t.other_email}</p>
                      <p className="text-blue-300 text-xs mt-1">{new Date(t.transaction_date).toLocaleString()}</p>
                    </div>
                    <p className={`text-2xl font-bold ${t.type === 'sent' ? 'text-red-400' : 'text-green-400'}`}>
                      {t.type === 'sent' ? '-' : '+'}${parseFloat(t.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
