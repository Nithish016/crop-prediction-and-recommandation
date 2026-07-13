'use client';

import React, { useState } from 'react';
import { api } from '../../../context/AuthContext';
import { ShieldAlert, Loader2, Upload, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

export default function DiseaseDetection() {
  const [crop, setCrop] = useState('Tomato');
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMockUpload = () => {
    setUploading(true);
    setError(null);
    setReport(null);

    // Simulate file reading/uploading delays
    setTimeout(async () => {
      // Set a mock image URL depending on crop type
      const images: Record<string, string> = {
        Tomato: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400',
        Potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=400',
        Wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400',
        Rice: 'https://images.unsplash.com/photo-1536657464919-8925412403c1?auto=format&fit=crop&q=80&w=400'
      };

      const selectedImg = images[crop] || 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400';
      setImageUrl(selectedImg);

      try {
        const response = await api.post('/disease/detect', {
          cropName: crop,
          imageUrl: selectedImg
        });
        setReport(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to analyze leaf disease.');
      } finally {
        setUploading(false);
      }
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-red-600 animate-bounce" />
          AI Leaf Disease Diagnostics
        </h2>
        <p className="text-sm text-slate-500">Upload high-definition leaf snapshots to identify fungal, bacterial, or viral plant illnesses.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Diagnostic Panel */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Leaf Image Upload</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Crop Category</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-agro-500 focus:bg-white transition-all font-semibold"
              >
                <option value="Tomato">Tomato</option>
                <option value="Potato">Potato</option>
                <option value="Rice">Rice</option>
                <option value="Wheat">Wheat</option>
                <option value="Cotton">Cotton</option>
                <option value="Banana">Banana</option>
              </select>
            </div>

            {/* Simulated file drop container */}
            <div 
              onClick={handleMockUpload}
              className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
                uploading 
                  ? 'border-agro-400 bg-agro-50/20' 
                  : 'border-slate-300 hover:border-agro-400 hover:bg-slate-50/50'
              }`}
            >
              {uploading ? (
                <div className="space-y-3 py-4">
                  <Loader2 className="w-10 h-10 animate-spin text-agro-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">Uploading and Scanning Leaf Image...</p>
                  <p className="text-xs text-slate-400">Performing pixel segmentation and pattern matching</p>
                </div>
              ) : imageUrl ? (
                <div className="space-y-4">
                  <img 
                    src={imageUrl} 
                    alt="Analyzed leaf" 
                    className="mx-auto h-40 w-40 object-cover rounded-2xl shadow-md border border-white"
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-700">Image Uploaded Successfully</p>
                    <p className="text-xs text-agro-600 font-medium">Click to select and scan another image</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-agro-50 flex items-center justify-center text-agro-600">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">Drag leaf image here or <span className="text-agro-600">browse</span></p>
                    <p className="text-xs text-slate-400">Supports PNG, JPG up to 10MB (Click to use demo leaf)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-sm text-red-700 rounded-r-xl flex gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
            <h3 className="font-bold text-lg text-slate-800">Diagnostic Report</h3>

            {!report && !uploading && (
              <div className="py-12 text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-400 max-w-[200px] mx-auto leading-normal">
                  Upload a crop leaf snapshot to generate diagnostic breakdown.
                </p>
              </div>
            )}

            {uploading && (
              <div className="py-16 text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-agro-600 mx-auto" />
                <p className="text-xs text-slate-400">Analyzing leaf pathogens...</p>
              </div>
            )}

            {report && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-5 bg-red-50/50 border border-red-100 rounded-2xl text-center space-y-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-red-700 uppercase tracking-widest bg-red-100 px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    Pathogen Identified
                  </span>
                  <h4 className="text-xl font-black text-red-900 leading-tight">{report.diseaseName}</h4>
                  <p className="text-xs text-slate-500 font-medium">Confidence Score: {(report.confidence * 100).toFixed(0)}%</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Affected Crop</span>
                    <p className="text-sm font-bold text-slate-700">{report.cropName}</p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Recommended Treatment</span>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium">
                      {report.remedy}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Verified by Agro AI Specialist
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
