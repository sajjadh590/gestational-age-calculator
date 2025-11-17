import React, { useState, useMemo } from 'react';
import { GACalculator } from './components/GACalculator';
import { Dashboard } from './components/Dashboard';
import { Pregnancy, PregnancyData } from './types';
import { getPregnancyData } from './services/clinicalEngine';
import { Language, t } from './i18n';

// Main App Component
const App: React.FC = () => {
  const [pregnancy, setPregnancy] = useState<Pregnancy | null>(null);
  const [language, setLanguage] = useState<Language>('fa'); // Default to Persian

  const handleNewCalculation = (newPregnancy: Pregnancy) => {
    setPregnancy(newPregnancy);
  };

  const handleReset = () => {
    setPregnancy(null);
  };

  const pregnancyData: PregnancyData | null = useMemo(() => {
    if (!pregnancy) return null;
    return getPregnancyData(pregnancy);
  }, [pregnancy, language]); // Add language dependency

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800" dir={language === 'fa' ? 'rtl' : 'ltr'}>
      <Header onReset={handleReset} lang={language} setLang={setLanguage} />
      <main className="container mx-auto p-4 md:p-8">
        {!pregnancyData ? (
          <GACalculator onCalculate={handleNewCalculation} lang={language} />
        ) : (
          <Dashboard pregnancyData={pregnancyData} lang={language}/>
        )}
      </main>
      <Footer />
    </div>
  );
};

// Header Component
const Header: React.FC<{ onReset: () => void; lang: Language, setLang: (lang: Language) => void }> = ({ onReset, lang, setLang }) => {
    const toggleLanguage = () => {
        setLang(lang === 'fa' ? 'en' : 'fa');
    };
    
    return (
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <svg className="w-10 h-10 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21C16.4183 21 20 17.4183 20 13C20 8.58172 16.4183 5 12 5C7.58172 5 4 8.58172 4 13C4 17.4183 7.58172 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 10V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-2xl md:text-3xl font-bold text-primary-800">
              {t('appName', lang)}
            </h1>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
             <button onClick={toggleLanguage} className="text-sm font-medium text-primary-600 hover:text-primary-800">
                {lang === 'fa' ? 'English' : 'فارسی'}
             </button>
            <button
              onClick={onReset}
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center space-x-2 rtl:space-x-reverse"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 20v-5h-5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9a9 9 0 0114.13-6.36M20 15a9 9 0 01-14.13 6.36" /></svg>
              <span className="hidden md:inline">{t('newCase', lang)}</span>
            </button>
          </div>
        </div>
      </header>
    );
};


// Footer Component
const Footer: React.FC = () => (
    <footer className="text-center py-6 mt-8 bg-gray-100 border-t">
        <p className="text-sm text-gray-500">
            Disclaimer: This tool is for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
        </p>
        <p className="text-sm text-gray-500 mt-1">
            Always consult with a qualified healthcare provider for any medical concerns.
        </p>
    </footer>
);

export default App;