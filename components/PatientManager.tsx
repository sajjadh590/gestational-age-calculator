import React from 'react';
import { Pregnancy } from '../types';
import { Language, t } from '../i18n';
import { formatGregorian } from '../services/calendarService';

interface PatientManagerProps {
  pregnancies: Pregnancy[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  lang: Language;
}

export const PatientManager: React.FC<PatientManagerProps> = ({ pregnancies, onLoad, onDelete, onAddNew, lang }) => {
  
  // Defensively render the EDC to prevent a crash if a single record is corrupted.
  const renderEDC = (edc: unknown): string => {
    if (edc instanceof Date && !isNaN(edc.getTime())) {
      return formatGregorian(edc);
    }
    // This fallback prevents the entire app from crashing due to one bad entry.
    return 'Invalid Date';
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-primary-800">{t('patientManagerTitle', lang)}</h2>
        <button
          onClick={onAddNew}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center space-x-2 rtl:space-x-reverse"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          <span>{t('addPatient', lang)}</span>
        </button>
      </div>
      
      {pregnancies.length === 0 ? (
        <div className="text-center py-16">
          <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-800">{t('welcomeMessage', lang)}</h3>
          <p className="mt-2 text-sm text-gray-500">{t('welcomeCTA', lang)}</p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {pregnancies.map(p => (
            <li key={p.id} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-bold text-gray-800">{p.name || t('untitledCase', lang)}</p>
                <p className="text-sm text-gray-500">{t('edc', lang)}: {renderEDC(p.edc)}</p>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button onClick={() => onLoad(p.id)} className="bg-accent hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors">{t('loadCase', lang)}</button>
                <button onClick={() => onDelete(p.id)} className="bg-danger hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors">{t('deleteCase', lang)}</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};