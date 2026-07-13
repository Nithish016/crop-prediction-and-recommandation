'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sprout, 
  ShieldAlert, 
  TrendingUp, 
  CloudSun, 
  Bell, 
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';

interface Alert {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
}

export default function DashboardHome() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [marketShort, setMarketShort] = useState<any[]>([]);
  const [weatherShort, setWeatherShort] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        const [alertsRes, marketRes, weatherRes] = await Promise.all([
          api.get('/alerts'),
          api.get('/market/prices'),
          api.get('/weather')
        ]);
        
        setAlerts(alertsRes.data.data.slice(0, 3));
        setMarketShort(marketRes.data.data.slice(0, 3));
        setWeatherShort(weatherRes.data.data.current);
      } catch (err) {
        console.error('Error fetching dashboard summary data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardSummary();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-agro-700 to-emerald-600 rounded-3xl p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-xl">
          <span className="text-xs bg-agro-800/60 font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Smart Agro Platform
          </span>
          <h2 className="text-3xl font-extrabold">{t('dashboard.welcome')} {user?.name}!</h2>
          <p className="text-agro-100 text-sm leading-relaxed">
            {t('dashboard.subtitle')}
          </p>
        </div>
        {/* Background visual asset */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 flex items-center justify-center -rotate-12 translate-x-6">
          <Sprout className="w-56 h-56" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Tools Grid */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-bold text-lg text-slate-800">{t('dashboard.tools_title')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Tool 1 */}
            <Link 
              href="/dashboard/crop-recommendation"
              className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-agro-400 hover:shadow-sm transition-all flex flex-col justify-between h-48 agro-card"
            >
              <div className="p-3 bg-agro-50 text-agro-600 w-fit rounded-xl">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">{t('dashboard.crop_rec_title')}</h4>
                <p className="text-xs text-slate-500 mb-4">{t('dashboard.crop_rec_desc')}</p>
                <span className="text-xs font-semibold text-agro-600 flex items-center gap-1.5">
                  {t('dashboard.crop_rec_btn')} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* Tool 2 */}
            <Link 
              href="/dashboard/disease-detection"
              className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-agro-400 hover:shadow-sm transition-all flex flex-col justify-between h-48 agro-card"
            >
              <div className="p-3 bg-red-50 text-red-600 w-fit rounded-xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">{t('dashboard.disease_title')}</h4>
                <p className="text-xs text-slate-500 mb-4">{t('dashboard.disease_desc')}</p>
                <span className="text-xs font-semibold text-agro-600 flex items-center gap-1.5">
                  {t('dashboard.disease_btn')} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

          </div>

          {/* Market prices widget snippet */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-agro-600" />
                {t('dashboard.mandi_title')}
              </h4>
              <Link href="/dashboard/market-prices" className="text-xs font-bold text-agro-600 hover:underline">
                {t('dashboard.mandi_link')}
              </Link>
            </div>
            
            {loading ? (
              <div className="h-20 flex items-center justify-center text-xs text-slate-400">{t('dashboard.loading_mandi')}</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {marketShort.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-700">{item.crop}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800">₹{item.price} / {item.unit}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                        item.status === 'high' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Info Panels */}
        <div className="space-y-6">
          
          {/* Weather Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-blue-500" />
              {t('dashboard.met_title')}
            </h3>
            {loading || !weatherShort ? (
              <div className="h-24 flex items-center justify-center text-xs text-slate-400">{t('dashboard.loading_weather')}</div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-extrabold text-slate-800">{weatherShort.temp}°C</p>
                  <p className="text-sm font-semibold text-slate-600">{weatherShort.condition}</p>
                </div>
                <div className="text-right text-xs space-y-1 text-slate-500">
                  <p>Humidity: <span className="font-bold text-slate-800">{weatherShort.humidity}%</span></p>
                  <p>Rainfall Chance: <span className="font-bold text-slate-800">{weatherShort.rainfallChance}</span></p>
                </div>
              </div>
            )}
            <Link 
              href="/dashboard/weather"
              className="block text-center py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 transition-all"
            >
              {t('dashboard.met_btn')}
            </Link>
          </div>

          {/* Broadcast/Alerts Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              {t('dashboard.advisory_title')}
            </h3>
            {loading ? (
              <div className="h-24 flex items-center justify-center text-xs text-slate-400">{t('dashboard.loading_alerts')}</div>
            ) : alerts.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <Info className="w-4 h-4 text-slate-400" />
                {t('dashboard.no_alerts')}
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((item) => (
                  <div key={item._id} className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-xl space-y-1">
                    <h4 className="text-xs font-bold text-amber-800">{item.title}</h4>
                    <p className="text-[11px] text-amber-700 leading-normal line-clamp-2">{item.message}</p>
                  </div>
                ))}
              </div>
            )}
            <Link 
              href="/dashboard/advisory"
              className="block text-center py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 transition-all"
            >
              {t('dashboard.advisory_btn')}
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

