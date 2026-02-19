import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Deposits() {
  const [depositType, setDepositType] = useState('FD');
  const [amount, setAmount] = useState('');
  const [tenure, setTenure] = useState('12');

  const calculateReturns = () => {
    const rate = depositType === 'FD' ? 7.5 : 6.5;
    const principal = parseFloat(amount) || 0;
    const months = parseInt(tenure);
    const interest = (principal * rate * months) / (12 * 100);
    return (principal + interest).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Deposits</h1>
          <Link to="/services" className="bg-blue-500/20 hover:bg-blue-500/30 text-white px-6 py-2 rounded-xl border border-blue-400 transition">Back</Link>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex gap-4 mb-6">
            <button onClick={() => setDepositType('FD')} className={`flex-1 py-3 rounded-xl font-semibold transition ${depositType === 'FD' ? 'bg-blue-500 text-white' : 'bg-white/10 text-blue-200'}`}>Fixed Deposit</button>
            <button onClick={() => setDepositType('RD')} className={`flex-1 py-3 rounded-xl font-semibold transition ${depositType === 'RD' ? 'bg-blue-500 text-white' : 'bg-white/10 text-blue-200'}`}>Recurring Deposit</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-blue-100 mb-2 font-medium">Amount</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="10000" />
            </div>
            <div>
              <label className="block text-blue-100 mb-2 font-medium">Tenure (Months)</label>
              <select value={tenure} onChange={(e) => setTenure(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
                <option value="60">60 Months</option>
              </select>
            </div>

            <div className="bg-green-500/20 border border-green-500 rounded-xl p-4">
              <p className="text-green-100 text-sm">Interest Rate: {depositType === 'FD' ? '7.5%' : '6.5%'} p.a.</p>
              <p className="text-white text-2xl font-bold mt-2">Maturity Amount: ${calculateReturns()}</p>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-lg">Open {depositType}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
