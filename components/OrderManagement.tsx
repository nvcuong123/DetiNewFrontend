
import React, { useState } from 'react';
import { Order } from '../types';
import { Clock, Filter } from 'lucide-react';

interface OrderManagementProps {
  openOrders: Order[];
  orderHistory: Order[];
  onCancelOrder: (id: string) => void;
}

type TabType = 'Open orders' | 'Conditional orders' | 'Closed orders' | 'Trades';

export const OrderManagement: React.FC<OrderManagementProps> = ({ openOrders, orderHistory, onCancelOrder }) => {
  const [activeTab, setActiveTab] = useState<TabType>('Open orders');

  const tabs: TabType[] = ['Open orders', 'Conditional orders', 'Closed orders', 'Trades'];

  // Mock data for other tabs to demonstrate interactivity
  const conditionalOrders: Order[] = [
    { id: 'COND-1', pair: 'BTC/USDT', type: 'Stop Limit', side: 'Sell', price: 85000, triggerPrice: 85500, amount: 0.5, filled: 0, total: 42500, status: 'Open', date: '2024-05-19 10:00' },
    { id: 'COND-2', pair: 'ETH/USDT', type: 'Stop Limit', side: 'Buy', price: 2800, triggerPrice: 2850, amount: 10, filled: 0, total: 28000, status: 'Open', date: '2024-05-19 11:30' }
  ];

  const marketTrades: Order[] = [
     { id: 'TRD-1', pair: 'BTC/USDT', type: 'Market', side: 'Buy', price: 89605.5, amount: 0.052, filled: 0.052, total: 4659.4, status: 'Filled', date: '14:20:05' },
     { id: 'TRD-2', pair: 'BTC/USDT', type: 'Market', side: 'Sell', price: 89605.0, amount: 0.15, filled: 0.15, total: 13440.7, status: 'Filled', date: '14:20:02' },
     { id: 'TRD-3', pair: 'BTC/USDT', type: 'Market', side: 'Buy', price: 89606.0, amount: 0.01, filled: 0.01, total: 896.0, status: 'Filled', date: '14:19:55' },
     { id: 'TRD-4', pair: 'BTC/USDT', type: 'Market', side: 'Sell', price: 89604.5, amount: 0.5, filled: 0.5, total: 44802.2, status: 'Filled', date: '14:19:50' },
  ];

  const renderTableBody = () => {
    switch (activeTab) {
      case 'Open orders':
        return openOrders.length > 0 ? openOrders.map((order) => (
          <tr key={order.id} className="hover:bg-deti-surface transition-colors group">
            <Td className="text-deti-subtext">{order.date}</Td>
            <Td className="font-bold text-white">{order.pair}</Td>
            <Td className="text-gray-400">{order.type}</Td>
            <Td className={`font-bold ${order.side === 'Buy' ? 'text-deti-success' : 'text-deti-danger'}`}>{order.side}</Td>
            <Td className="text-white">{order.price.toLocaleString()}</Td>
            <Td className="text-white">{order.amount}</Td>
            <Td className="text-white">{((order.filled / order.amount) * 100).toFixed(1)}%</Td>
            <Td className="text-gray-400">{order.total.toLocaleString()}</Td>
            <Td className="text-right">
              <button 
                onClick={() => onCancelOrder(order.id)}
                className="text-[10px] font-bold text-deti-primary border border-deti-primary/30 hover:bg-deti-primary hover:text-white rounded px-3 py-1 transition-all opacity-0 group-hover:opacity-100"
              >
                Cancel
              </button>
            </Td>
          </tr>
        )) : (
           <tr><td colSpan={9}><EmptyState message="No open orders" /></td></tr>
        );

      case 'Closed orders':
        return orderHistory.length > 0 ? orderHistory.map((order) => (
          <tr key={order.id} className="hover:bg-deti-surface opacity-70">
            <Td className="text-deti-subtext">{order.date}</Td>
            <Td className="font-bold text-white">{order.pair}</Td>
            <Td className="text-gray-400">{order.type}</Td>
            <Td className={`font-bold ${order.side === 'Buy' ? 'text-deti-success' : 'text-deti-danger'}`}>{order.side}</Td>
            <Td className="text-white">{order.price.toLocaleString()}</Td>
            <Td className="text-white">{order.amount}</Td>
            <Td className="text-white">{order.filled}</Td>
            <Td className="text-gray-400">{order.total.toLocaleString()}</Td>
            <Td className="text-right text-[10px] font-bold text-deti-success">{order.status}</Td>
          </tr>
        )) : (
           <tr><td colSpan={9}><EmptyState message="No closed orders" /></td></tr>
        );

      case 'Conditional orders':
        return conditionalOrders.map((order) => (
          <tr key={order.id} className="hover:bg-deti-surface transition-colors">
            <Td className="text-deti-subtext">{order.date}</Td>
            <Td className="font-bold text-white">{order.pair}</Td>
            <Td className="text-gray-400">{order.type}</Td>
            <Td className={`font-bold ${order.side === 'Buy' ? 'text-deti-success' : 'text-deti-danger'}`}>{order.side}</Td>
            <Td className="text-white">{order.price.toLocaleString()} <span className="text-[9px] text-deti-subtext ml-1">(Trig: {order.triggerPrice})</span></Td>
            <Td className="text-white">{order.amount}</Td>
            <Td className="text-white">0%</Td>
            <Td className="text-gray-400">{order.total.toLocaleString()}</Td>
            <Td className="text-right text-[10px] font-bold text-deti-primary">Active</Td>
          </tr>
        ));

      case 'Trades':
        return marketTrades.map((trade) => (
          <tr key={trade.id} className="hover:bg-deti-surface transition-colors">
            <Td className="text-deti-subtext">{trade.date}</Td>
            <Td className="font-bold text-white">{trade.pair}</Td>
            <Td className="text-gray-400">Market</Td>
            <Td className={`font-bold ${trade.side === 'Buy' ? 'text-deti-success' : 'text-deti-danger'}`}>{trade.side}</Td>
            <Td className="text-white">{trade.price.toLocaleString()}</Td>
            <Td className="text-white">{trade.amount}</Td>
            <Td className="text-white">100%</Td>
            <Td className="text-gray-400">{trade.total.toLocaleString()}</Td>
            <Td className="text-right text-[10px] font-bold text-deti-subtext">Completed</Td>
          </tr>
        ));
        
      default:
        return <tr><td colSpan={9}><EmptyState message="No data" /></td></tr>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-deti-bg overflow-hidden text-sm">
      {/* Tabs Header */}
      <div className="flex items-end border-b border-deti-border bg-deti-card/50 px-2 gap-2 overflow-x-auto no-scrollbar shrink-0 h-10">
        {tabs.map(tab => {
           const isActive = activeTab === tab;
           // Only show count badge for Open Orders
           const count = tab === 'Open orders' ? openOrders.length : (tab === 'Conditional orders' ? conditionalOrders.length : 0);
           
           return (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                group relative px-4 py-2 text-[11px] font-bold transition-all flex items-center gap-2 rounded-t-lg whitespace-nowrap cursor-pointer select-none
                ${isActive 
                  ? 'text-white bg-deti-bg border-t-2 border-t-deti-primary border-x border-deti-border/30 z-10 -mb-[1px] pb-2.5' 
                  : 'text-deti-subtext hover:text-white hover:bg-white/5 border-t-2 border-t-transparent mb-0.5'
                }
              `}
            >
              {tab} 
              
              {/* Badge */}
              {count > 0 && (
                <span className={`
                  flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full text-[9px] font-bold
                  ${isActive ? 'bg-white text-black' : 'bg-deti-border text-deti-subtext group-hover:text-white'}
                `}>
                  {count}
                </span>
              )}
            </button>
           );
        })}
        
        {/* Trailing Actions */}
        <div className="ml-auto flex items-center gap-4 pb-2 pl-4">
           <div className="flex items-center gap-1.5 text-[10px] text-deti-subtext hover:text-white cursor-pointer transition-colors">
              <input type="checkbox" id="hide-other" className="rounded bg-deti-surface border-deti-border text-deti-primary focus:ring-0 w-3 h-3 cursor-pointer" />
              <label htmlFor="hide-other" className="cursor-pointer">Hide other pairs</label>
           </div>
           <button className="p-1 text-deti-subtext hover:text-white hover:bg-white/10 rounded transition-colors"><Filter size={12}/></button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-deti-bg relative custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-deti-bg sticky top-0 z-10 text-[10px] text-deti-subtext uppercase tracking-wider shadow-sm">
            <tr>
              <Th>Date</Th>
              <Th>Pair</Th>
              <Th>Type</Th>
              <Th>Side</Th>
              <Th>Price</Th>
              <Th>Amount</Th>
              <Th>Filled</Th>
              <Th>Total</Th>
              <Th className="text-right">Action</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-deti-border/50 text-[11px] font-mono">
             {renderTableBody()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface CellProps {
  children: React.ReactNode;
  className?: string;
}

const Th: React.FC<CellProps> = ({ children, className = '' }) => (
    <th className={`px-4 py-3 font-bold bg-deti-card/30 backdrop-blur-sm border-b border-deti-border/50 ${className}`}>{children}</th>
);

const Td: React.FC<CellProps> = ({ children, className = '' }) => (
    <td className={`px-4 py-3 whitespace-nowrap border-b border-white/5 ${className}`}>{children}</td>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
   <div className="h-40 w-full flex flex-col items-center justify-center text-deti-subtext gap-3">
      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
         <Clock className="w-5 h-5 opacity-50" />
      </div>
      <span className="text-xs font-medium">{message}</span>
   </div>
);
