import { Link } from 'react-router-dom';

export default function Investments() {
  const funds = [
    { name: 'Equity Growth Fund', returns: '+15.2%', risk: 'High', minInvest: '$1,000' },
    { name: 'Balanced Fund', returns: '+10.5%', risk: 'Medium', minInvest: '$500' },
    { name: 'Debt Fund', returns: '+7.8%', risk: 'Low', minInvest: '$250' },
    { name: 'Index Fund', returns: '+12.3%', risk: 'Medium', minInvest: '$500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Investments</h1>
          <Link to="/services" className="bg-blue-500/20 hover:bg-blue-500/30 text-white px-6 py-2 rounded-xl border border-blue-400 transition">Back</Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {funds.map(fund => (
            <div key={fund.name} className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 hover:bg-white/15 transition">
              <h3 className="text-2xl font-bold text-white mb-4">{fund.name}</h3>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-blue-200">Returns (1Y)</span>
                  <span className="text-green-400 font-semibold">{fund.returns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Risk Level</span>
                  <span className={`font-semibold ${fund.risk === 'High' ? 'text-red-400' : fund.risk === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>{fund.risk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Min. Investment</span>
                  <span className="text-white font-semibold">{fund.minInvest}</span>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-lg">Invest Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
