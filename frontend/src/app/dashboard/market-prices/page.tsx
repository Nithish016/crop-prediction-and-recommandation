'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { TrendingUp, Search, RefreshCw, Loader2, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MarketItem {
  id: number;
  crop: string;
  price: string;
  unit: string;
  change: string;
  status: 'high' | 'low' | 'neutral';
}

export default function MarketPrices() {
  const [prices, setPrices] = useState<MarketItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/market/prices');
      setPrices(response.data.data);
    } catch (err: any) {
      setError('Could not retrieve market rates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const filteredPrices = prices.filter(item => 
    item.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-agro-600" />
            Live Mandi Commodity Market Rates
          </h2>
          <p className="text-sm text-slate-500">Track current daily agricultural market prices, unit values, and trading fluctuations.</p>
        </div>

        <button 
          onClick={fetchPrices}
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-800 font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Prices
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search crop commodity e.g. Wheat, Rice..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-none focus:border-agro-500 transition-all shadow-sm"
        />
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-agro-600" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrices.map((item) => {
            const isHigh = item.status === 'high';
            const isLow = item.status === 'low';

            return (
              <div 
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between h-40 agro-card"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800">{item.crop}</h3>
                    <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Rate per {item.unit}</p>
                  </div>
                  <div className={`p-2 rounded-xl flex items-center justify-center ${
                    isHigh ? 'bg-green-50 text-green-600' : isLow ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'
                  }`}>
                    {isHigh ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : isLow ? (
                      <ArrowDownRight className="w-4 h-4" />
                    ) : (
                      <Minus className="w-4 h-4" />
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-800">₹{item.price}</span>
                    <span className="text-xs text-slate-500 font-bold">INR</span>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block text-xs px-2.5 py-1 rounded-lg font-bold ${
                      isHigh ? 'bg-green-100 text-green-800' : isLow ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {item.change} Today
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
