import { Link } from 'react-router-dom';

export default function Insurance() {
  const plans = [
    { name: 'Life Insurance', premium: '$50/month', coverage: '$500,000', icon: '🛡️' },
    { name: 'Health Insurance', premium: '$80/month', coverage: '$200,000', icon: '🏥' },
    { name: 'Vehicle Insurance', premium: '$40/month', coverage: '$100,000', icon: '🚗' },
    { name: 'Home Insurance', premium: '$60/month', coverage: '$300,000', icon: '🏠' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Insurance</h1>
          <Link to="/services" className="bg-blue-500/20 hover:bg-blue-500/30 text-white px-6 py-2 rounded-xl border border-blue-400 transition">Back</Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map(plan => (
            <div key={plan.name} className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 hover:bg-white/15 transition">
              <div className="text-5xl mb-4">{plan.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-blue-200 mb-4">Coverage: {plan.coverage}</p>
              <p className="text-green-400 text-xl font-semibold mb-6">{plan.premium}</p>
              <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-lg">Buy Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
