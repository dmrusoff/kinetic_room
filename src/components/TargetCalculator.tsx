import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calculator, ArrowUpRight, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface ContractSpec {
  symbol: string;
  name: string;
  pointValue: number;
  tickSize: number;
  tickValue: number;
  decimals: number;
  defaultPrice: string;
}

const CONTRACT_SPECS: Record<string, ContractSpec> = {
  MNQ: {
    symbol: 'MNQ',
    name: 'Micro E-mini Nasdaq-100',
    pointValue: 2,
    tickSize: 0.25,
    tickValue: 0.50,
    decimals: 2,
    defaultPrice: '19500.00'
  },
  NQ: {
    symbol: 'NQ',
    name: 'E-mini Nasdaq-100',
    pointValue: 20,
    tickSize: 0.25,
    tickValue: 5.00,
    decimals: 2,
    defaultPrice: '19500.00'
  },
  MES: {
    symbol: 'MES',
    name: 'Micro E-mini S&P 500',
    pointValue: 5,
    tickSize: 0.25,
    tickValue: 1.25,
    decimals: 2,
    defaultPrice: '5500.00'
  },
  ES: {
    symbol: 'ES',
    name: 'E-mini S&P 500',
    pointValue: 50,
    tickSize: 0.25,
    tickValue: 12.50,
    decimals: 2,
    defaultPrice: '5500.00'
  }
};

export const TargetCalculator = () => {
  const [symbol, setSymbol] = useState<'MNQ' | 'NQ' | 'MES' | 'ES'>('MNQ');
  const [direction, setDirection] = useState<'BUY' | 'SELL'>('BUY');
  const [avgPriceStr, setAvgPriceStr] = useState<string>('19500.00');
  const [lotSizeStr, setLotSizeStr] = useState<string>('2');
  const [targetProfitStr, setTargetProfitStr] = useState<string>('500');

  const spec = CONTRACT_SPECS[symbol];

  // Clean leading zeros helper
  const cleanNumberInput = (val: string) => {
    if (val === '') return '';
    // Strip leading zeros before non-zero digits (allow "0.25" or "0")
    if (val.length > 1 && val.startsWith('0') && !val.startsWith('0.')) {
      return val.replace(/^0+(?=\d)/, '');
    }
    return val;
  };

  // Handle instrument change & default price suggestion
  const handleSymbolChange = (newSymbol: 'MNQ' | 'NQ' | 'MES' | 'ES') => {
    setSymbol(newSymbol);
    const currentPriceNum = parseFloat(avgPriceStr) || 0;
    if (newSymbol === 'ES' || newSymbol === 'MES') {
      if (currentPriceNum > 10000) setAvgPriceStr('5500.00');
    } else {
      if (currentPriceNum < 10000) setAvgPriceStr('19500.00');
    }
  };

  // Dynamic calculations
  const calculations = useMemo(() => {
    const validLots = Math.max(1, parseInt(lotSizeStr) || 1);
    const validProfit = Math.max(0, parseFloat(targetProfitStr) || 0);
    const validPrice = parseFloat(avgPriceStr) || 0;

    const totalPointVal = validLots * spec.pointValue;
    const totalTickVal = validLots * spec.tickValue;
    const pointsNeeded = validProfit / (totalPointVal || 1);
    const ticksNeeded = pointsNeeded / spec.tickSize;

    const targetPrice = direction === 'BUY'
      ? validPrice + pointsNeeded
      : validPrice - pointsNeeded;

    return {
      targetPrice,
      pointsNeeded,
      ticksNeeded,
      totalPointVal,
      totalTickVal
    };
  }, [symbol, direction, avgPriceStr, lotSizeStr, targetProfitStr, spec]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const formatNumber = (val: number, decimals: number = 2) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(val);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#00F2FF]/30 mb-4 shadow-[0_0_15px_rgba(0,242,255,0.15)]">
          <Calculator className="w-3.5 h-3.5 text-[#00F2FF]" />
          <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-[#00F2FF]">
            FUTURES ALPHA TOOLKIT
          </span>
        </div>
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-4">
          TARGET PROFIT <span className="text-[#00F2FF] italic drop-shadow-[0_0_20px_rgba(0,242,255,0.5)]">CALCULATOR</span>
        </h1>
        <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto font-light">
          Instantly compute the exact target price required to reach your target dollar profit for MNQ, NQ, MES, and ES contracts.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#121212] border border-white/10 rounded-xl p-8 flex flex-col justify-between shadow-2xl"
        >
          <div>
            <div className="flex items-center gap-3 pb-6 mb-6 border-b border-white/10">
              <div className="w-8 h-8 rounded-lg bg-[#00F2FF]/10 flex items-center justify-center text-[#00F2FF]">
                <Target className="w-4 h-4" />
              </div>
              <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                TRADE PARAMETERS
              </h2>
            </div>

            {/* Instrument Selection */}
            <div className="mb-6">
              <label className="block font-mono text-xs text-white/60 uppercase tracking-wider mb-2">
                Instrument Symbol
              </label>
              <div className="grid grid-cols-4 gap-2 p-1.5 bg-[#0a0a0a] border border-white/10 rounded-lg">
                {(['MNQ', 'NQ', 'MES', 'ES'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSymbolChange(item)}
                    className={`py-2 px-3 rounded-md font-mono text-xs font-bold transition-all ${
                      symbol === item
                        ? 'bg-[#00F2FF] text-black shadow-[0_0_20px_rgba(0,242,255,0.6)] font-extrabold'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Side / Direction */}
            <div className="mb-6">
              <label className="block font-mono text-xs text-white/60 uppercase tracking-wider mb-2">
                Order Side / Direction
              </label>
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#0a0a0a] border border-white/10 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDirection('BUY')}
                  className={`py-2.5 px-4 rounded-md font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    direction === 'BUY'
                      ? 'bg-[#00F2FF] text-black shadow-[0_0_20px_rgba(0,242,255,0.6)] font-extrabold'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  BUY / LONG
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('SELL')}
                  className={`py-2.5 px-4 rounded-md font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    direction === 'SELL'
                      ? 'bg-[#FF3B3B] text-white shadow-[0_0_20px_rgba(255,59,59,0.6)] font-extrabold'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  SELL / SHORT
                </button>
              </div>
            </div>

            {/* Price & Lots Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block font-mono text-xs text-white/60 uppercase tracking-wider mb-2">
                  Average Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-white/40 text-sm">$</span>
                  <input
                    type="number"
                    step="0.25"
                    value={avgPriceStr}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setAvgPriceStr(cleanNumberInput(e.target.value))}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-7 pr-3 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00F2FF] focus:shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-white/60 uppercase tracking-wider mb-2">
                  Lot Size (Contracts)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={lotSizeStr}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setLotSizeStr(cleanNumberInput(e.target.value))}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00F2FF] focus:shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-white/40 text-xs uppercase">lots</span>
                </div>
              </div>
            </div>

            {/* Target Profit ($) */}
            <div className="mb-6">
              <label className="block font-mono text-xs text-white/60 uppercase tracking-wider mb-2">
                Target Profit ($)
              </label>
              <div className="relative mb-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-white/40 text-sm">$</span>
                <input
                  type="number"
                  min="1"
                  step="10"
                  value={targetProfitStr}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setTargetProfitStr(cleanNumberInput(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-7 pr-3 py-2.5 font-mono text-base font-bold text-white focus:outline-none focus:border-[#00F2FF] focus:shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-colors"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-white/40 uppercase">Presets:</span>
                <div className="grid grid-cols-4 gap-2 flex-1">
                  {[100, 250, 500, 1000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setTargetProfitStr(amount.toString())}
                      className="py-1 px-2 bg-white/5 border border-white/10 rounded font-mono text-[11px] text-white/70 hover:text-[#00F2FF] hover:border-[#00F2FF]/50 transition-colors"
                    >
                      ${amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#121212] border border-white/10 rounded-xl p-8 flex flex-col justify-between shadow-2xl"
        >
          <div>
            <div className="flex items-center gap-3 pb-6 mb-6 border-b border-white/10">
              <div className="w-8 h-8 rounded-lg bg-[#00F2FF]/10 flex items-center justify-center text-[#00F2FF]">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                CALCULATED TARGET
              </h2>
            </div>

            {/* Target Price Highlight */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 text-center mb-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00F2FF] to-[#00A3FF]"></div>
              <span className="block font-mono text-[11px] text-white/50 uppercase tracking-widest mb-1">
                TARGET EXIT PRICE
              </span>
              <div className="font-mono text-4xl sm:text-5xl font-black text-[#00F2FF] tracking-tight mb-3 drop-shadow-[0_0_25px_rgba(0,242,255,0.4)]">
                {formatNumber(calculations.targetPrice, spec.decimals)}
              </div>
              <div className="inline-block">
                <span className={`px-3 py-1 rounded-full font-mono text-[11px] font-bold tracking-wider uppercase border ${
                  direction === 'BUY'
                    ? 'bg-[#00F2FF]/10 border-[#00F2FF] text-[#00F2FF]'
                    : 'bg-[#FF3B3B]/10 border-[#FF3B3B] text-[#FF3B3B]'
                }`}>
                  {direction === 'BUY' ? 'LONG EXIT (BUY)' : 'SHORT EXIT (SELL)'}
                </span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#181818] border border-white/5 p-4 rounded-lg">
                <span className="block font-mono text-[10px] text-white/50 uppercase mb-1">Points Needed</span>
                <span className="font-mono text-lg font-bold text-white">
                  {direction === 'BUY' ? '+' : '-'}{formatNumber(calculations.pointsNeeded, 2)} pts
                </span>
              </div>
              <div className="bg-[#181818] border border-white/5 p-4 rounded-lg">
                <span className="block font-mono text-[10px] text-white/50 uppercase mb-1">Ticks Needed</span>
                <span className="font-mono text-lg font-bold text-white">
                  {formatNumber(calculations.ticksNeeded, 0)} ticks
                </span>
              </div>
              <div className="bg-[#181818] border border-white/5 p-4 rounded-lg">
                <span className="block font-mono text-[10px] text-white/50 uppercase mb-1">Dollar Value / Point</span>
                <span className="font-mono text-lg font-bold text-white">
                  {formatCurrency(calculations.totalPointVal)} / pt
                </span>
              </div>
              <div className="bg-[#181818] border border-white/5 p-4 rounded-lg">
                <span className="block font-mono text-[10px] text-white/50 uppercase mb-1">Dollar Value / Tick</span>
                <span className="font-mono text-lg font-bold text-white">
                  {formatCurrency(calculations.totalTickVal)} / tick
                </span>
              </div>
            </div>
          </div>

          {/* Contract Specs Footer Box */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4 text-xs font-mono text-white/70 space-y-2 mt-auto">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>Selected Symbol:</span>
              <strong className="text-white">{spec.name}</strong>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>Tick Size & Value:</span>
              <strong className="text-white">{spec.tickSize} pts = {formatCurrency(spec.tickValue)} / contract</strong>
            </div>
            <div className="flex justify-between">
              <span>Point Value:</span>
              <strong className="text-white">{formatCurrency(spec.pointValue)} / point / contract</strong>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
