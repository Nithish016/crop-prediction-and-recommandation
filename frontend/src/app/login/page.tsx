'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Sprout, User, ShieldCheck, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, token, error, setError } = useAuth();
  
  const [role, setRole] = useState<'farmer' | 'admin'>('farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear errors on page load
    setError(null);
    if (token && user) {
      router.push('/dashboard');
    }
  }, [token, user, router, setError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    try {
      await login(email, password, role);
      router.push('/dashboard');
    } catch (err) {
      // Error is set in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-agro-500 text-white rounded-2xl shadow-md flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-sm text-slate-500">Sign in to access your agro dashboard</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2">
          <button
            type="button"
            onClick={() => { setRole('farmer'); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              role === 'farmer' 
                ? 'bg-white text-agro-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            Farmer
          </button>
          <button
            type="button"
            onClick={() => { setRole('admin'); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              role === 'admin' 
                ? 'bg-white text-agro-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Gov Admin
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. farmer@gmail.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-agro-500 focus:bg-white transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-agro-500 focus:bg-white transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-agro-600 hover:bg-agro-700 text-white rounded-xl font-semibold shadow-md shadow-agro-100 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {role === 'farmer' ? (
          <p className="text-center text-sm text-slate-500">
            Don't have a farmer account?{' '}
            <Link href="/signup" className="text-agro-600 font-bold hover:underline">
              Register now
            </Link>
          </p>
        ) : (
          <div className="text-center text-xs text-slate-400 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="font-bold">Demo Login:</span> admin@smartagro.gov / admin123
          </div>
        )}
      </div>
    </div>
  );
}
