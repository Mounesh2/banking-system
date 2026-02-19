import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bankAPI } from '../services/api';

export default function Statement() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [balanceRes, transRes] = await Promise.all([
        bankAPI.getBalance(),
        bankAPI.getTransactions()
      ]);
      setUser(balanceRes.data);
      setTransactions(transRes.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'sent') return t.type === 'sent';
    if (filter === 'received') return t.type === 'received';
    return true;
  });

  const totalSent = transactions.filter(t => t.type === 'sent').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalReceived = transactions.filter(t => t.type === 'received').reduce((sum, t) => sum + parseFloat(t.amount), 0);

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center"><div className="text-white text-2xl">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Account Statement</h1>
          <Link to="/dashboard" className="bg-blue-500/20 hover:bg-blue-500/30 text-white px-6 py-2 rounded-xl border border-blue-400 transition">Back</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <p className="text-blue-200 text-sm mb-2">Current Balance</p>
            <p className="text-3xl font-bold text-white">${parseFloat(user?.account_balance || 0).toFixed(2)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <p className="text-blue-200 text-sm mb-2">Total Sent</p>
            <p className="text-3xl font-bold text-red-400">-${totalSent.toFixed(2)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <p className="text-blue-200 text-sm mb-2">Total Received</p>
            <p className="text-3xl font-bold text-green-400">+${totalReceived.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Transactions</h2>
            <div className="flex gap-2">
              <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl transition ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white/10 text-blue-200'}`}>All</button>
              <button onClick={() => setFilter('sent')} className={`px-4 py-2 rounded-xl transition ${filter === 'sent' ? 'bg-red-500 text-white' : 'bg-white/10 text-blue-200'}`}>Sent</button>
              <button onClick={() => setFilter('received')} className={`px-4 py-2 rounded-xl transition ${filter === 'received' ? 'bg-green-500 text-white' : 'bg-white/10 text-blue-200'}`}>Received</button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <p className="text-blue-200 text-center py-8">No transactions found</p>
            ) : (
              filteredTransactions.map((t) => (
                <div key={t.transaction_id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${t.type === 'sent' ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                        <span className="text-2xl">{t.type === 'sent' ? '↑' : '↓'}</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{t.type === 'sent' ? 'Sent to' : 'Received from'} {t.other_party}</p>
                        <p className="text-blue-200 text-sm">{t.other_email}</p>
                        <p className="text-blue-300 text-xs mt-1">{new Date(t.transaction_date).toLocaleString()}</p>
                      </div>
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
