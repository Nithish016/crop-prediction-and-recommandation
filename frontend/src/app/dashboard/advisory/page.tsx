'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { BookOpen, Bell, Send, CheckCircle, Info, Sparkles } from 'lucide-react';

interface Alert {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
}

export default function AdvisoryPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [phone, setPhone] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [smsSending, setSmsSending] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get('/alerts');
        setAlerts(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAlerts();
  }, []);

  const handleSmsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setSmsSending(true);
    setTimeout(() => {
      setSmsSending(false);
      setSubscribed(true);
    }, 1200);
  };

  const schemes = [
    {
      title: 'PM Kisan Samman Nidhi (PM-KISAN)',
      description: 'An initiative by the government of India providing up to ₹6,000 per year in three equal installments directly to small and marginal farmers.',
      subsidy: '100% Government funded benefit'
    },
    {
      title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      description: 'Crop insurance program providing financial security against yield loss due to natural calamities, pests, and plant illnesses.',
      subsidy: 'Premium subsidy up to 90%'
    },
    {
      title: 'Soil Health Card Scheme',
      description: 'Helps state governments issue soil cards evaluating composition values (N, P, K, microelements) to prescribe proper chemical dosing.',
      subsidy: 'Free testing services'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-agro-600" />
          Government Schemes & Personalized Advisory
        </h2>
        <p className="text-sm text-slate-500">Discover active farming subsidies and activate automated alert settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Schemes and alerts list */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Schemes list */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-agro-500 animate-pulse" />
              Eligible Government Schemes
            </h3>
            
            <div className="space-y-4">
              {schemes.map((scheme, index) => (
                <div 
                  key={index}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-agro-200 transition-all space-y-3"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-slate-800 text-sm">{scheme.title}</h4>
                    <span className="text-[10px] font-extrabold text-agro-700 bg-agro-100/70 px-2 py-0.5 rounded-md uppercase whitespace-nowrap">
                      {scheme.subsidy}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-normal font-medium">{scheme.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts broadcasted */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              Government Advisory Broadcasts
            </h3>
            
            {alerts.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <Info className="w-4 h-4 text-slate-400" />
                No advisory broadcasts currently registered.
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((item) => (
                  <div 
                    key={item._id}
                    className="p-5 bg-amber-50/40 border border-amber-100 rounded-2xl space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-amber-800 text-xs uppercase tracking-wider">{item.title}</h4>
                      <span className="text-[9px] text-amber-600 font-bold">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed font-semibold">{item.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* SMS alert subscription panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Send className="w-5 h-5 text-agro-600" />
              SMS Alert Service
            </h3>

            {subscribed ? (
              <div className="bg-green-50/60 border border-green-100 p-5 rounded-2xl text-center space-y-3">
                <div className="mx-auto w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-green-900">SMS Service Active</p>
                  <p className="text-[11px] text-green-700 leading-normal">
                    Farming warnings and market fluctuations will be sent to <span className="font-bold">{phone}</span>.
                  </p>
                </div>
                <button 
                  onClick={() => setSubscribed(false)}
                  className="text-xs text-green-800 font-bold hover:underline"
                >
                  Change Mobile Number
                </button>
              </div>
            ) : (
              <form onSubmit={handleSmsSubmit} className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter your mobile number to enroll in automated SMS broadcasts covering weather, disease updates, and mandi rates.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-agro-500 focus:bg-white transition-all font-semibold"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={smsSending}
                  className="w-full py-3 bg-agro-600 hover:bg-agro-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg shadow-agro-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm"
                >
                  {smsSending ? 'Enrolling...' : 'Activate Alerts'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
