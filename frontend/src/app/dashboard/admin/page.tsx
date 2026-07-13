'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { 
  Users, 
  Sprout, 
  ShieldAlert, 
  Bell, 
  Send, 
  CheckCircle2, 
  Loader2, 
  Info,
  Activity
} from 'lucide-react';

interface Stats {
  totalFarmers: number;
  totalPredictions: number;
  totalReports: number;
  totalAlerts: number;
  latestActivity: Array<{
    user: string;
    action: string;
    timestamp: string;
  }>;
}

interface DiseaseReport {
  _id: string;
  cropName: string;
  diseaseName: string;
  confidence: number;
  remedy: string;
  status: string;
  createdAt: string;
  userId: {
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [reports, setReports] = useState<DiseaseReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Broadcast Alert Form
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTarget, setAlertTarget] = useState('farmer');
  const [alertSubmitting, setAlertSubmitting] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);

  const loadData = async () => {
    try {
      const [statsRes, reportsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/reports')
      ]);
      setStats(statsRes.data.data);
      setReports(reportsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle || !alertMessage) return;

    setAlertSubmitting(true);
    setAlertSuccess(false);

    try {
      await api.post('/admin/alerts', {
        title: alertTitle,
        message: alertMessage,
        targetRole: alertTarget
      });
      setAlertSuccess(true);
      setAlertTitle('');
      setAlertMessage('');
      
      // Reload stats
      const statsRes = await api.get('/admin/dashboard');
      setStats(statsRes.data.data);

      setTimeout(() => setAlertSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setAlertSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-agro-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Activity className="w-6 h-6 text-agro-600" />
          Government / Admin Command Dashboard
        </h2>
        <p className="text-sm text-slate-500">Monitor farmer activity, track disease reports, and broadcast urgent agriculture alerts.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-agro-100 text-agro-700 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Farmers Registered</p>
            <h3 className="text-2xl font-black text-slate-800">{stats?.totalFarmers || 0}</h3>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-blue-100 text-blue-700 rounded-2xl">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Crop Recommendations</p>
            <h3 className="text-2xl font-black text-slate-800">{stats?.totalPredictions || 0}</h3>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-red-100 text-red-700 rounded-2xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Diseases Tracked</p>
            <h3 className="text-2xl font-black text-slate-800">{stats?.totalReports || 0}</h3>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-amber-100 text-amber-700 rounded-2xl">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Broadcast Alerts</p>
            <h3 className="text-2xl font-black text-slate-800">{stats?.totalAlerts || 0}</h3>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Reports Tracking Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6">
            <h3 className="text-base font-bold text-slate-800">Recent Farmer Disease Reports</h3>
            
            {reports.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <Info className="w-4 h-4 text-slate-400" />
                No active disease outbreaks logged yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold">
                      <th className="py-3 pr-4">Farmer</th>
                      <th className="py-3 px-4">Crop</th>
                      <th className="py-3 px-4">Identified Pathogen</th>
                      <th className="py-3 px-4">Accuracy</th>
                      <th className="py-3 pl-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reports.map((report) => (
                      <tr key={report._id} className="hover:bg-slate-50/50 transition-all font-semibold text-slate-700">
                        <td className="py-4 pr-4">
                          <div>
                            <p className="font-bold text-slate-800">{report.userId?.name || 'Farmer Demo'}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{report.userId?.email || 'farmer@demo.com'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">{report.cropName}</td>
                        <td className="py-4 px-4 text-red-600 font-bold">{report.diseaseName}</td>
                        <td className="py-4 px-4 font-mono">{(report.confidence * 100).toFixed(0)}%</td>
                        <td className="py-4 pl-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            report.status === 'Active' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Composer Broadcast Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <Send className="w-4 h-4 text-agro-600" />
              Compose Broadcast Alert
            </h3>

            {alertSuccess && (
              <div className="p-4 bg-green-50 border-l-4 border-green-500 text-xs text-green-700 rounded-r-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Alert broadcasted successfully.
              </div>
            )}

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Alert Title</label>
                <input
                  type="text"
                  value={alertTitle}
                  onChange={(e) => setAlertTitle(e.target.value)}
                  placeholder="e.g. Drought Warning / Subsidy Open"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-agro-500 focus:bg-white transition-all font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Message Body</label>
                <textarea
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  placeholder="Describe advisory steps for farmers..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-agro-500 focus:bg-white transition-all font-semibold"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target Audience</label>
                <select
                  value={alertTarget}
                  onChange={(e) => setAlertTarget(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-agro-500 focus:bg-white transition-all font-semibold"
                >
                  <option value="farmer">All Farmers</option>
                  <option value="all">Everyone</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={alertSubmitting}
                className="w-full py-3 bg-agro-600 hover:bg-agro-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg shadow-agro-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-xs"
              >
                {alertSubmitting ? 'Publishing...' : 'Broadcast Alert'}
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Activity Logs */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4">
        <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
          Real-Time Audit Logs
        </h3>
        <div className="divide-y divide-slate-100 text-xs">
          {stats?.latestActivity.map((activity, idx) => (
            <div key={idx} className="py-3 flex justify-between items-center font-medium">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-agro-500"></span>
                <span className="text-slate-800 font-bold">{activity.user}</span>
                <span className="text-slate-400">performed action:</span>
                <span className="text-agro-700 font-bold uppercase">{activity.action}</span>
              </div>
              <span className="text-slate-400 text-[10px]">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
