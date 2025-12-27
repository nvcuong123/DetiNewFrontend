
import React from 'react';
import { AppView } from '../types';
import { LayoutGrid, TrendingUp, Wallet, RefreshCw, User } from 'lucide-react';

interface BottomNavProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Home', icon: LayoutGrid },
    { id: AppView.TRADING, label: 'Trade', icon: TrendingUp },
    { id: AppView.SWAP, label: 'Swap', icon: RefreshCw },
    { id: AppView.WALLET, label: 'Wallet', icon: Wallet },
    { id: AppView.SETTINGS, label: 'Account', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-[80px] bg-deti-card/90 backdrop-blur-xl border-t border-deti-border flex items-start justify-around px-2 z-50 pb-safe pt-3 shadow-[0_-5px_20px_rgba(0,0,0,0.2)]">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center w-full gap-1 transition-all duration-300 ${
              isActive ? 'text-deti-primary -translate-y-1' : 'text-deti-subtext hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-deti-primary/10 scale-110' : 'bg-transparent'}`}>
               <item.icon size={22} className={isActive ? 'fill-current' : ''} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-deti-primary' : 'text-deti-subtext'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
