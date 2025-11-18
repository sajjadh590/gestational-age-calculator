import React, { useState, useMemo, useEffect } from 'react';
import { GACalculator } from './components/GACalculator';
import { Dashboard } from './components/Dashboard';
import { PatientManager } from './components/PatientManager';
import { Pregnancy, PregnancyData, Vital, FetalBiometryEntry } from './types';
import { getPregnancyData } from './services/clinicalEngine';
import { Language, t } from './i18n';

const PREGNANCY_STORAGE_KEY = 'ob-gyn-cases';
const CURRENT_PREGNANCY_ID_KEY = 'ob-gyn-current-case-id';

type View = 'patientList' | 'newPatientForm' | 'dashboard';

// Main App Component
const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('fa');
  const [view, setView] = useState<View>('newPatientForm');
  
  const [savedPregnancies, setSavedPregnancies] = useState<Pregnancy[]>([]);
  const [currentPregnancy, setCurrentPregnancy] = useState<Pregnancy | null>(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREGNANCY_STORAGE_KEY);
      let pregnancies: Pregnancy[] = [];
      if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
              pregnancies = parsed
                  .map((p: any): Pregnancy | null => {
                      // --- CORE VALIDATION ---
                      if (!p || typeof p.id !== 'string' || typeof p.name !== 'string' || !p.edc) {
                          console.warn('Filtering out corrupted pregnancy data (missing core fields):', p);
                          return null;
                      }

                      const edcDate = new Date(p.edc);
                      if (isNaN(edcDate.getTime())) {
                           console.warn('Filtering out corrupted pregnancy data (invalid EDC):', p);
                           return null;
                      }
                      
                      // --- EXPLICIT RECONSTRUCTION (SAFER THAN SPREADING `...p`) ---
                      
                      const lmpDate = p.lmp ? new Date(p.lmp) : undefined;
                      if (p.lmp && (!lmpDate || isNaN(lmpDate.getTime()))) {
                           console.warn('Filtering out corrupted pregnancy data (invalid LMP):', p);
                           return null;
                      }
                      
                      let ultrasoundData = p.ultrasound;
                      if (ultrasoundData && ultrasoundData.scanDate) {
                          const scanDate = new Date(ultrasoundData.scanDate);
                          if (isNaN(scanDate.getTime())) {
                              console.warn('Filtering out corrupted pregnancy data (invalid scanDate):', p);
                              // We can nullify the whole ultrasound object or just the date. Let's nullify the object for safety.
                              ultrasoundData = undefined; 
                          } else {
                              ultrasoundData = { ...ultrasoundData, scanDate };
                          }
                      }
                      
                      const validatedVitals = (Array.isArray(p.vitals) ? p.vitals : [])
                        .map((v: any) => {
                            if (!v || typeof v.date !== 'string' || isNaN(new Date(v.date).getTime())) return null;
                            return {
                                date: v.date,
                                weight: typeof v.weight === 'number' && !isNaN(v.weight) ? v.weight : undefined,
                                bpSystolic: typeof v.bpSystolic === 'number' && !isNaN(v.bpSystolic) ? v.bpSystolic : undefined,
                                bpDiastolic: typeof v.bpDiastolic === 'number' && !isNaN(v.bpDiastolic) ? v.bpDiastolic : undefined,
                            };
                        })
                        .filter((v): v is Vital => v !== null);

                      const validatedBiometry = (Array.isArray(p.fetalBiometry) ? p.fetalBiometry : [])
                        .map((b: any) => {
                            if (!b || typeof b.date !== 'string' || isNaN(new Date(b.date).getTime()) || typeof b.gaWeeks !== 'number' || isNaN(b.gaWeeks)) return null;
                            return {
                                date: b.date,
                                gaWeeks: b.gaWeeks,
                                bpd: typeof b.bpd === 'number' && !isNaN(b.bpd) ? b.bpd : undefined,
                                hc: typeof b.hc === 'number' && !isNaN(b.hc) ? b.hc : undefined,
                                ac: typeof b.ac === 'number' && !isNaN(b.ac) ? b.ac : undefined,
                                fl: typeof b.fl === 'number' && !isNaN(b.fl) ? b.fl : undefined,
                            };
                        })
                        .filter((b): b is FetalBiometryEntry => b !== null);
                      
                      const currentDate = p.currentDate ? new Date(p.currentDate) : new Date();
                      if (isNaN(currentDate.getTime())) {
                          console.warn('Filtering out corrupted pregnancy data (invalid currentDate):', p);
                          return null;
                      }

                      // Build a new, clean object. This prevents any unknown/corrupted fields from `p` from being spread into the state.
                      const safePregnancy: Pregnancy = {
                          id: p.id,
                          name: p.name,
                          edc: edcDate,
                          lmp: lmpDate,
                          ultrasound: ultrasoundData,
                          gaDays: typeof p.gaDays === 'number' ? p.gaDays : 0,
                          datingMethod: typeof p.datingMethod === 'string' ? p.datingMethod : 'Unknown',
                          reconciliationMessage: typeof p.reconciliationMessage === 'string' ? p.reconciliationMessage : undefined,
                          currentDate: currentDate,
                          vitals: validatedVitals,
                          fetalBiometry: validatedBiometry,
                      };
                      return safePregnancy;
                  })
                  .filter((p): p is Pregnancy => p !== null);
          }
      }
      setSavedPregnancies(pregnancies);

      const activeId = localStorage.getItem(CURRENT_PREGNANCY_ID_KEY);
      if (activeId) {
          const activePregnancy = pregnancies.find(p => p.id === activeId);
          if (activePregnancy) {
              setCurrentPregnancy(activePregnancy);
              setView('dashboard');
          } else {
              setView('patientList');
          }
      } else if (pregnancies.length > 0) {
          setView('patientList');
      }
    } catch (error) {
      console.error("Failed to load saved data:", error);
      // If parsing fails entirely, clear potentially corrupted data to prevent future errors
      localStorage.removeItem(PREGNANCY_STORAGE_KEY);
      localStorage.removeItem(CURRENT_PREGNANCY_ID_KEY);
    }
  }, []);

  // Save pregnancies to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(PREGNANCY_STORAGE_KEY, JSON.stringify(savedPregnancies));
    } catch (error) {
      console.error("Failed to save cases:", error);
    }
  }, [savedPregnancies]);

  // Effect to handle inconsistent state where dashboard is active without a pregnancy
  useEffect(() => {
    if (view === 'dashboard' && !currentPregnancy) {
        setView('patientList');
        localStorage.removeItem(CURRENT_PREGNANCY_ID_KEY);
    }
  }, [view, currentPregnancy]);
  
  const handleCreatePregnancy = (newPregnancy: Pregnancy) => {
    setSavedPregnancies(prev => [...prev, newPregnancy]);
    setCurrentPregnancy(newPregnancy);
    localStorage.setItem(CURRENT_PREGNANCY_ID_KEY, newPregnancy.id);
    setView('dashboard');
  };
  
  const handleLoadPregnancy = (id: string) => {
    const pregnancy = savedPregnancies.find(p => p.id === id);
    if (pregnancy) {
        setCurrentPregnancy(pregnancy);
        localStorage.setItem(CURRENT_PREGNANCY_ID_KEY, id);
        setView('dashboard');
    }
  };

  const handleDeletePregnancy = (id: string) => {
    if (confirm(t('confirmDeleteCase', language))) {
        setSavedPregnancies(prev => prev.filter(p => p.id !== id));
        if (currentPregnancy?.id === id) {
            setCurrentPregnancy(null);
            localStorage.removeItem(CURRENT_PREGNANCY_ID_KEY);
            setView('patientList');
        }
    }
  };
  
  const handleUpdateCurrentPregnancy = (updatedData: Partial<Pregnancy>) => {
      if (!currentPregnancy) return;
      
      const updatedPregnancy = { ...currentPregnancy, ...updatedData };
      setCurrentPregnancy(updatedPregnancy);
      
      setSavedPregnancies(prev => prev.map(p => p.id === updatedPregnancy.id ? updatedPregnancy : p));
  };

  const handleSwitchView = (newView: View) => {
      if (newView === 'patientList') {
          setCurrentPregnancy(null);
          localStorage.removeItem(CURRENT_PREGNANCY_ID_KEY);
      }
      setView(newView);
  };

  const handleSaveCurrent = () => {
      if (!currentPregnancy) return;
      alert(`'${currentPregnancy.name}' ${t('caseSaved', language)}`);
  };

  const pregnancyData: PregnancyData | null = useMemo(() => {
    if (!currentPregnancy) return null;
    return getPregnancyData(currentPregnancy);
  }, [currentPregnancy, language]);

  const renderContent = () => {
      switch(view) {
          case 'patientList':
              return <PatientManager 
                        pregnancies={savedPregnancies} 
                        onLoad={handleLoadPregnancy} 
                        onDelete={handleDeletePregnancy} 
                        onAddNew={() => setView('newPatientForm')}
                        lang={language} 
                     />;
          case 'newPatientForm':
              return <GACalculator 
                        onCalculate={handleCreatePregnancy} 
                        lang={language} 
                     />;
          case 'dashboard':
              if (pregnancyData) {
                  return <Dashboard pregnancyData={pregnancyData} onUpdate={handleUpdateCurrentPregnancy} lang={language}/>
              }
              return <div className="text-center p-8 text-gray-500">Loading patient data...</div>;
      }
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800" dir={language === 'fa' ? 'rtl' : 'ltr'}>
      <Header 
        currentView={view}
        onSwitchView={handleSwitchView}
        onSave={handleSaveCurrent}
        lang={language} 
        setLang={setLanguage} 
      />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

// Header Component
const Header: React.FC<{ 
    currentView: View;
    onSwitchView: (view: View) => void;
    onSave: () => void;
    lang: Language; 
    setLang: (lang: Language) => void;
}> = ({ currentView, onSwitchView, onSave, lang, setLang }) => {
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
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
             <button onClick={toggleLanguage} className="text-sm font-medium text-primary-600 hover:text-primary-800 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                {lang === 'fa' ? 'English' : 'فارسی'}
             </button>
             
             {currentView !== 'patientList' && (
                <button onClick={() => onSwitchView('patientList')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center space-x-2 rtl:space-x-reverse">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <span className="hidden md:inline">{t('manageCases', lang)}</span>
                    <span className="md:hidden">{t('cases', lang)}</span>
                </button>
             )}

             {currentView === 'dashboard' && (
                <button onClick={onSave} className="bg-accent hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">{t('saveCase', lang)}</button>
             )}
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
