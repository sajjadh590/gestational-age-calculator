import React, { useState } from 'react';
import { fromJalali, isValidJalali, daysBetween, addDays, diffDays } from '../services/calendarService';
import { calculateGAfromCRL, calculateGAfromBiometry, calculateEDCfromLMP, calculateEDCfromGA, reconcileDates, TERM_PREGNANCY_DAYS } from '../services/datingService';
import { Pregnancy, UltrasoundData } from '../types';
import { Language, t, translations } from '../i18n';

interface GACalculatorProps {
  onCalculate: (pregnancy: Pregnancy) => void;
  lang: Language;
}

type UltrasoundInputMode = 'biometry' | 'report';

interface CalculationResult {
  finalEDC: Date;
  datingMethod: string;
  reconciliationMessage: string;
  lmp?: Date;
  ultrasound?: UltrasoundData;
  // For display
  lmpEDC?: Date;
  usEDC?: Date;
  gaOnScanDate?: number;
  projectedGAToday?: number;
}

export const GACalculator: React.FC<GACalculatorProps> = ({ onCalculate, lang }) => {
  // Common State
  const [patientName, setPatientName] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);

  // LMP State
  const [lmpJy, setLmpJy] = useState('');
  const [lmpJm, setLmpJm] = useState('');
  const [lmpJd, setLmpJd] = useState('');

  // Ultrasound State
  const [usInputMode, setUsInputMode] = useState<UltrasoundInputMode>('biometry');
  const [usJy, setUsJy] = useState('');
  const [usJm, setUsJm] = useState('');
  const [usJd, setUsJd] = useState('');
  // Biometry State
  const [crl, setCrl] = useState('');
  const [bpd, setBpd] = useState('');
  const [hc, setHc] = useState('');
  const [ac, setAc] = useState('');
  const [fl, setFl] = useState('');
  // Report State
  const [usGaWeeks, setUsGaWeeks] = useState('');
  const [usGaDays, setUsGaDays] = useState('');


  const handleCalculate = () => {
    setError('');
    setResult(null);

    const lmpDate = isValidJalali(parseInt(lmpJy), parseInt(lmpJm), parseInt(lmpJd))
      ? fromJalali({ jy: parseInt(lmpJy), jm: parseInt(lmpJm), jd: parseInt(lmpJd) })
      : undefined;

    let gaByUS: number | null = null; // This will be GA in days ON THE SCAN DATE
    // Fix: Corrected typo from isValidJali to isValidJalali.
    let usScanDate: Date | undefined = isValidJalali(parseInt(usJy), parseInt(usJm), parseInt(usJd))
        ? fromJalali({ jy: parseInt(usJy), jm: parseInt(usJm), jd: parseInt(usJd) })
        : undefined;
    let ultrasoundForPregnancyObject: UltrasoundData | undefined;

    const crlNum = parseFloat(crl);
    const bpdNum = parseFloat(bpd);
    const hcNum = parseFloat(hc);
    const acNum = parseFloat(ac);
    const flNum = parseFloat(fl);
    const hasBiometryInput = !isNaN(crlNum) || !isNaN(bpdNum) || !isNaN(hcNum) || !isNaN(acNum) || !isNaN(flNum);
    
    const gaWeeksNum = parseInt(usGaWeeks);
    const gaDaysNum = parseInt(usGaDays);
    const hasReportInput = !isNaN(gaWeeksNum) || !isNaN(gaDaysNum);

    if (usInputMode === 'biometry' && hasBiometryInput) {
        if (!usScanDate) {
            setError(t('ultrasoundDateMissing', lang));
            return;
        }
        if (!isNaN(crlNum) && crlNum > 0) {
            gaByUS = calculateGAfromCRL(crlNum);
        } else {
            gaByUS = calculateGAfromBiometry({ bpd: bpdNum || undefined, hc: hcNum || undefined, ac: acNum || undefined, fl: flNum || undefined });
        }
        
        if (gaByUS) {
            ultrasoundForPregnancyObject = {
                scanDate: usScanDate,
                crl: !isNaN(crlNum) ? crlNum : undefined,
                bpd: !isNaN(bpdNum) ? bpdNum : undefined,
                hc: !isNaN(hcNum) ? hcNum : undefined,
                ac: !isNaN(acNum) ? acNum : undefined,
                fl: !isNaN(flNum) ? flNum : undefined,
                gaOnScanDateDays: gaByUS,
            };
        }
    } else if (usInputMode === 'report' && hasReportInput) {
        if (!usScanDate) {
            setError(t('ultrasoundDateMissing', lang));
            return;
        }
        if (gaWeeksNum < 0 || gaWeeksNum > 44 || gaDaysNum < 0 || gaDaysNum > 6) {
            setError(t('invalidGAError', lang));
            return;
        }
        gaByUS = (gaWeeksNum || 0) * 7 + (gaDaysNum || 0);
        ultrasoundForPregnancyObject = {
            scanDate: usScanDate,
            gaOnScanDateDays: gaByUS
        };
    }

    if (!lmpDate && !gaByUS) {
      setError(t('noInputError', lang));
      return;
    }

    let finalEDC: Date;
    let datingMethod: string;
    let reconciliationMessage: string = "";

    if (lmpDate && gaByUS && usScanDate) {
        const reconciliation = reconcileDates(lmpDate, { gaDays: gaByUS, scanDate: usScanDate });
        finalEDC = reconciliation.finalEDC;
        datingMethod = t(reconciliation.methodKey === 'lmp' ? 'lmpBased' : 'ultrasoundBased', lang);
        reconciliationMessage = t(reconciliation.messageKey as keyof typeof translations, lang);
    } else if (lmpDate) {
        finalEDC = calculateEDCfromLMP(lmpDate);
        datingMethod = t('lmpBased', lang);
    } else if (gaByUS && usScanDate) {
        finalEDC = calculateEDCfromGA(gaByUS, usScanDate);
        datingMethod = t('ultrasoundBased', lang);
    } else {
        setError(t('calculationError', lang));
        return;
    }

    const lmpEDC = lmpDate ? calculateEDCfromLMP(lmpDate) : undefined;
    const usEDC = gaByUS && usScanDate ? calculateEDCfromGA(gaByUS, usScanDate) : undefined;
    
    // Use diffDays for signed calculation to handle overdue projections correctly.
    // If today is after EDC, diffDays is negative, result is > 280.
    const projectedGAToday = usEDC ? TERM_PREGNANCY_DAYS - diffDays(new Date(), usEDC) : undefined;
    
    setResult({
        finalEDC,
        datingMethod,
        reconciliationMessage,
        lmp: lmpDate,
        ultrasound: ultrasoundForPregnancyObject,
        lmpEDC,
        usEDC,
        gaOnScanDate: gaByUS ?? undefined,
        projectedGAToday: projectedGAToday ? Math.floor(projectedGAToday) : undefined,
    });
  };

  const handleConfirm = () => {
    if (!result) return;
    const pregnancy: Pregnancy = {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        name: patientName.trim() || `${t('untitledCase', lang)} - ${new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}`,
        edc: result.finalEDC,
        gaDays: 0, // This will be recalculated by the engine
        currentDate: new Date(),
        datingMethod: result.datingMethod,
        reconciliationMessage: result.reconciliationMessage,
        lmp: result.lmp,
        ultrasound: result.ultrasound,
        vitals: [],
        fetalBiometry: [],
    };
    onCalculate(pregnancy);
  }

  const renderLMPForm = () => (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-bold text-gray-800">{t('lmpDatingTab', lang)}</h3>
      <p className="text-sm text-secondary mt-1 mb-3">{t('lmpInstruction', lang)}</p>
      <div className="grid grid-cols-3 gap-2">
        <input type="number" value={lmpJd} onChange={(e) => setLmpJd(e.target.value)} placeholder={t('day', lang)} className="w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm text-center"/>
        <input type="number" value={lmpJm} onChange={(e) => setLmpJm(e.target.value)} placeholder={t('month', lang)} className="w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm text-center"/>
        <input type="number" value={lmpJy} onChange={(e) => setLmpJy(e.target.value)} placeholder={t('year', lang)} className="w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm text-center"/>
      </div>
    </div>
  );
  
  const renderScanDateInput = () => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('scanDate', lang)}</label>
        <div className="grid grid-cols-3 gap-2">
            <input type="number" value={usJd} onChange={(e) => setUsJd(e.target.value)} placeholder={t('day', lang)} className="w-full px-2 py-2 border border-gray-300 rounded-md text-center"/>
            <input type="number" value={usJm} onChange={(e) => setUsJm(e.target.value)} placeholder={t('month', lang)} className="w-full px-2 py-2 border border-gray-300 rounded-md text-center"/>
            <input type="number" value={usJy} onChange={(e) => setUsJy(e.target.value)} placeholder={t('year', lang)} className="w-full px-2 py-2 border border-gray-300 rounded-md text-center"/>
        </div>
    </div>
  );


  const renderUltrasoundForm = () => (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-bold text-gray-800">{t('ultrasoundDatingTab', lang)}</h3>
      
      <div className="my-3">
        {renderScanDateInput()}
      </div>

      <div className="flex items-center space-x-4 rtl:space-x-reverse mb-3">
          <button onClick={() => setUsInputMode('biometry')} className={`px-3 py-1 text-sm font-medium rounded-full ${usInputMode === 'biometry' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{t('biometryEntry', lang)}</button>
          <button onClick={() => setUsInputMode('report')} className={`px-3 py-1 text-sm font-medium rounded-full ${usInputMode === 'report' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{t('reportEntry', lang)}</button>
      </div>

      {usInputMode === 'biometry' ? (
        <>
            <p className="text-sm text-secondary mb-3">{t('usBiometryInstruction', lang)}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <input type="number" value={crl} onChange={(e) => setCrl(e.target.value)} placeholder={t('crlLabel', lang)} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                <input type="number" value={bpd} onChange={(e) => setBpd(e.target.value)} placeholder={t('bpdLabel', lang)} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                <input type="number" value={hc} onChange={(e) => setHc(e.target.value)} placeholder={t('hcLabel', lang)} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                <input type="number" value={ac} onChange={(e) => setAc(e.target.value)} placeholder={t('acLabel', lang)} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                <input type="number" value={fl} onChange={(e) => setFl(e.target.value)} placeholder={t('flLabel', lang)} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
            </div>
        </>
      ) : (
         <>
            <p className="text-sm text-secondary mb-3">{t('usReportInstruction', lang)}</p>
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{t('gaAtScan', lang)}</label>
                 <div className="grid grid-cols-2 gap-2">
                    <input type="number" value={usGaWeeks} onChange={(e) => setUsGaWeeks(e.target.value)} placeholder={t('weeks', lang)} className="w-full px-2 py-2 border border-gray-300 rounded-md text-center"/>
                    <input type="number" value={usGaDays} onChange={(e) => setUsGaDays(e.target.value)} placeholder={t('days', lang)} className="w-full px-2 py-2 border border-gray-300 rounded-md text-center"/>
                </div>
            </div>
         </>
      )}
    </div>
  );

  const renderResult = () => result && (
    <div className="mt-6 border-t pt-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">{t('calculationResults', lang)}</h3>
        {result.lmpEDC && result.usEDC && (
            <div className="p-4 border rounded-lg">
                <h4 className="font-bold text-gray-700 mb-2">{t('usVsLMPComparison', lang)}</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-blue-50 p-2 rounded">
                        <p className="text-xs font-semibold text-blue-800">{t('edcByLMP', lang)}</p>
                        <p className="font-bold text-blue-900">{result.lmpEDC.toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}</p>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                        <p className="text-xs font-semibold text-purple-800">{t('edcByUS', lang)}</p>
                        <p className="font-bold text-purple-900">{result.usEDC.toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}</p>
                    </div>
                </div>
                {result.projectedGAToday !== undefined && (
                    <div className="mt-3 text-center">
                        <p className="text-sm text-gray-600">
                          {t('projectedGAToday', lang)}: <span className="font-bold">{Math.floor(result.projectedGAToday / 7)}w {result.projectedGAToday % 7}d</span>
                        </p>
                    </div>
                )}
            </div>
        )}
        <div className="p-4 bg-primary-50 rounded-lg">
           <p className="text-sm font-medium text-primary-700">{t('finalEDC', lang)}</p>
           <p className="text-2xl font-bold text-primary-900">{result.finalEDC.toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
           <p className="text-sm font-medium text-gray-600">{t('datingMethod', lang)}</p>
           <p className="text-lg font-semibold text-gray-800">{result.datingMethod}</p>
           {result.reconciliationMessage && <p className="text-sm text-gray-700 mt-1">{result.reconciliationMessage}</p>}
        </div>
        <button onClick={handleConfirm} className="w-full bg-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300 text-lg">
          {t('confirmAndStart', lang)}
        </button>
    </div>
  );

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-primary-800 text-center">{t('gaCalculatorTitle', lang)}</h2>
      <p className="text-center text-gray-500 mt-2 mb-6">{t('gaCalculatorSubtitle', lang)}</p>
      
      <div className="mb-6">
        <label htmlFor="patientName" className="block text-sm font-bold text-gray-700 mb-2">{t('patientNamePrompt', lang)}</label>
        <input 
            type="text" 
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderLMPForm()}
        {renderUltrasoundForm()}
      </div>

      {error && <p className="text-red-500 text-sm text-center my-4">{error}</p>}
      
      {!result && (
        <div className="mt-6">
            <button
                onClick={handleCalculate}
                className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse text-lg"
            >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span>{t('calculateButton', lang)}</span>
            </button>
        </div>
      )}

      {result && renderResult()}
    </div>
  );
};