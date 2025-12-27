
import React, { useState } from 'react';
import { Order } from '../types';
import { Plus, ChevronDown, Wallet } from 'lucide-react';

interface BuySellPanelProps {
  currentPrice: number;
  pair: string; // Added pair prop to display correct asset names
  onPlaceOrder: (order: Partial<Order>) => void;
}

export const BuySellPanel: React.FC<BuySellPanelProps> = ({ currentPrice, pair, onPlaceOrder }) => {
  const [side, setSide] = useState<'Buy' | 'Sell'>('Buy');
  const [orderType, setOrderType] = useState('Limit');
  
  const [price, setPrice] = useState(currentPrice.toFixed(2));
  const [amount, setAmount] = useState('');
  
  const [postOnly, setPostOnly] = useState(false);
  const [sliderVal, setSliderVal] = useState(0);

  // Derive assets from pair string (e.g., "BTC/USDT")
  const [baseAsset, quoteAsset] = pair.split('/');
  const total = (parseFloat(price) || 0) * (parseFloat(amount) || 0);

  const updateAmountFromPercentage = (percentage: number) => {
    setSliderVal(percentage);
    // Mock calculation for demo purposes
    if (percentage > 0) {
        // Assuming user has 10,000 USDT mock balance or 1 BTC
        const balance = side === 'Buy' ? 10000 : 1; 
        const maxAmt = side === 'Buy' ? balance / (parseFloat(price) || currentPrice) : balance;
        setAmount((maxAmt * (percentage / 100)).toFixed(5));
    } else {
        setAmount('');
    }
  };

  const handleSubmit = () => {
    if (!amount) return;
    onPlaceOrder({
      type: orderType as any,
      side: side,
      price: parseFloat(price),
      amount: parseFloat(amount),
      total: total,
    });
    setAmount('');
    setSliderVal(0);
  };

  return (
    <div className="bg-transparent flex flex-col h-full overflow-hidden border-l border-deti-border">
      {/* Header Tabs */}
      <div className="flex items-center justify-between px-2 h-9 border-b border-deti-border bg-deti-card/80 backdrop-blur-sm shrink-0">
         <div className="flex gap-1">
            <button className="text-[11px] font-bold text-deti-text bg-deti-border px-2 py-0.5 rounded">Order form</button>
            <button className="text-[11px] font-bold text-deti-subtext hover:text-deti-text px-2 py-0.5">Alerts</button>
         </div>
         <div className="flex items-center gap-2">
            <Plus size={14} className="text-deti-subtext"/>
         </div>
      </div>

      <div className="p-3 flex-1 overflow-y-auto custom-scrollbar">
        {/* Buy / Sell Toggle */}
        <div className="flex bg-deti-surface p-1 rounded mb-4">
           <button 
             onClick={() => setSide('Buy')}
             className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${side === 'Buy' ? 'bg-[#2ebd85] text-white shadow-sm' : 'text-deti-subtext hover:text-deti-text'}`}
           >
             Buy
           </button>
           <button 
             onClick={() => setSide('Sell')}
             className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${side === 'Sell' ? 'bg-[#f6465d] text-white shadow-sm' : 'text-deti-subtext hover:text-deti-text'}`}
           >
             Sell
           </button>
        </div>

        {/* Order Type Dropdown */}
        <div className="flex items-center justify-between mb-4 bg-deti-card p-2 rounded border border-deti-border hover:border-deti-subtext cursor-pointer transition-colors">
           <span className="text-xs font-bold text-deti-text">{orderType}</span>
           <ChevronDown size={14} className="text-deti-subtext" />
        </div>

        {/* Available Balance */}
        <div className="flex justify-between items-center mb-2 text-[11px]">
           <span className="text-deti-subtext border-b border-dashed border-deti-border cursor-help">Avbl</span>
           <span className="text-deti-text font-mono flex items-center gap-1">
              <Wallet size={10} className="text-deti-subtext" />
              <span>-- {side === 'Buy' ? quoteAsset : baseAsset}</span>
              <Plus size={10} className="border border-deti-subtext rounded-full p-[1px] cursor-pointer hover:bg-deti-subtext hover:text-deti-bg"/>
           </span>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <InputGroup label="Price" value={price} setValue={setPrice} suffix={quoteAsset} />
          <InputGroup label="Amount" value={amount} setValue={setAmount} suffix={baseAsset} />
          {/* Slider */}
          <div className="pt-2 px-1">
             <input 
               type="range" 
               min="0" 
               max="100" 
               step="25"
               value={sliderVal}
               onChange={(e) => updateAmountFromPercentage(parseInt(e.target.value))}
               className={`w-full h-1 rounded-lg appearance-none cursor-pointer ${side === 'Buy' ? 'accent-deti-success' : 'accent-deti-danger'} bg-deti-border`} 
             />
             <div className="flex justify-between mt-1 px-1">
                {[0, 25, 50, 75, 100].map(p => (
                   <span 
                    key={p} 
                    className={`text-[9px] cursor-pointer hover:text-white ${sliderVal === p ? 'text-white font-bold' : 'text-deti-subtext'}`}
                    onClick={() => updateAmountFromPercentage(p)}
                   >
                     {p}%
                   </span>
                ))}
             </div>
          </div>
          
          <InputGroup label="Total" value={total > 0 ? total.toFixed(2) : ''} setValue={()=>{}} suffix={quoteAsset} readOnly />

          {/* Toggles */}
          <div className="flex justify-between items-center py-1 mt-2">
             <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="postOnly"
                  checked={postOnly} 
                  onChange={()=>setPostOnly(!postOnly)} 
                  className={`rounded bg-deti-surface border-deti-border focus:ring-0 w-3 h-3 ${side === 'Buy' ? 'text-deti-success' : 'text-deti-danger'}`} 
                />
                <label htmlFor="postOnly" className="text-[10px] text-deti-subtext cursor-pointer select-none">Post Only</label>
             </div>
          </div>

          {/* Primary Action Button - UPDATED */}
          <button 
            onClick={handleSubmit}
            className={`
               w-full py-3 rounded-lg font-bold text-sm text-white shadow-lg transition-all active:scale-[0.98] mt-4 
               ${side === 'Buy' 
                  ? 'bg-[#2ebd85] hover:brightness-110 shadow-[0_4px_12px_rgba(46,189,133,0.2)]' 
                  : 'bg-[#f6465d] hover:brightness-110 shadow-[0_4px_12px_rgba(246,70,93,0.2)]'
               }
            `}
          >
             {side} {baseAsset}
          </button>

          {/* Fee Estimate */}
          <div className="flex justify-between items-center text-[10px] text-deti-subtext pt-3 border-t border-deti-border mt-2">
             <span className="border-b border-dashed border-deti-border">Est. Fee</span>
             <span className="font-mono">0.012 {quoteAsset}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface InputGroupProps {
  label: string;
  value: string;
  setValue: (val: string) => void;
  suffix: string;
  readOnly?: boolean;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, value, setValue, suffix, readOnly }) => (
  <div className="bg-deti-card border border-deti-border rounded-lg px-3 py-2 flex flex-col group focus-within:border-deti-subtext transition-colors relative">
     <div className="flex justify-between items-center mb-0.5">
        <label className="text-[10px] text-deti-subtext font-bold uppercase">{label}</label>
     </div>
     <div className="flex justify-between items-center">
        <input 
          type="number" 
          value={value}
          readOnly={readOnly}
          onChange={(e) => setValue(e.target.value)}
          className="bg-transparent w-full outline-none text-sm text-deti-text font-mono placeholder-deti-subtext font-bold"
          placeholder="0.00"
        />
        <span className="text-[10px] font-bold text-deti-subtext ml-2 shrink-0">{suffix}</span>
     </div>
  </div>
);
