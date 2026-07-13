'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Home, 
  Sprout, 
  ShieldAlert, 
  TrendingUp, 
  CloudSun, 
  BookOpen, 
  MessageSquareCode, 
  LayoutDashboard, 
  LogOut,
  User,
  Languages
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Base navigation menu items
  const menuItems = [
    { name: t('nav.dashboard'), path: '/dashboard', icon: Home },
    { name: t('nav.crop'), path: '/dashboard/crop-recommendation', icon: Sprout },
    { name: t('nav.disease'), path: '/dashboard/disease-detection', icon: ShieldAlert },
    { name: t('nav.market'), path: '/dashboard/market-prices', icon: TrendingUp },
    { name: t('nav.weather'), path: '/dashboard/weather', icon: CloudSun },
    { name: t('nav.advisory'), path: '/dashboard/advisory', icon: BookOpen },
    { name: t('nav.chatbot'), path: '/dashboard/chatbot', icon: MessageSquareCode },
  ];

  // Admin exclusive navigation
  if (user?.role === 'admin') {
    menuItems.push({ name: t('nav.admin'), path: '/dashboard/admin', icon: LayoutDashboard });
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between min-h-screen sticky top-0">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-agro-500 text-white rounded-xl shadow-md shadow-agro-100">
            <Sprout className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-800 leading-tight">Smart Agro</h1>
            <span className="text-xs text-agro-600 font-semibold tracking-wide uppercase">AI Platform</span>
          </div>
        </Link>

        {/* Language Toggle Selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 items-center gap-1">
          <div className="pl-1.5 pr-0.5 text-slate-400">
            <Languages className="w-3.5 h-3.5" />
          </div>
          <button
            onClick={() => setLanguage('en')}
            className={`flex-1 text-[9px] font-black py-1.5 rounded-lg transition-all ${
              language === 'en' ? 'bg-white text-agro-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`flex-1 text-[9px] font-black py-1.5 rounded-lg transition-all ${
              language === 'hi' ? 'bg-white text-agro-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            हिन्दी
          </button>
          <button
            onClick={() => setLanguage('te')}
            className={`flex-1 text-[9px] font-black py-1.5 rounded-lg transition-all ${
              language === 'te' ? 'bg-white text-agro-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            తెలుగు
          </button>
        </div>


        <nav className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-agro-50 text-agro-700 shadow-sm border-l-4 border-agro-500 pl-3' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-agro-600' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-agro-100 text-agro-700 flex items-center justify-center font-bold">
            <User className="w-5 h-5 text-agro-600" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'Agro User'}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role || 'Farmer'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-200 shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          {t('nav.signout')}
        </button>
      </div>
    </aside>
  );
};

