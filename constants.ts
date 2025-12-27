
import { MarketPair, PortfolioAsset, Transaction, CryptoNetwork, ChartDataPoint, Order, FeeTier } from './types';

export const MOCK_PAIRS: MarketPair[] = [
  { symbol: 'BTC/USDT', base: 'BTC', quote: 'USDT', price: 89600.03, change24h: -0.71, volume24h: 452000000, sparkline: [89900, 89800, 89500, 89700, 89600] },
  { symbol: 'ETH/USDT', base: 'ETH', quote: 'USDT', price: 3119.40, change24h: 0.21, volume24h: 210000000, sparkline: [3110, 3115, 3112, 3125, 3119] },
  { symbol: 'SOL/USDT', base: 'SOL', quote: 'USDT', price: 131.97, change24h: -0.5, volume24h: 89000000, sparkline: [133, 132.5, 132, 131.5, 131.97] },
  { symbol: 'DETI/USDT', base: 'DETI', quote: 'USDT', price: 1.25, change24h: 12.30, volume24h: 15000000, sparkline: [1.0, 1.1, 1.15, 1.2, 1.25] },
  { symbol: 'XRP/USDT', base: 'XRP', quote: 'USDT', price: 2.00, change24h: -0.77, volume24h: 45000000, sparkline: [1.98, 2.01, 2.02, 1.99, 2.00] },
  { symbol: 'ADA/USDT', base: 'ADA', quote: 'USDT', price: 0.4044, change24h: -0.85, volume24h: 32000000, sparkline: [0.41, 0.408, 0.405, 0.402, 0.4044] },
];

// Helper to generate realistic candles
const generateCandles = (count: number, startPrice: number): ChartDataPoint[] => {
  let currentPrice = startPrice;
  const candles: ChartDataPoint[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const time = new Date(now.getTime() - (count - i) * 15 * 60000); // 15 min candles
    const volatility = currentPrice * 0.005; // 0.5% volatility
    const change = (Math.random() - 0.5) * volatility;
    
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(Math.random() * 500) + 50;

    candles.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      open,
      high,
      low,
      close,
      volume
    });
    currentPrice = close;
  }
  return candles;
};

// Updated start price to match new BTC price
export const INITIAL_CHART_DATA = generateCandles(60, 89600);

// Updated Asset Values to match new prices
export const INITIAL_ASSETS: PortfolioAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', amount: 0.45, valueUsd: 40320.01, color: '#F7931A' }, // ~89600 * 0.45
  { symbol: 'ETH', name: 'Ethereum', amount: 4.2, valueUsd: 13101.48, color: '#627EEA' }, // ~3119 * 4.2
  { symbol: 'USDT', name: 'Tether', amount: 12500, valueUsd: 12500.00, color: '#26A17B' },
  { symbol: 'DETI', name: 'DETI Token', amount: 5000, valueUsd: 6250.00, color: '#F59E0B' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TX100293', type: 'Deposit', asset: 'USDT', amount: 5000, status: 'Completed', date: '2024-05-15 14:30', network: 'TRC20' },
  { id: 'TX100294', type: 'Trade', asset: 'BTC', amount: 0.05, status: 'Completed', date: '2024-05-16 09:15' },
  { id: 'TX100295', type: 'Withdraw', asset: 'ETH', amount: 1.2, status: 'Completed', date: '2024-05-18 11:20', address: '0x71C...92A' },
  { id: 'TX100296', type: 'Deposit', asset: 'SOL', amount: 45, status: 'Pending', date: '2024-05-20 16:45', network: 'Solana' },
];

export const MOCK_OPEN_ORDERS: Order[] = [
  { id: 'ORD-001', pair: 'BTC/USDT', type: 'Limit', side: 'Buy', price: 88500, amount: 0.1, filled: 0, total: 8850, status: 'Open', date: '10:30:45' },
  { id: 'ORD-002', pair: 'ETH/USDT', type: 'Limit', side: 'Sell', price: 3250, amount: 2.5, filled: 1.0, total: 8125, status: 'Open', date: '09:15:22' },
];

export const MOCK_ORDER_HISTORY: Order[] = [
  { id: 'ORD-000', pair: 'SOL/USDT', type: 'Market', side: 'Buy', price: 130.50, amount: 10, filled: 10, total: 1305, status: 'Filled', date: '2024-05-18 14:20' },
  { id: 'ORD-XXX', pair: 'BTC/USDT', type: 'Limit', side: 'Sell', price: 90000, amount: 0.05, filled: 0.05, total: 4500, status: 'Filled', date: '2024-05-17 11:10' },
];

export const COIN_NETWORKS: Record<string, CryptoNetwork[]> = {
  'USDT': [
    { id: 'trc20', name: 'Tron (TRC20)', standard: 'TRC20', fee: 1, arrivalTime: '2 mins', minWithdraw: 10 },
    { id: 'erc20', name: 'Ethereum (ERC20)', standard: 'ERC20', fee: 15, arrivalTime: '5 mins', minWithdraw: 20 },
    { id: 'bep20', name: 'BNB Smart Chain', standard: 'BEP20', fee: 0.8, arrivalTime: '3 mins', minWithdraw: 10 },
  ],
  'BTC': [
    { id: 'btc', name: 'Bitcoin', standard: 'BTC', fee: 0.0005, arrivalTime: '60 mins', minWithdraw: 0.001 },
    { id: 'segwit', name: 'Bitcoin (SegWit)', standard: 'BTC-SegWit', fee: 0.0003, arrivalTime: '45 mins', minWithdraw: 0.001 },
  ],
  'ETH': [
    { id: 'erc20', name: 'Ethereum (ERC20)', standard: 'ERC20', fee: 0.004, arrivalTime: '5 mins', minWithdraw: 0.01 },
    { id: 'arb', name: 'Arbitrum One', standard: 'Arbitrum', fee: 0.0001, arrivalTime: '2 mins', minWithdraw: 0.005 },
  ],
  'DETI': [
    { id: 'erc20', name: 'Ethereum (ERC20)', standard: 'ERC20', fee: 25, arrivalTime: '3 mins', minWithdraw: 50 },
  ],
  'SOL': [
     { id: 'sol', name: 'Solana', standard: 'SPL', fee: 0.01, arrivalTime: '1 min', minWithdraw: 0.1 },
  ]
};

export const FEE_TIERS: FeeTier[] = [
  { level: 1, volumeReq: '< 10K', maker: '0.10%', taker: '0.10%', withdrawalLimit: '10 BTC' },
  { level: 2, volumeReq: '≥ 50K', maker: '0.09%', taker: '0.10%', withdrawalLimit: '20 BTC' },
  { level: 3, volumeReq: '≥ 250K', maker: '0.08%', taker: '0.09%', withdrawalLimit: '50 BTC' },
  { level: 4, volumeReq: '≥ 1M', maker: '0.07%', taker: '0.09%', withdrawalLimit: '100 BTC' },
  { level: 5, volumeReq: '≥ 10M', maker: '0.05%', taker: '0.07%', withdrawalLimit: 'Unlimited' },
];
