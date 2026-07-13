'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { CloudSun, CloudSunRain, Sun, CloudRain, CloudLightning, Loader2, Wind, Droplet, Thermometer } from 'lucide-react';

export default function WeatherPage() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await api.get('/weather');
        setWeather(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />;
      case 'partly cloudy':
        return <CloudSun className="w-8 h-8 text-blue-400" />;
      case 'rain showers':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'thunderstorm':
        return <CloudLightning className="w-8 h-8 text-indigo-600" />;
      default:
        return <CloudSunRain className="w-8 h-8 text-sky-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <CloudSun className="w-6 h-6 text-blue-500" />
          Agricultural Meteorology
        </h2>
        <p className="text-sm text-slate-500">View current regional microclimates and upcoming precipitation logs to plan irrigation cycles.</p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-agro-600" />
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Current weather card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="flex items-center gap-6">
              <div className="p-5 bg-blue-50 text-blue-600 rounded-3xl">
                {getWeatherIcon(weather.current.condition)}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Forecast</span>
                <h3 className="text-4xl font-black text-slate-800">{weather.current.temp}°C</h3>
                <p className="text-sm font-bold text-slate-600">{weather.current.condition}</p>
              </div>
            </div>

            {/* Met parameters */}
            <div className="grid grid-cols-3 gap-4 border-l border-slate-100 pl-0 md:pl-8">
              
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase">
                  <Droplet className="w-3.5 h-3.5 text-blue-400" />
                  Humidity
                </div>
                <p className="text-lg font-black text-slate-800">{weather.current.humidity}%</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase">
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                  Wind
                </div>
                <p className="text-lg font-black text-slate-800">{weather.current.windSpeed} km/h</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase">
                  <CloudRain className="w-3.5 h-3.5 text-indigo-400" />
                  Rain Chance
                </div>
                <p className="text-lg font-black text-slate-800">{weather.current.rainfallChance}</p>
              </div>

            </div>

          </div>

          {/* 5-Day Forecast Grid */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800">5-Day Meteorological Timeline</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {weather.forecast.map((item: any, index: number) => (
                <div 
                  key={index}
                  className="bg-white border border-slate-200 p-5 rounded-2xl text-center space-y-3 agro-card"
                >
                  <p className="text-xs font-extrabold text-slate-400 uppercase">{item.day}</p>
                  <div className="mx-auto w-fit p-2.5 bg-slate-50 rounded-xl">
                    {getWeatherIcon(item.condition)}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-base font-black text-slate-800">{item.temp}°C</p>
                    <p className="text-[10px] text-slate-500 font-semibold truncate leading-normal">{item.condition}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
