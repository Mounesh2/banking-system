import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bankAPI } from '../services/api';

export default function Cards() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cards] = useState([
    { id: 1, type: 'Debit', number: '**** **** **** 4532', expiry: '12/25', status: 'Active' },
    { id: 2, type: 'Credit', number: '**** **** **** 8901', expiry: '08/26', status: 'Active', limit: 50000 }
  ]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await bankAPI.getBalance();
      setUser(response.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">My Cards</h1>
          <Link to="/services" className="bg-blue-500/20 hover:bg-blue-500/30 text-white px-6 py-2 rounded-xl border border-blue-400 transition">Back</Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {cards.map(card => (
            <div key={card.id} className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-white/80 text-sm">KodBank {card.type} Card</p>
                  <p className="text-white text-2xl font-bold mt-1">{card.number}</p>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-lg">
                  <p className="text-white text-xs">{card.status}</p>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white/80 text-xs">Valid Thru</p>
                  <p className="text-white font-semibold">{card.expiry}</p>
                </div>
                {card.limit && (
                  <div className="text-right">
                    <p className="text-white/80 text-xs">Credit Limit</p>
                    <p className="text-white font-semibold">${card.limit.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <button className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition">
            <p className="text-white font-semibold">Block Card</p>
            <p className="text-blue-200 text-sm mt-2">Temporarily block your card</p>
          </button>
          <button className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition">
            <p className="text-white font-semibold">Set PIN</p>
            <p className="text-blue-200 text-sm mt-2">Change your card PIN</p>
          </button>
          <button className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition">
            <p className="text-white font-semibold">Apply New Card</p>
            <p className="text-blue-200 text-sm mt-2">Request a new card</p>
          </button>
        </div>
      </div>
    </div>
  );
}
