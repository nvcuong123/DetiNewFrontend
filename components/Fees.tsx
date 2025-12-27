
import React, { useState } from 'react';
import { FEE_TIERS, COIN_NETWORKS } from '../constants';
import { Search, Shield, Crown } from 'lucide-react';

export const Fees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Flatten networks for table display
  const allNetworks = Object.entries(COIN_NETWORKS).flatMap(([symbol, networks]) => 
     networks.map(net => ({ ...net, symbol }))
  ).filter(n => 
     n.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     n.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 max-w-[1200px] mx-auto space-y-10 min-h-full animate-reveal-up">
       
       <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter text-white mb-2">Fee Structure & VIP Levels</h1>
          <p className="text-deti-subtext max-w-2xl mx-auto">Transparent pricing for every trader. Increase your 30-day trading volume to unlock lower fees and higher withdrawal limits.</p>
       </div>

       {/* VIP Progress - Updated Gradient to Gold/Orange */}
       <div className="bg-gradient-vip border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-glow brand-lighting-box">
          {/* Noise & Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl pointer-events-none mix-blend-soft-light"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 border border-white/20">
                   <Crown className="text-white w-8 h-8" />
                </div>
                <div>
                   <div className="text-sm font-bold text-white/80 uppercase tracking-wider mb-1">Current Status</div>
                   <h2 className="text-3xl font-bold text-white">VIP Level 1</h2>
                   <p className="text-white/80 text-xs mt-1">Next Tier: VIP 2</p>
                </div>
             </div>
             
             <div className="flex-1 w-full md:max-w-md space-y-2">
                <div className="flex justify-between text-xs font-bold text-white">
                   <span>30d Volume: $12,450</span>
                   <span>Target: $50,000</span>
                </div>
                <div className="h-3 bg-black/20 rounded-full overflow-hidden border border-white/10">
                   <div className="h-full bg-white w-[25%] rounded-full shadow-lg"></div>
                </div>
                <p className="text-[10px] text-white/70 text-right">Update daily at 00:00 UTC</p>
             </div>
          </div>
       </div>

       {/* Trading Fee Table */}
       <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
             <Shield className="text-deti-primary w-5 h-5" /> Spot Trading Fees
          </h3>
          <div className="bg-deti-card border border-deti-border rounded-2xl overflow-hidden shadow-card brand-lighting-box">
             <table className="w-full text-left">
                <thead className="bg-deti-bg border-b border-deti-border">
                   <tr className="text-xs font-bold text-deti-subtext uppercase tracking-wider">
                      <th className="px-6 py-4">VIP Level</th>
                      <th className="px-6 py-4">30d Volume (USD)</th>
                      <th className="px-6 py-4">Maker Fee</th>
                      <th className="px-6 py-4">Taker Fee</th>
                      <th className="px-6 py-4">24h Withdrawal Limit</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-deti-border/50 text-sm">
                   {FEE_TIERS.map((tier) => (
                      <tr key={tier.level} className={`hover:bg-white/5 transition-colors ${tier.level === 1 ? 'bg-deti-primary/5' : ''}`}>
                         <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                            {tier.level === 1 && <div className="w-2 h-2 rounded-full bg-deti-primary"></div>}
                            Level {tier.level}
                         </td>
                         <td className="px-6 py-4 text-deti-subtext">{tier.volumeReq}</td>
                         <td className="px-6 py-4 font-mono text-white">{tier.maker}</td>
                         <td className="px-6 py-4 font-mono text-white">{tier.taker}</td>
                         <td className="px-6 py-4 text-deti-subtext">{tier.withdrawalLimit}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>

       {/* Network Fees */}
       <div className="space-y-4">
          <div className="flex justify-between items-end">
             <h3 className="text-xl font-semibold tracking-tight text-white">Deposit & Withdrawal Fees</h3>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deti-subtext" />
                <input 
                  type="text" 
                  placeholder="Search coin..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-deti-card border border-deti-border rounded-xl pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-deti-primary w-64"
                />
             </div>
          </div>

          <div className="bg-deti-card border border-deti-border rounded-2xl overflow-hidden shadow-card h-[400px] overflow-y-auto custom-scrollbar brand-lighting-box">
             <table className="w-full text-left">
                <thead className="bg-deti-bg border-b border-deti-border sticky top-0 z-10">
                   <tr className="text-xs font-bold text-deti-subtext uppercase tracking-wider">
                      <th className="px-6 py-4">Asset</th>
                      <th className="px-6 py-4">Network Name</th>
                      <th className="px-6 py-4">Standard</th>
                      <th className="px-6 py-4">Withdrawal Fee</th>
                      <th className="px-6 py-4">Min Withdrawal</th>
                      <th className="px-6 py-4">Arrival Time</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-deti-border/50 text-sm">
                   {allNetworks.map((net, idx) => (
                      <tr key={`${net.symbol}-${net.id}-${idx}`} className="hover:bg-white/5 transition-colors">
                         <td className="px-6 py-4 font-bold text-white">{net.symbol}</td>
                         <td className="px-6 py-4 text-gray-300">{net.name}</td>
                         <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-deti-subtext font-mono border border-white/10">{net.standard}</span>
                         </td>
                         <td className="px-6 py-4 font-mono text-deti-primary">{net.fee} {net.symbol}</td>
                         <td className="px-6 py-4 font-mono text-gray-400">{net.minWithdraw}</td>
                         <td className="px-6 py-4 text-deti-success text-xs font-bold">{net.arrivalTime}</td>
                      </tr>
                   ))}
                   {allNetworks.length === 0 && (
                      <tr>
                         <td colSpan={6} className="px-6 py-8 text-center text-deti-subtext">No networks found matching "{searchTerm}"</td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>

    </div>
  );
};
