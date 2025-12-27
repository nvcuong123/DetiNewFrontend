
import React, { useState } from 'react';
import { MarketPair, AppView } from '../types';
import { 
  Search, Star, Filter, 
  Activity, Layers, Zap, Globe, Lock, Coins, Gamepad2, Database,
  Maximize2, ArrowRight, Shield
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';

interface MarketOverviewProps {
  setView: (view: AppView) => void;
  onNavigateToTrade: (pair: MarketPair) => void;
}

// --- UNIFIED CHART DATA ---
const generateUnifiedChartData = (points: number) => {
  let values = {
    DeFi: 100,
    L1: 95,
    Gaming: 80,
    Stable: 100,
    Privacy: 90
  };
  
  return Array.from({ length: points }, (_, i) => {
    const point: any = { name: i };
    (Object.keys(values) as Array<keyof typeof values>).forEach(key => {
        const volatility = key === 'Stable' ? 0.002 : 0.03;
        values[key] = values[key] * (1 + (Math.random() - 0.5) * volatility);
        point[key] = values[key];
    });
    return point;
  });
};

const CHART_DATA = generateUnifiedChartData(60);

const INDICES_CONFIG = [
  { key: 'DeFi', color: '#F59E0B' },
  { key: 'L1', name: 'Layer 1', color: '#3B82F6' },
  { key: 'Gaming', color: '#EC4899' },
  { key: 'Stable', name: 'Stablecoin', color: '#10B981' },
  { key: 'Privacy', color: '#8B5CF6' },
];

// --- MOCK DATA FOR HEATMAP ---
const HEATMAP_DATA = [
  { id: 1, name: 'Stablecoin', value: 629, change: -0.02, color: 'bg-[#1e293b]', icon: <Lock size={16} /> },
  { id: 2, name: 'Privacy', value: 38.6, change: 1.04, color: 'bg-[#064e3b]', icon: <Shield size={16} /> }, 
  { id: 3, name: 'DEX', value: 10.9, change: -4.26, color: 'bg-[#450a0a]', icon: <Activity size={16} /> }, 
  { id: 4, name: 'Layer 2', value: 4.31, change: -6.11, color: 'bg-[#450a0a]', icon: <Layers size={16} /> },
  { id: 5, name: 'Gaming', value: 2.74, change: -6.15, color: 'bg-[#450a0a]', icon: <Gamepad2 size={16} /> },
  { id: 6, name: 'Payment', value: 422, change: -4.47, color: 'bg-[#450a0a]', icon: <Coins size={16} /> },
  { id: 7, name: 'Meme Coins', value: 22.9, change: -5.61, color: 'bg-[#450a0a]', icon: <Zap size={16} /> },
  { id: 8, name: 'Infrastructure', value: 10.7, change: -6.48, color: 'bg-[#450a0a]', icon: <Database size={16} /> },
  { id: 9, name: 'Culture', value: 2.73, change: -8.54, color: 'bg-[#7f1d1d]', icon: <Globe size={16} /> },
  { id: 10, name: 'Layer 1', value: 322, change: -5.40, color: 'bg-[#450a0a]', icon: <Layers size={16} /> },
  { id: 11, name: 'Utility', value: 13.5, change: -6.46, color: 'bg-[#450a0a]', icon: <Zap size={16} /> },
  { id: 12, name: 'DeFi', value: 9.41, change: -7.14, color: 'bg-[#450a0a]', icon: <Activity size={16} /> },
];

// --- EXTENDED MARKET DATA ---
const EXTENDED_MARKETS: any[] = [
  { symbol: 'BTC', name: 'Bitcoin', quote: 'USDT', cat: 'Layer 1', price: 85667, low: 85140, high: 89999, change: -4.12, vol: '531M', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ether', quote: 'USDT', cat: 'Layer 1', price: 2923.0, low: 2894.0, high: 3178.0, change: -5.99, vol: '282M', color: '#627EEA' },
  { symbol: 'DETI', name: 'DETI Token', quote: 'USDT', cat: 'Utility', price: 1.25, low: 1.10, high: 1.45, change: 12.30, vol: '150M', color: '#F59E0B' },
  { symbol: 'SOL', name: 'Solana', quote: 'USDT', cat: 'Layer 1', price: 131.97, low: 128.5, high: 140.2, change: -0.5, vol: '89M', color: '#14F195' },
  { symbol: 'USDC', name: 'USDC', quote: 'EUR', cat: 'Stablecoin', price: 0.8507, low: 0.8495, high: 0.8526, change: -0.14, vol: '129M', color: '#2775CA' },
  { symbol: 'USDT', name: 'Tether', quote: 'USD', cat: 'Stablecoin', price: 0.99939, low: 0.99971, high: 1.0001, change: -0.02, vol: '125M', color: '#26A17B' },
  { symbol: 'ADA', name: 'Cardano', quote: 'USDT', cat: 'Layer 1', price: 0.4044, low: 0.402, high: 0.415, change: -0.85, vol: '32M', color: '#0033AD' },
  { symbol: 'XRP', name: 'XRP', quote: 'USDT', cat: 'Payment', price: 2.00, low: 1.95, high: 2.05, change: -0.77, vol: '45M', color: '#23292F' },
  { symbol: 'DOGE', name: 'Dogecoin', quote: 'USDT', cat: 'Meme', price: 0.15, low: 0.14, high: 0.16, change: -5.61, vol: '22M', color: '#BA9F33' },
  { symbol: 'DOT', name: 'Polkadot', quote: 'USDT', cat: 'Layer 0', price: 6.50, low: 6.40, high: 6.80, change: -6.48, vol: '10M', color: '#E6007A' },
];

// Helper to generate sparkline data for table
const generateSparklineData = (price: number) => {
    return Array.from({length: 20}, () => ({ value: price * (1 + (Math.random() - 0.5) * 0.05) }));
};

export const MarketOverview: React.FC<MarketOverviewProps> = ({ setView, onNavigateToTrade }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('1D');
  const [activeTab, setActiveTab] = useState('All');

  return (
    // Changed bg-deti-bg to bg-transparent to allow global background to show through
    <div className="flex-1 h-full overflow-y-auto bg-transparent text-white custom-scrollbar pb-20 lg:pb-0">
      <div className="p-4 lg:p-6 space-y-4 max-w-[1800px] mx-auto">
        
        {/* Header Search & Title */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 pt-2 lg:pt-0">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deti-subtext" />
              <input 
                type="text" 
                placeholder="Search for a market" 
                className="w-full bg-deti-card border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-deti-primary/50 outline-none transition-all placeholder-deti-subtext"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-gray-400 border border-white/5">⌘ K</div>
           </div>
           
           <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 md:pb-0 no-scrollbar">
              <div className="bg-deti-card rounded-lg p-1 flex border border-white/5 shrink-0">
                 {['Crypto', '2.86B USD vol.'].map((t, i) => (
                    <button key={i} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${i === 0 ? 'bg-deti-bg text-white shadow-sm' : 'text-deti-subtext hover:text-white'}`}>
                       {t}
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* TOP SECTION: Charts & Heatmap */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
           
           {/* LEFT: Category Indices Chart */}
           <div className="bg-deti-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex flex-col brand-lighting-box h-[350px] lg:h-[400px]">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-gray-200 text-sm">Category indices</h3>
                 <div className="flex items-center gap-2">
                    <HelpIcon />
                    <div className="flex bg-deti-bg rounded-lg p-1 border border-white/5">
                       {['1D', '1W', '1M', '3M', '1Y'].map(t => (
                          <button 
                            key={t}
                            onClick={() => setTimeRange(t)} 
                            className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${timeRange === t ? 'bg-white/10 text-white' : 'text-deti-subtext hover:text-white'}`}
                          >
                             {t}
                          </button>
                       ))}
                    </div>
                    <button className="p-1.5 hover:bg-white/5 rounded text-deti-subtext"><Maximize2 size={14} /></button>
                 </div>
              </div>
              
              <div className="flex-1 w-full min-h-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={CHART_DATA}>
                        <XAxis dataKey="name" hide />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#14151F', borderColor: '#262935', fontSize: '12px', borderRadius: '8px' }}
                           itemStyle={{ padding: 0 }}
                           labelStyle={{ display: 'none' }}
                        />
                        {INDICES_CONFIG.map((cat) => (
                           <Line 
                             key={cat.key}
                             type="monotone" 
                             dataKey={cat.key}
                             stroke={cat.color} 
                             strokeWidth={2} 
                             dot={false}
                           />
                        ))}
                     </LineChart>
                  </ResponsiveContainer>
                  
                  {/* Legend Overlay */}
                  <div className="absolute top-0 left-2 flex flex-col gap-1 pointer-events-none bg-black/20 p-2 rounded-lg backdrop-blur-sm">
                     {INDICES_CONFIG.map(cat => {
                        const lastVal = CHART_DATA[CHART_DATA.length - 1][cat.key as keyof typeof CHART_DATA[0]];
                        const firstVal = CHART_DATA[0][cat.key as keyof typeof CHART_DATA[0]];
                        const change = ((Number(lastVal) - Number(firstVal)) / Number(firstVal)) * 100;
                        
                        return (
                           <div key={cat.key} className="flex items-center gap-2 text-[10px]">
                              <div className="w-2 h-2 rounded-full" style={{background: cat.color}}></div>
                              <span className="text-gray-300 font-medium w-16">{cat.name || cat.key}</span>
                              <span className={`font-mono ${change >= 0 ? 'text-deti-success' : 'text-deti-danger'}`}>
                                 {change > 0 ? '+' : ''}{change.toFixed(2)}%
                              </span>
                           </div>
                        );
                     })}
                  </div>
              </div>
           </div>

           {/* RIGHT: Heatmap */}
           <div className="bg-deti-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex flex-col brand-lighting-box h-auto min-h-[350px] lg:h-[400px]">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-gray-200 text-sm">Category indices heatmap</h3>
                 <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 text-[10px]">
                       <span className="text-deti-subtext">Scaled</span>
                       <div className="w-8 h-4 bg-deti-primary rounded-full relative cursor-pointer"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div></div>
                    </div>
                    <div className="flex bg-deti-bg rounded-lg p-1 border border-white/5">
                       <button className="px-3 py-1 bg-white/10 rounded text-[10px] font-bold text-white">Volume</button>
                       <button className="px-3 py-1 text-[10px] font-bold text-deti-subtext hover:text-white">Market cap</button>
                    </div>
                    <button className="p-1.5 hover:bg-white/5 rounded text-deti-subtext"><Maximize2 size={14} /></button>
                 </div>
              </div>

              {/* CSS Grid Heatmap Approximation */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 grid-rows-6 sm:grid-rows-3 gap-1">
                 {/* Large Block 1 - Stablecoin */}
                 <HeatmapTile item={HEATMAP_DATA[0]} className="col-span-1 row-span-1" />
                 <HeatmapTile item={HEATMAP_DATA[1]} className="col-span-1 row-span-1" />
                 <HeatmapTile item={HEATMAP_DATA[2]} className="col-span-1 row-span-1" />
                 <HeatmapTile item={HEATMAP_DATA[3]} className="col-span-1 row-span-1" />
                 
                 <HeatmapTile item={HEATMAP_DATA[5]} className="col-span-2 row-span-1" />
                 <HeatmapTile item={HEATMAP_DATA[6]} className="col-span-1 row-span-1" />
                 <HeatmapTile item={HEATMAP_DATA[7]} className="col-span-1 row-span-1" />

                 <HeatmapTile item={HEATMAP_DATA[9]} className="col-span-1 row-span-1" />
                 <HeatmapTile item={HEATMAP_DATA[10]} className="col-span-1 row-span-1" />
                 <HeatmapTile item={HEATMAP_DATA[11]} className="col-span-1 row-span-1" />
                 <HeatmapTile item={HEATMAP_DATA[4]} className="col-span-1 row-span-1" />
              </div>
           </div>
        </div>

        {/* BOTTOM SECTION: Market Table */}
        <div className="bg-deti-card/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden brand-lighting-box">
           
           {/* Table Filters */}
           <div className="flex items-center gap-2 p-4 border-b border-white/5 overflow-x-auto no-scrollbar">
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-xs font-bold text-white border border-white/10 hover:border-deti-primary whitespace-nowrap"><Star size={12}/> Favorites</button>
              <div className="w-[1px] h-6 bg-white/10 mx-2 shrink-0"></div>
              {['All', 'Spot', 'Futures', 'New', 'Hot', 'Earn'].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-deti-bg text-deti-primary shadow-sm' : 'text-deti-subtext hover:text-white'}`}
                 >
                    {tab}
                 </button>
              ))}
              <div className="ml-auto flex items-center gap-2">
                 <button className="p-1.5 hover:bg-white/5 rounded text-deti-subtext"><Filter size={14}/></button>
              </div>
           </div>

           {/* Table Header */}
           <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-deti-bg/50 text-[10px] font-bold text-deti-subtext uppercase tracking-wider border-b border-white/5 min-w-[800px]">
              <div className="col-span-3 lg:col-span-2">Market</div>
              <div className="col-span-2 lg:col-span-1">Price</div>
              <div className="col-span-2 text-right">24h Change</div>
              <div className="hidden lg:block col-span-2 text-right">24h Low / High</div>
              <div className="hidden lg:block col-span-2 text-center">24h Trend</div>
              <div className="hidden lg:block col-span-2 text-right">24h Volume</div>
              <div className="col-span-3 lg:col-span-1 text-center">Action</div>
           </div>

           {/* Table Body */}
           <div className="divide-y divide-white/5 overflow-x-auto">
              <div className="min-w-[800px]">
                {EXTENDED_MARKETS.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.symbol.toLowerCase().includes(searchTerm.toLowerCase())).map((market, idx) => (
                   <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors group">
                      
                      {/* Market Name */}
                      <div className="col-span-3 lg:col-span-2 flex items-center gap-3">
                         <Star size={14} className="text-deti-subtext hover:text-deti-primary cursor-pointer shrink-0" />
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-[10px] shadow-sm shrink-0" style={{ backgroundColor: market.color }}>
                               {market.symbol[0]}
                            </div>
                            <div>
                               <div className="flex items-center gap-1">
                                  <span className="text-sm font-bold text-white">{market.symbol}</span>
                                  <span className="text-[10px] bg-white/10 px-1 rounded text-gray-400 hidden sm:inline-block">{market.cat}</span>
                                </div>
                               <div className="text-xs text-deti-subtext">{market.name}</div>
                            </div>
                         </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 lg:col-span-1">
                         <div className="text-sm font-mono font-bold text-white">${market.price.toLocaleString()}</div>
                      </div>

                      {/* Change */}
                      <div className="col-span-2 text-right">
                         <div className={`text-sm font-bold ${market.change >= 0 ? 'text-deti-success' : 'text-deti-danger'}`}>
                            {market.change > 0 ? '+' : ''}{market.change}%
                         </div>
                      </div>

                      {/* Low/High */}
                      <div className="hidden lg:block col-span-2 text-right">
                         <div className="text-xs text-white font-mono">{market.high.toLocaleString()}</div>
                         <div className="text-[10px] text-deti-subtext font-mono">{market.low.toLocaleString()}</div>
                      </div>

                      {/* Trend Sparkline */}
                      <div className="hidden lg:block col-span-2 h-8 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={generateSparklineData(market.price)}>
                               <defs>
                                  <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                     <stop offset="0%" stopColor={market.change >= 0 ? '#10B981' : '#EF4444'} stopOpacity={0.3}/>
                                     <stop offset="100%" stopColor={market.change >= 0 ? '#10B981' : '#EF4444'} stopOpacity={0}/>
                                  </linearGradient>
                               </defs>
                               <Area 
                                 type="monotone" 
                                 dataKey="value" 
                                 stroke={market.change >= 0 ? '#10B981' : '#EF4444'} 
                                 fill={`url(#grad-${idx})`} 
                                 strokeWidth={2} 
                                 isAnimationActive={false}
                               />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>

                      {/* Volume */}
                      <div className="hidden lg:block col-span-2 text-right">
                         <div className="text-sm font-bold text-white">{market.vol} USD</div>
                         <div className="flex items-center justify-end gap-1 text-[10px] text-deti-primary">
                            <Star size={8} fill="currentColor" /> 0.00030%
                         </div>
                      </div>
                      
                      {/* Action */}
                      <div className="col-span-3 lg:col-span-1 text-center">
                          <button 
                             onClick={() => {
                                 const pair: MarketPair = {
                                     symbol: `${market.symbol}/${market.quote}`,
                                     base: market.symbol,
                                     quote: market.quote,
                                     price: market.price,
                                     change24h: market.change,
                                     volume24h: parseFloat(market.vol.replace('M','')) * 1000000
                                 };
                                 onNavigateToTrade(pair);
                             }}
                             className="p-2 bg-white/5 hover:bg-deti-primary hover:text-white rounded-lg text-deti-subtext transition-all w-full flex justify-center items-center gap-1"
                          >
                              <span className="lg:hidden text-xs font-bold">Trade</span> <ArrowRight size={16} />
                          </button>
                      </div>

                   </div>
                ))}
              </div>
           </div>
        </div>

        {/* Footer Bar - Left Aligned (No Left Padding) */}
        <div className="hidden lg:flex fixed bottom-0 left-0 right-0 bg-[#0F1019] border-t border-white/5 px-4 py-2 items-center justify-start text-xs text-deti-subtext z-[60] gap-6">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-deti-success"></div>
               <span className="text-white">Online</span>
            </div>
            <div className="flex gap-4 border-l border-white/10 pl-6">
               <span className="hover:text-white cursor-pointer flex items-center gap-1"><Star size={10} /> Favorites</span>
               <span className="text-white">BTC/USD <span className="text-deti-danger">-4.11%</span></span>
               <span className="text-white">ETH/USD <span className="text-deti-danger">-5.87%</span></span>
               <span className="text-white">DETI/USD <span className="text-deti-success">+12.3%</span></span>
            </div>
            <div className="flex gap-4 border-l border-white/10 pl-6">
               <span className="hover:text-white cursor-pointer">Share feedback</span>
            </div>
        </div>

      </div>
    </div>
  );
};

// Helper Components
const HelpIcon = () => (
   <div className="w-4 h-4 rounded-full border border-deti-subtext text-deti-subtext flex items-center justify-center text-[10px] cursor-pointer hover:border-white hover:text-white">?</div>
);

const HeatmapTile = ({ item, className }: { item: any, className?: string }) => (
   <div className={`rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.02] border border-white/5 ${item.color} ${className}`}>
      {/* Background Icon Opacity */}
      <div className="absolute right-2 bottom-2 opacity-10 text-white scale-150 group-hover:scale-125 transition-transform">
         {item.icon}
      </div>
      
      <div className="relative z-10 flex items-center gap-1.5 mb-1">
         <div className="p-1 rounded bg-black/20 text-white/80">{item.icon}</div>
         <span className="text-xs font-bold text-white truncate">{item.name}</span>
      </div>
      
      <div className="relative z-10">
         <div className="text-xs text-white/70">{item.value}M USD</div>
         <div className={`text-sm font-bold ${item.change >= 0 ? 'text-green-400' : 'text-red-300'}`}>
            {item.change > 0 ? '+' : ''}{item.change}%
         </div>
      </div>
   </div>
);
