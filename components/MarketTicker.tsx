
import React from 'react';
import { MarketPair } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const MarketTicker: React.FC<{ pairs: MarketPair[] }> = React.memo(({ pairs }) => {
  return (
    <div className="w-full bg-deti-surface border-b border-white/5 overflow-hidden py-2">
      <div className="flex animate-[scroll_30s_linear_infinite] gap-8 min-w-full px-4 hover:[animation-play-state:paused]">
        {[...pairs, ...pairs, ...pairs].map((pair, idx) => (
          <div key={`${pair.symbol}-${idx}`} className="flex items-center gap-2 whitespace-nowrap min-w-fit">
            <span className="font-bold text-sm text-gray-300">{pair.symbol}</span>
            <span className={`text-sm ${pair.change24h >= 0 ? 'text-deti-success' : 'text-deti-danger'}`}>
              ${pair.price.toLocaleString()}
            </span>
            <span className={`text-xs flex items-center ${pair.change24h >= 0 ? 'text-deti-success' : 'text-deti-danger'}`}>
              {pair.change24h >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(pair.change24h).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
});
