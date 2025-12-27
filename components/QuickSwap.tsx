
import React, { useState, useEffect } from 'react';
import { MarketPair, PortfolioAsset } from '../types';
import { 
  ArrowDown, 
  RefreshCw, 
  AlertCircle, 
  ChevronDown, 
  CheckCircle2, 
  TrendingUp, 
  History, 
  Wallet,
  ArrowRightLeft
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface QuickSwapProps {
  assets: PortfolioAsset[];
  pairs: MarketPair[];
  onSwap: (from: string, to: string, amount: number) => void;
}

// Mock chart data for the swap rate
const generateRateData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    value: 1 + Math.random() * 0.05
  }));
};

export const QuickSwap: React.FC<QuickSwapProps> = ({ assets, pairs, onSwap }) => {
  const [fromAsset, setFromAsset] = useState('USDT');
  const [toAsset, setToAsset] = useState('BTC');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [quoteTimer, setQuoteTimer] = useState(15);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rateHistory, setRateHistory] = useState(generateRateData());

  // Helper: Get Rate
  const getRate = () => {
    const directPair = pairs.find(p => p.base === toAsset && p.quote === fromAsset);
    const inversePair = pairs.find(p => p.base === fromAsset && p.quote === toAsset);
    
    if (directPair) return 1 / directPair.price;
    if (inversePair) return inversePair.price;
    // Fallbacks
    if (fromAsset === 'USDT' && toAsset === 'BTC') return 1 / 64230;
    if (fromAsset === 'BTC' && toAsset === 'USDT') return 64230;
    if (fromAsset === 'USDT' && toAsset === 'ETH') return 1 / 3450;
    if (fromAsset === 'ETH' && toAsset === 'USDT') return 3450;
    return 1.0;
  };

  const rate = getRate();
  const availableBalance = assets.find(a => a.symbol === fromAsset)?.amount || 0;

  // Update amounts on input
  useEffect(() => {
    if (fromAmount) {
      const val = parseFloat(fromAmount);
      if (!isNaN(val)) {
        setToAmount((val * rate).toFixed(6));
      }
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromAsset, toAsset, rate]);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
       setQuoteTimer(prev => {
         if (prev <= 1) {
            // "Refresh" rate visual
            setRateHistory(generateRateData());
            return 15;
         }
         return prev - 1;
       });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSwap = () => {
    if (!fromAmount) return;
    setLoading(true);
    setTimeout(() => {
      onSwap(fromAsset, toAsset, parseFloat(fromAmount));
      setLoading(false);
      setShowSuccess(true);
      setFromAmount('');
      setToAmount('');
    }, 1500);
  };

  const supportedAssets = ['BTC', 'ETH', 'USDT', 'SOL', 'DETI', 'XRP', 'ADA'];

  return (
    <div className="h-full w-full bg-deti-bg overflow-hidden flex flex-col lg:flex-row relative">
      {/* Background Ambience - Changed to Orange/Gold */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-deti-bg via-deti-bg to-[#0d0d12] z-0"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-deti-primary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-deti-secondary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* LEFT PANEL: Swap Interface */}
      <div className="flex-1 z-10 p-6 lg:p-12 flex flex-col justify-center max-w-2xl mx-auto lg:max-w-none w-full border-r border-deti-border bg-white/[0.01] backdrop-blur-sm">
         
         <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-white mb-2 flex items-center gap-3">
               <RefreshCw className="text-deti-primary w-8 h-8" /> Flash Swap
            </h1>
            <p className="text-deti-subtext text-lg">Instant zero-slippage conversions for VIP traders.</p>
         </div>

         <div className="space-y-4">
            {/* FROM CARD */}
            <div className="bg-deti-card border border-deti-border rounded-3xl p-6 shadow-lg transition-all hover:border-deti-primary/30 group brand-lighting-box">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-deti-subtext uppercase tracking-wide">From</span>
                  <span 
                    className="text-sm text-deti-subtext flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
                    onClick={() => setFromAmount(availableBalance.toString())}
                  >
                    <Wallet size={14} /> Balance: {availableBalance.toLocaleString()}
                  </span>
               </div>
               
               <div className="flex items-center gap-6">
                  <div className="relative group/select">
                     <button className="flex items-center gap-3 bg-deti-bg hover:bg-white/5 border border-deti-border rounded-2xl px-4 py-3 transition-all min-w-[140px]">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${fromAsset === 'USDT' ? 'bg-[#26A17B]' : 'bg-[#F7931A]'}`}>
                          {fromAsset[0]}
                        </div>
                        <span className="font-bold text-xl text-white">{fromAsset}</span>
                        <ChevronDown size={18} className="text-deti-subtext ml-auto" />
                     </button>
                     {/* Dropdown */}
                     <div className="absolute top-full left-0 mt-2 w-full bg-deti-card border border-deti-border rounded-xl shadow-2xl overflow-hidden hidden group-hover/select:block z-50">
                        {supportedAssets.filter(a => a !== toAsset).map(asset => (
                           <button 
                             key={asset} 
                             onClick={() => setFromAsset(asset)}
                             className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm font-bold text-gray-300 hover:text-white"
                           >
                              {asset}
                           </button>
                        ))}
                     </div>
                  </div>
                  
                  <input 
                     type="number"
                     value={fromAmount}
                     onChange={(e) => setFromAmount(e.target.value)}
                     className="flex-1 bg-transparent text-right text-4xl lg:text-5xl font-bold text-white placeholder-deti-border outline-none"
                     placeholder="0.00"
                  />
               </div>
            </div>

            {/* SWITCHER */}
            <div className="flex justify-center -my-6 relative z-20">
               <button 
                 onClick={() => {
                    setFromAsset(toAsset);
                    setToAsset(fromAsset);
                 }}
                 className="bg-deti-bg border-4 border-deti-card p-3 rounded-2xl text-deti-primary hover:text-white hover:bg-deti-primary hover:scale-110 transition-all shadow-xl brand-lighting-box"
               >
                  <ArrowDown size={24} />
               </button>
            </div>

            {/* TO CARD */}
            <div className="bg-deti-card border border-deti-border rounded-3xl p-6 pt-8 shadow-lg transition-all hover:border-deti-primary/30 brand-lighting-box">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-deti-subtext uppercase tracking-wide">To (Estimated)</span>
               </div>
               
               <div className="flex items-center gap-6">
                  <div className="relative group/select">
                     <button className="flex items-center gap-3 bg-deti-bg hover:bg-white/5 border border-deti-border rounded-2xl px-4 py-3 transition-all min-w-[140px]">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${toAsset === 'USDT' ? 'bg-[#26A17B]' : 'bg-[#627EEA]'}`}>
                          {toAsset[0]}
                        </div>
                        <span className="font-bold text-xl text-white">{toAsset}</span>
                        <ChevronDown size={18} className="text-deti-subtext ml-auto" />
                     </button>
                     <div className="absolute top-full left-0 mt-2 w-full bg-deti-card border border-deti-border rounded-xl shadow-2xl overflow-hidden hidden group-hover/select:block z-50">
                        {supportedAssets.filter(a => a !== fromAsset).map(asset => (
                           <button 
                             key={asset} 
                             onClick={() => setToAsset(asset)}
                             className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm font-bold text-gray-300 hover:text-white"
                           >
                              {asset}
                           </button>
                        ))}
                     </div>
                  </div>
                  
                  <input 
                     type="text"
                     readOnly
                     value={toAmount}
                     className="flex-1 bg-transparent text-right text-4xl lg:text-5xl font-bold text-deti-success placeholder-deti-border outline-none cursor-default"
                     placeholder="0.00"
                  />
               </div>
            </div>
         </div>

         {/* ACTION BUTTON - Brand Gradient */}
         <div className="mt-8">
            <button 
               onClick={handleSwap}
               disabled={loading || !fromAmount || parseFloat(fromAmount) > availableBalance}
               className="w-full py-5 bg-gradient-brand hover:brightness-110 text-white text-xl font-bold rounded-2xl shadow-glow transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:scale-100 flex items-center justify-center gap-3"
            >
               {loading ? <RefreshCw className="animate-spin" /> : <>Preview Conversion <ArrowRightLeft size={20} /></>}
            </button>
            {parseFloat(fromAmount) > availableBalance && (
               <div className="flex items-center justify-center gap-2 mt-4 text-deti-danger font-medium animate-pulse">
                  <AlertCircle size={16} /> Insufficient {fromAsset} Balance
               </div>
            )}
         </div>

      </div>

      {/* RIGHT PANEL: Context & Chart */}
      <div className="hidden lg:flex flex-1 z-10 bg-deti-bg/50 backdrop-blur-md border-l border-deti-border p-12 flex-col justify-center">
         
         {/* Rate Info Card */}
         <div className="bg-deti-card/50 border border-deti-border rounded-3xl p-8 mb-8 brand-lighting-box">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h3 className="text-deti-subtext font-bold uppercase tracking-wider text-sm mb-1">Exchange Rate</h3>
                  <div className="text-3xl font-bold text-white font-mono flex items-baseline gap-2">
                     1 {fromAsset} ≈ {rate.toFixed(6)} {toAsset}
                     <span className="text-sm font-bold text-deti-success bg-deti-success/10 px-2 py-0.5 rounded-lg">+1.2%</span>
                  </div>
               </div>
               <div className="text-right">
                   <div className="text-deti-subtext font-bold uppercase tracking-wider text-sm mb-1">Quote Update</div>
                   <div className="flex items-center justify-end gap-2 text-deti-primary font-bold font-mono">
                      <RefreshCw size={14} className={quoteTimer < 5 ? 'animate-spin' : ''} /> {quoteTimer}s
                   </div>
               </div>
            </div>

            {/* Simple Rate Chart - Uses Brand Orange */}
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={rateHistory}>
                     <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <Tooltip 
                        contentStyle={{backgroundColor: '#14151F', border: '1px solid #262935', borderRadius: '12px'}} 
                        itemStyle={{color: '#fff'}}
                        labelStyle={{display: 'none'}}
                     />
                     <Area type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Market Stats */}
         <div className="grid grid-cols-2 gap-6">
            <div className="bg-deti-card/30 border border-deti-border rounded-2xl p-6 brand-lighting-box">
               <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><TrendingUp size={20} /></div>
                  <span className="text-deti-subtext font-bold text-sm">24h Vol</span>
               </div>
               <div className="text-2xl font-bold text-white">$1.2B</div>
            </div>
            <div className="bg-deti-card/30 border border-deti-border rounded-2xl p-6 brand-lighting-box">
               <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><History size={20} /></div>
                  <span className="text-deti-subtext font-bold text-sm">Recent Trades</span>
               </div>
               <div className="text-2xl font-bold text-white">4,230</div>
            </div>
         </div>

      </div>

      {/* Success Modal */}
      {showSuccess && (
         <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-deti-card border border-deti-border rounded-3xl p-10 max-w-md w-full text-center shadow-2xl scale-100 animate-in zoom-in-95 brand-lighting-box">
               <div className="w-20 h-20 bg-deti-success/20 text-deti-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(74,222,128,0.4)]">
                  <CheckCircle2 size={40} />
               </div>
               <h2 className="text-3xl font-bold text-white mb-2">Swap Complete!</h2>
               <p className="text-deti-subtext mb-8 text-lg">
                  You successfully swapped <strong className="text-white">{fromAsset}</strong> to <strong className="text-white">{toAsset}</strong>.
               </p>
               <button 
                  onClick={() => setShowSuccess(false)}
                  className="w-full py-3 bg-deti-bg border border-deti-border text-white rounded-xl font-bold hover:bg-white/5 transition-colors"
               >
                  Done
               </button>
            </div>
         </div>
      )}
    </div>
  );
};
