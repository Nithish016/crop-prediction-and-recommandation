'use client';

import React, { useState } from 'react';
import { api } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { Sprout, Loader2, RefreshCw, HelpCircle, Droplet, Leaf, TrendingUp } from 'lucide-react';

export default function CropRecommendation() {
  const { t } = useLanguage();
  const [nitrogen, setNitrogen] = useState('90');
  const [phosphorus, setPhosphorus] = useState('42');
  const [potassium, setPotassium] = useState('43');
  const [ph, setPh] = useState('6.5');
  const [temp, setTemp] = useState('28');
  const [humidity, setHumidity] = useState('75');
  const [rainfall, setRainfall] = useState('150');
  const [soilType, setSoilType] = useState('Loamy');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.post('/crop/predict', {
        nitrogen,
        phosphorus,
        potassium,
        ph,
        temperature: temp,
        humidity,
        rainfall,
        soilType
      });

      // Extra simulated details for rich UX
      const crop = response.data.data.recommendedCrop;
      let fertilizer = 'NPK (19-19-19) starter booster';
      let irrigation = 'Drip Irrigation, twice a week';
      let yieldEst = '3.8 Tons per Acre';

      if (crop === 'Rice') {
        fertilizer = 'Urea and Zinc Sulphate at tillering stage';
        irrigation = 'Flooding/Continuous standing water (5cm depth)';
        yieldEst = '4.5 Tons per Acre';
      } else if (crop === 'Wheat') {
        fertilizer = 'DAP (Di-Ammonium Phosphate) + top dress Urea';
        irrigation = 'Border strip irrigation at crown root initiation';
        yieldEst = '3.2 Tons per Acre';
      } else if (crop === 'Cotton') {
        fertilizer = 'Potassium chloride + nitrogenous compost';
        irrigation = 'Drip irrigation during flowering phase';
        yieldEst = '1.8 Tons per Acre';
      }

      setResult({
        crop,
        confidence: response.data.data.confidence * 100,
        fertilizer,
        irrigation,
        yieldEst
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Prediction calculation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Sprout className="w-6 h-6 text-agro-600" />
          {t('crop.title')}
        </h2>
        <p className="text-sm text-slate-500">{t('crop.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form panel */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('crop.section_title')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('crop.label_n')}</label>
                <input
                  type="number"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-agro-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('crop.label_p')}</label>
                <input
                  type="number"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-agro-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('crop.label_k')}</label>
                <input
                  type="number"
                  value={potassium}
                  onChange={(e) => setPotassium(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-agro-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('crop.label_ph')}</label>
                <input
                  type="number"
                  step="0.1"
                  value={ph}
                  onChange={(e) => setPh(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-agro-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('crop.label_temp')}</label>
                <input
                  type="number"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-agro-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('crop.label_humidity')}</label>
                <input
                  type="number"
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-agro-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('crop.label_rainfall')}</label>
                <input
                  type="number"
                  value={rainfall}
                  onChange={(e) => setRainfall(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-agro-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('crop.label_soil')}</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-agro-500 focus:bg-white transition-all font-semibold"
                >
                  <option value="Loamy">Loamy</option>
                  <option value="Clay">Clay</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Silt">Silt</option>
                  <option value="Peaty">Peaty</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-sm text-red-700 rounded-r-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-agro-600 hover:bg-agro-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg shadow-agro-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('crop.btn_analyzing')}
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  {t('crop.btn_analyze')}
                </>
              )}
            </button>

          </form>
        </div>

        {/* Results display panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
            <h3 className="font-bold text-lg text-slate-800">{t('crop.result_title')}</h3>
            
            {!result && !loading && (
              <div className="py-12 text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-400 max-w-[200px] mx-auto leading-normal">
                  {t('crop.result_help')}
                </p>
              </div>
            )}

            {loading && (
              <div className="py-16 text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-agro-600 mx-auto" />
                <p className="text-xs text-slate-400">Crunching parameters and predicting crop...</p>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-5 bg-agro-50 border border-agro-100 rounded-2xl text-center space-y-1.5">
                  <span className="text-[10px] font-extrabold text-agro-700 uppercase tracking-widest bg-agro-100/70 px-2.5 py-0.5 rounded-full">
                    {t('crop.match')}
                  </span>
                  <h4 className="text-2xl font-black text-agro-900">{result.crop}</h4>
                  <p className="text-xs text-slate-500 font-medium">{t('crop.confidence')}: {result.confidence.toFixed(1)}%</p>
                </div>

                <div className="space-y-4 text-sm">
                  
                  {/* Advisory Item 1 */}
                  <div className="flex gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl h-fit">
                      <Droplet className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-0.5">{t('crop.irrigation')}</h5>
                      <p className="text-xs text-slate-600 leading-normal">{result.irrigation}</p>
                    </div>
                  </div>

                  {/* Advisory Item 2 */}
                  <div className="flex gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl h-fit">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-0.5">{t('crop.fertilizer')}</h5>
                      <p className="text-xs text-slate-600 leading-normal">{result.fertilizer}</p>
                    </div>
                  </div>

                  {/* Advisory Item 3 */}
                  <div className="flex gap-3">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-xl h-fit">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-0.5">{t('crop.yield')}</h5>
                      <p className="text-xs text-slate-600 leading-normal">{result.yieldEst}</p>
                    </div>
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

