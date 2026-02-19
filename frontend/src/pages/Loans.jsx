import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Loans() {
  const [loanType, setLoanType] = useState('Personal');
  const [amount, setAmount] = useState('');
  const [tenure, setTenure] = useState('12');

  const loanRates = { Personal: 10.5, Home: 8.5, Car: 9.0, Education: 7.5 };

  const calculateEMI = () => {
    const principal = parseFloat(amount) || 0;
    const rate = loanRates[loanType] / 12 / 100;
    const months = parseInt(tenure);
    const emi = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    return emi.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Loans</h1>
          <Link to="/services" className="bg-blue-500/20 hover:bg-blue-500/30 text-white px-6 py-2 rounded-xl border border-blue-400 transition">Back</Link>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {Object.keys(loanRates).map(type => (
            <button key={type} onClick={() => setLoanType(type)} className={`py-3 rounded-xl font-semibold transition ${loanType === type ? 'bg-blue-500 text-white' : 'bg-white/10 text-blue-200'}`}>{type}</button>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">{loanType} Loan Calculator</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-blue-100 mb-2 font-medium">Loan Amount</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="100000" />
            </div>
            <div>
              <label className="block text-blue-100 mb-2 font-medium">Tenure (Months)</label>
              <select value={tenure} onChange={(e) => setTenure(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
                <option value="60">60 Months</option>
                <option value="120">120 Months</option>
              </select>
            </div>

            <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-4">
              <p className="text-blue-100 text-sm">Interest Rate: {loanRates[loanType]}% p.a.</p>
              <p className="text-white text-2xl font-bold mt-2">Monthly EMI: ${calculateEMI()}</p>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-lg">Apply for Loan</button>
          </div>
        </div>
      </div>
    </div>
  );
}
