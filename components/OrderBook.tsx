
import React, { useMemo } from 'react';
import { ArrowUp, ChevronDown, Plus, Minus, Maximize2 } from 'lucide-react';

interface OrderBookProps {
  currentPrice: number;
}

// Helper for large numbers
const formatCompact = (num: number) => {
  if (num >= 1000) return (num/1000).toFixed(2) + 'K';
  return num.toFixed(4);
};

interface RowItemProps {
  item: {
    price: number;
    amount: number;
    total: number;
  };
  type: 'ask' | 'bid';
  maxVol: number;
}

const RowItem: React.FC<RowItemProps> = React.memo(({ item, type, maxVol }) => (
  <div className="flex relative cursor-pointer hover:bg-deti-surface group h-[18px] items-center text-[11px] font-mono leading-none">
      {/* Depth Bar */}
      <div 
          className={`absolute right-0 top-0 bottom-0 opacity-10 transition-all z-0 ${type === 'ask' ? 'bg-[#f6465d]' : 'bg-[#2ebd85]'}`} 
          style={{ width: `${(item.amount / maxVol) * 100}%` }}
      />
      <div className={`w-[34%] text-left pl-2 z-10 ${type === 'ask' ? 'text-deti-danger' : 'text-deti-success'}`}>
          {item.price.toFixed(1)}
      </div>
      <div className="w-[33%] text-right text-gray-400 z-10">
          {item.amount.toFixed(5)}
      </div>
      <div className="w-[33%] text-right pr-2 text-deti-subtext z-10 group-hover:text-deti-text">
          {formatCompact(item.total)}
      </div>
  </div>
));

export const OrderBook: React.FC<OrderBookProps> = React.memo(({ currentPrice }) => {
  // Generate mock data - memoized to prevent recreation on every render unless price shifts significantly
  // In a real app, this data would come from websocket
  const asks = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => {
      const indexFromSpread = 15 - i; 
      return {
        price: currentPrice + (indexFromSpread + 1) * (currentPrice * 0.0001),
        amount: Math.random() * 0.5 + 0.01,
        total: 0, 
      };
    }).map(item => ({ ...item, total: item.price * item.amount }));
  }, [currentPrice]); // Only recalc if currentPrice reference changes

  const bids = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      price: currentPrice - (i + 1) * (currentPrice * 0.0001),
      amount: Math.random() * 0.5 + 0.01,
      total: 0,
    })).map(item => ({ ...item, total: item.price * item.amount }));
  }, [currentPrice]);

  const maxVol = Math.max(...asks.map(a => a.amount), ...bids.map(b => b.amount));
  const spread = asks[asks.length-1].price - bids[0].price;
  const spreadPct = (spread / currentPrice) * 100;

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-2 h-9 border-b border-deti-border bg-deti-card/80 backdrop-blur-sm shrink-0 z-20">
        <div className="flex gap-1">
           <button className="text-[11px] font-bold text-deti-text bg-deti-border px-2 py-0.5 rounded">Order book</button>
           <button className="text-[11px] font-bold text-deti-subtext hover:text-deti-text px-2 py-0.5">Market trades</button>
        </div>
        <div className="flex gap-1">
           <button className="p-1 text-deti-subtext hover:bg-deti-border rounded"><Plus size={12}/></button>
           <button className="p-1 text-deti-subtext hover:bg-deti-border rounded"><Minus size={12}/></button>
           <button className="p-1 text-deti-subtext hover:bg-deti-border rounded"><Maximize2 size={12}/></button>
        </div>
      </div>
      
      {/* Grouping Options (Icons) */}
      <div className="flex justify-between items-center px-2 py-1 border-b border-deti-border bg-deti-card/80">
         <div className="flex gap-2">
            <div className="w-4 h-4 border border-deti-subtext/50 rounded flex flex-col p-[1px] gap-[1px]">
               <div className="bg-[#f6465d] h-1.5 w-full"></div>
               <div className="bg-[#2ebd85] h-1.5 w-full"></div>
            </div>
            <div className="w-4 h-4 border border-deti-subtext/50 rounded flex flex-col p-[1px]">
               <div className="bg-[#2ebd85] h-full w-full"></div>
            </div>
            <div className="w-4 h-4 border border-deti-subtext/50 rounded flex flex-col p-[1px]">
               <div className="bg-[#f6465d] h-full w-full"></div>
            </div>
         </div>
         <div className="flex items-center gap-1 bg-deti-surface px-2 py-0.5 rounded border border-deti-border">
            <span className="text-[10px] text-deti-subtext">0.10</span>
            <ChevronDown size={10} className="text-deti-subtext"/>
         </div>
      </div>

      {/* Columns Header */}
      <div className="flex px-2 py-1 text-[10px] text-deti-subtext font-bold uppercase shrink-0">
        <div className="w-[34%] text-left pl-1">Price</div>
        <div className="w-[33%] text-right">Quantity</div>
        <div className="w-[33%] text-right pr-1">Total</div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* ASKS (Sells) */}
        <div className="flex-1 flex flex-col justify-end overflow-hidden pb-1">
           {asks.map((ask, i) => <RowItem key={`ask-${i}`} item={ask} type="ask" maxVol={maxVol} />)}
        </div>

        {/* SPREAD INDICATOR */}
        <div className="shrink-0 h-8 border-y border-deti-border bg-deti-surface z-10 flex items-center justify-between px-3 my-0.5">
           <div className={`text-base font-bold font-mono tracking-tight ${Math.random() > 0.5 ? 'text-deti-success' : 'text-deti-danger'}`}>
             {currentPrice.toFixed(1)} 
             <ArrowUp size={12} className="inline ml-1 mb-0.5 rotate-45" />
           </div>
           <span className="text-[10px] text-deti-subtext">Spread: {spread.toFixed(1)} ({spreadPct.toFixed(3)}%)</span>
        </div>

        {/* BIDS (Buys) */}
        <div className="flex-1 overflow-hidden pt-1">
           {bids.map((bid, i) => <RowItem key={`bid-${i}`} item={bid} type="bid" maxVol={maxVol} />)}
        </div>
      </div>
    </div>
  );
});
