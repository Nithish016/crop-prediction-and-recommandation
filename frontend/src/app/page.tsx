'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, ShieldCheck, BarChart3, CloudRain, Users, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-agro-500 text-white rounded-lg shadow-md shadow-agro-100">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-slate-800">Smart Agro AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="bg-agro-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-agro-700 transition-all shadow-md shadow-agro-100">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-agro-50 text-agro-700 text-xs font-semibold uppercase tracking-wider">
              🌱 Empowering MSME Farms & Startups
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight">
              Smart Decisions for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-agro-600 to-emerald-500">
                Better Crop Yield
              </span>
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed max-w-lg">
              Smart Agro AI uses local soil metrics, weather forecasting, and real-time disease diagnostic algorithms to boost productivity and reduce cost.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/signup" className="flex items-center gap-2 bg-agro-600 hover:bg-agro-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-agro-200">
                Register as Farmer
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold px-6 py-3.5 rounded-xl hover:bg-slate-50 transition-all">
                Access Admin Portal
              </Link>
            </div>
          </div>

          {/* Right section - Image placeholder/Mock display */}
          <div className="relative flex justify-center items-center">
            <div className="w-full max-w-md p-6 bg-white rounded-3xl shadow-xl border border-slate-100 relative z-10 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">DEMO DASHBOARD</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <div className="p-4 bg-agro-50/70 border border-agro-100 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-agro-500 text-white rounded-xl">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs text-slate-400 uppercase font-semibold">Recommended Crop</h4>
                  <p className="text-xl font-bold text-slate-800">Wheat (Basmati-Ready)</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl text-center">
                  <span className="text-xs text-slate-400">Nitrogen</span>
                  <p className="text-base font-bold text-slate-800">90kg/h</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl text-center">
                  <span className="text-xs text-slate-400">pH Level</span>
                  <p className="text-base font-bold text-slate-800">6.5</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl text-center">
                  <span className="text-xs text-slate-400">Rainfall</span>
                  <p className="text-base font-bold text-slate-800">110mm</p>
                </div>
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-agro-100/40 blur-3xl -z-0"></div>
          </div>
        </div>
      </main>

      {/* Feature Section */}
      <section className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center font-bold text-2xl md:text-3xl text-slate-800 mb-12">
            Integrated Features for Modern Agriculture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-all space-y-4">
              <div className="p-3 bg-agro-100 text-agro-700 w-fit rounded-xl">
                <Sprout className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Crop Analytics</h3>
              <p className="text-sm text-slate-600">Calculates optimal crop profiles considering local soil conditions (N, P, K, pH) and microclimate.</p>
            </div>
            <div className="p-6 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-all space-y-4">
              <div className="p-3 bg-red-100 text-red-700 w-fit rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Disease Detection</h3>
              <p className="text-sm text-slate-600">Analyze crop health from leaf uploads to identify plant ailments and request immediate remediation tips.</p>
            </div>
            <div className="p-6 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-all space-y-4">
              <div className="p-3 bg-blue-100 text-blue-700 w-fit rounded-xl">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Market Intelligence</h3>
              <p className="text-sm text-slate-600">Keep tab on live commodity pricing updates to decide optimal timing for harvesting and selling.</p>
            </div>
            <div className="p-6 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-all space-y-4">
              <div className="p-3 bg-amber-100 text-amber-700 w-fit rounded-xl">
                <CloudRain className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Advisory Alerts</h3>
              <p className="text-sm text-slate-600">Direct notifications and farming advisory broadcasts from government monitors and experts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-xs border-t border-slate-800">
        <p>© 2026 Smart Agro AI Startup. All rights reserved.</p>
      </footer>
    </div>
  );
}
