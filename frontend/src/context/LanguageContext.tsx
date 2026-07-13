'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Sidebar
    'nav.dashboard': 'Dashboard Home',
    'nav.crop': 'Crop Recommendation',
    'nav.disease': 'Disease Detection',
    'nav.market': 'Market Prices',
    'nav.weather': 'Weather Forecast',
    'nav.advisory': 'Personalized Advisory',
    'nav.chatbot': 'Agro AI Chatbot',
    'nav.admin': 'Admin Dashboard',
    'nav.signout': 'Sign Out',
    
    // Header / General
    'title.platform': 'Smart Agro AI',
    'subtitle.platform': 'AI Agriculture Platform',
    
    // Crop Recommendation
    'crop.title': 'AI Crop Recommendation',
    'crop.subtitle': 'Provide local soil mineral composition and environmental parameters to identify optimal planting choices.',
    'crop.section_title': 'Soil Composition & Climate Data',
    'crop.label_n': 'Nitrogen (N) - kg/ha',
    'crop.label_p': 'Phosphorus (P) - kg/ha',
    'crop.label_k': 'Potassium (K) - kg/ha',
    'crop.label_ph': 'Soil pH Level',
    'crop.label_temp': 'Temperature (°C)',
    'crop.label_humidity': 'Humidity (%)',
    'crop.label_rainfall': 'Average Rainfall (mm)',
    'crop.label_soil': 'Soil Type',
    'crop.btn_analyze': 'Analyze Soil & Get Recommendation',
    'crop.btn_analyzing': 'Calculating Recommendation Profile...',
    'crop.result_title': 'Recommendation Result',
    'crop.result_help': 'Provide soil parameters on the left and submit to view AI output.',
    'crop.match': 'Optimal Match',
    'crop.confidence': 'Confidence Score',
    'crop.irrigation': 'Irrigation Suggestion',
    'crop.fertilizer': 'Fertilizer Recommendation',
    'crop.yield': 'Estimated Productivity',

    // Dashboard Home
    'dashboard.welcome': 'Welcome back,',
    'dashboard.subtitle': 'Diagnose plant illnesses, analyze soil minerals, inspect real-time mandi prices, and check meteorological updates to keep your farming business profitable.',
    'dashboard.tools_title': 'Quick Diagnostics Tools',
    'dashboard.crop_rec_title': 'Crop Recommendation',
    'dashboard.crop_rec_desc': 'Calculate ideal planting options based on N, P, K, pH levels.',
    'dashboard.crop_rec_btn': 'Launch Crop Tool',
    'dashboard.disease_title': 'Leaf Disease Detection',
    'dashboard.disease_desc': 'Analyze leaf samples instantly to discover and cure infections.',
    'dashboard.disease_btn': 'Launch Disease Tool',
    'dashboard.mandi_title': 'Mandi Commodity Tracker',
    'dashboard.mandi_link': 'View Full Market',
    'dashboard.met_title': 'Meteorology',
    'dashboard.met_btn': '5-Day Meteorological Forecast',
    'dashboard.advisory_title': 'Advisory & Alerts',
    'dashboard.advisory_btn': 'View All Advisory Broadcasts',
    'dashboard.loading_mandi': 'Loading mandi pricing...',
    'dashboard.loading_weather': 'Loading meteorological forecasting...',
    'dashboard.loading_alerts': 'Loading alerts...',
    'dashboard.no_alerts': 'No active government alerts.'
  },
  hi: {
    // Sidebar
    'nav.dashboard': 'डैशबोर्ड होम',
    'nav.crop': 'फसल की सिफारिश',
    'nav.disease': 'रोग पहचान',
    'nav.market': 'मंडी भाव',
    'nav.weather': 'मौसम का पूर्वानुमान',
    'nav.advisory': 'व्यक्तिगत सलाह',
    'nav.chatbot': 'कृषि एआई चैटबॉट',
    'nav.admin': 'एडमिन डैशबोर्ड',
    'nav.signout': 'साइन आउट',
    
    // Header / General
    'title.platform': 'स्मार्ट एग्रो एआई',
    'subtitle.platform': 'एआई कृषि प्लेटफॉर्म',
    
    // Crop Recommendation
    'crop.title': 'एआई फसल सिफारिश',
    'crop.subtitle': 'सर्वोत्तम रोपण विकल्पों की पहचान करने के लिए स्थानीय मिट्टी के खनिज संयोजन और पर्यावरणीय मापदंड प्रदान करें।',
    'crop.section_title': 'मिट्टी की संरचना और जलवायु डेटा',
    'crop.label_n': 'नाइट्रोजन (N) - किग्रा/हेक्टेयर',
    'crop.label_p': 'फास्फोरस (P) - किग्रा/हेक्टेयर',
    'crop.label_k': 'पोटेशियम (K) - किग्रा/हेक्टेयर',
    'crop.label_ph': 'मिट्टी का पीएच (pH) स्तर',
    'crop.label_temp': 'तापमान (°C)',
    'crop.label_humidity': 'आर्द्रता (%)',
    'crop.label_rainfall': 'औसत वर्षा (mm)',
    'crop.label_soil': 'मिट्टी का प्रकार',
    'crop.btn_analyze': 'मिट्टी का विश्लेषण करें और सिफारिश प्राप्त करें',
    'crop.btn_analyzing': 'सिफारिश प्रोफाइल की गणना की जा रही है...',
    'crop.result_title': 'सिफारिश का परिणाम',
    'crop.result_help': 'एआई आउटपुट देखने के लिए बाईं ओर मिट्टी के मापदंड प्रदान करें और सबमिट करें।',
    'crop.match': 'सर्वोत्तम मिलान',
    'crop.confidence': 'विश्वास स्कोर',
    'crop.irrigation': 'सिंचाई का सुझाव',
    'crop.fertilizer': 'उर्वरक की सिफारिश',
    'crop.yield': 'अनुमानित उत्पादकता',

    // Dashboard Home
    'dashboard.welcome': 'फिर से स्वागत है,',
    'dashboard.subtitle': 'फसल बीमारी का पता लगाएं, मिट्टी के खनिजों का विश्लेषण करें, वास्तविक समय मंडी कीमतों की जांच करें और अपने कृषि व्यवसाय को लाभदायक बनाए रखने के लिए मौसम अपडेट देखें।',
    'dashboard.tools_title': 'त्वरित निदान उपकरण',
    'dashboard.crop_rec_title': 'फसल की सिफारिश',
    'dashboard.crop_rec_desc': 'नाइट्रोजन, फास्फोरस, पोटेशियम, पीएच स्तर के आधार पर आदर्श फसल रोपण विकल्पों की गणना करें।',
    'dashboard.crop_rec_btn': 'फसल उपकरण शुरू करें',
    'dashboard.disease_title': 'पत्ती रोग पहचान',
    'dashboard.disease_desc': 'संक्रमण का पता लगाने और उसका इलाज करने के लिए पत्तियों के नमूनों का तुरंत विश्लेषण करें।',
    'dashboard.disease_btn': 'रोग उपकरण शुरू करें',
    'dashboard.mandi_title': 'मंडी कमोडिटी ट्रैकर',
    'dashboard.mandi_link': 'पूरा मंडी भाव देखें',
    'dashboard.met_title': 'मौसम विज्ञान',
    'dashboard.met_btn': '5-दिवसीय मौसम पूर्वानुमान',
    'dashboard.advisory_title': 'सलाह और अलर्ट',
    'dashboard.advisory_btn': 'सभी सरकारी सलाह अलर्ट देखें',
    'dashboard.loading_mandi': 'मंडी भाव लोड हो रहा है...',
    'dashboard.loading_weather': 'मौसम पूर्वानुमान लोड हो रहा है...',
    'dashboard.loading_alerts': 'अलर्ट लोड हो रहे हैं...',
    'dashboard.no_alerts': 'कोई सक्रिय सरकारी अलर्ट नहीं है।'
  },
  te: {
    // Sidebar
    'nav.dashboard': 'డాష్‌బోర్డ్ హోమ్',
    'nav.crop': 'పంట సిఫార్సు',
    'nav.disease': 'తెగుళ్ల గుర్తింపు',
    'nav.market': 'మార్కెట్ ధరలు',
    'nav.weather': 'వాతావరణ సూచన',
    'nav.advisory': 'వ్యక్తిగత సలహా',
    'nav.chatbot': 'అగ్రో ఐ చాట్‌బాట్',
    'nav.admin': 'అడ్మిన్ డాష్‌బోర్డ్',
    'nav.signout': 'లాగ్ అవుట్',
    
    // Header / General
    'title.platform': 'స్మార్ట్ ఆగ్రో ఐ',
    'subtitle.platform': 'ఐ వ్యవసాయ వేదిక',
    
    // Crop Recommendation
    'crop.title': 'ఐ పంట సిఫార్సు',
    'crop.subtitle': 'ఉత్తమ పంట ఎంపికలను గుర్తించడానికి స్థానిక నేల ఖనిజాల కలయిక మరియు పర్యావరణ పారామితులను అందించండి.',
    'crop.section_title': 'నేల కూర్పు & వాతావరణ డేటా',
    'crop.label_n': 'నత్రజని (N) - కిలో/హెక్టార్',
    'crop.label_p': 'భాస్వరం (P) - కిలో/హెక్టార్',
    'crop.label_k': 'పొటాషియం (K) - కిలో/హెక్టార్',
    'crop.label_ph': 'నేల పిహెచ్ (pH) స్థాయి',
    'crop.label_temp': 'ఉష్ణోగ్రత (°C)',
    'crop.label_humidity': 'తేమ (%)',
    'crop.label_rainfall': 'సగటు వర్షపాతం (mm)',
    'crop.label_soil': 'నేల రకం',
    'crop.btn_analyze': 'నేలను విశ్లేషించండి & సిఫార్సు పొందండి',
    'crop.btn_analyzing': 'సిఫార్సు ప్రొఫైల్ గణిస్తోంది...',
    'crop.result_title': 'సిఫార్సు ఫలితం',
    'crop.result_help': 'ఐ ఫలితాన్ని చూడటానికి ఎడమ వైపున నేల పారామితులను నమోదు చేసి సమర్పించండి.',
    'crop.match': 'ఉత్తమ సరిపోలిక',
    'crop.confidence': 'విశ్వసనీయత స్కోరు',
    'crop.irrigation': 'నీటిపారుదల సలహా',
    'crop.fertilizer': 'ఎరువుల సిఫార్సు',
    'crop.yield': 'అంచనా ఉత్పాదకత',

    // Dashboard Home
    'dashboard.welcome': 'తిరిగి స్వాగతం,',
    'dashboard.subtitle': 'మొక్కల వ్యాధులను నిర్ధారించండి, నేల ఖనిజాలను విశ్లేషించండి, నిజ-సమయ మార్కెట్ ధరలను తనిఖీ చేయండి మరియు మీ వ్యవసాయ వ్యాపారాన్ని లాభదాయకంగా ఉంచడానికి వాతావరణ అప్‌డేట్‌లను చూడండి.',
    'dashboard.tools_title': 'త్వరిత విశ్లేషణ సాధనాలు',
    'dashboard.crop_rec_title': 'పంట సిఫార్సు',
    'dashboard.crop_rec_desc': 'నత్రజని, భాస్వరం, పొటాషియం, పిహెచ్ స్థాయిల ఆధారంగా సరైన పంట ఎంపికలను లెక్కించండి.',
    'dashboard.crop_rec_btn': 'పంట సాధనాన్ని ప్రారంభించండి',
    'dashboard.disease_title': 'ఆకు తెగులు గుర్తింపు',
    'dashboard.disease_desc': 'ఇన్ఫెక్షన్లను గుర్తించడానికి మరియు నయం చేయడానికి ఆకు నమూనాలను తక్షణమే విశ్లేషించండి.',
    'dashboard.disease_btn': 'తెగులు సాధనాన్ని ప్రారంభించండి',
    'dashboard.mandi_title': 'మార్కెట్ కమోడిటీ ట్రాకర్',
    'dashboard.mandi_link': 'పూర్తి మార్కెట్ ధరలు చూడండి',
    'dashboard.met_title': 'వాతావరణ శాస్త్రం',
    'dashboard.met_btn': '5-రోజుల వాతావరణ సూచన',
    'dashboard.advisory_title': 'సలహాలు & హెచ్చరికలు',
    'dashboard.advisory_btn': 'అన్ని ప్రభుత్వ సలహాలను చూడండి',
    'dashboard.loading_mandi': 'ధరలను లోడ్ చేస్తోంది...',
    'dashboard.loading_weather': 'వాతావరణ సూచనలను లోడ్ చేస్తోంది...',
    'dashboard.loading_alerts': 'హెచ్చరికలను లోడ్ చేస్తోంది...',
    'dashboard.no_alerts': 'ప్రస్తుతం ఎటువంటి ప్రభుత్వ హెచ్చరికలు లేవు.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') as Language;
    if (storedLang === 'en' || storedLang === 'hi' || storedLang === 'te') {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
