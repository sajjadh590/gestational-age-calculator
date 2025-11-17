import React, { useState } from 'react';
// FIX: Removed unused import of `translations` which was causing an error.
import { PregnancyData, Visit, RedFlag } from '../types';
import { formatGregorian } from '../services/calendarService';
import { Timeline } from './Timeline';
import { CarePlan } from './CarePlan';
import { Language, t } from '../i18n';

type View = 'timeline' | 'visits' | 'redflags';

export const Dashboard: React.FC<{ pregnancyData: PregnancyData; lang: Language }> = ({ pregnancyData, lang }) => {
  const [activeView, setActiveView] = useState<View>('timeline');
  const { gaWeeks, redFlags, visitSchedule } = pregnancyData;

  const renderView = () => {
    switch (activeView) {
      case 'timeline':
        return <CarePlan carePlan={pregnancyData.carePlan} gaWeeks={gaWeeks} lang={lang} />;
      case 'visits':
        return <VisitPlanner schedule={visitSchedule} gaWeeks={gaWeeks} lang={lang} />;
      case 'redflags':
        return <RedFlags flags={redFlags} lang={lang} />;
      default:
        return <CarePlan carePlan={pregnancyData.carePlan} gaWeeks={gaWeeks} lang={lang} />;
    }
  };
  
  return (
    <div className="space-y-8">
      <SummaryCard 
        data={pregnancyData}
        lang={lang}
      />
      
      <Timeline gaWeeks={gaWeeks} lang={lang} />

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-2 sm:space-x-8 rtl:space-x-reverse" aria-label="Tabs">
            <TabButton title={t('carePlan', lang)} view="timeline" activeView={activeView} onClick={setActiveView} />
            <TabButton title={t('visitPlanner', lang)} view="visits" activeView={activeView} onClick={setActiveView} />
            <TabButton title={t('redFlags', lang)} view="redflags" activeView={activeView} onClick={setActiveView} count={redFlags.length} />
          </nav>
        </div>
        
        <div className="min-h-[300px]">
          {renderView()}
        </div>
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{data: PregnancyData, lang: Language}> = ({ data, lang }) => {
  const { gaWeeks, gaRemainderDays, trimester, edcJalali, today, currentJalaliDate, daysPassedFromLMP, pregnancy } = data;
  const daysRemaining = 280 - (gaWeeks * 7 + gaRemainderDays);
  const edcGregorian = formatGregorian(pregnancy.edc);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {/* GA Card */}
        <div className="p-4 bg-primary-50 rounded-lg">
          <h3 className="text-sm font-semibold text-primary-700 uppercase">{t('ga', lang)}</h3>
          <p className="text-4xl font-bold text-primary-900 mt-1">{gaWeeks}<span className="text-2xl font-medium text-gray-500">w</span> {gaRemainderDays}<span className="text-2xl font-medium text-gray-500">d</span></p>
          <p className="text-xs text-gray-500 mt-1">{t('trimester', lang)} {trimester}</p>
        </div>
        {/* EDC Card */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-sm font-semibold text-green-700 uppercase">{t('edc', lang)}</h3>
          <p className="text-xl md:text-2xl font-bold text-green-900 mt-2">{edcJalali}</p>
          <p className="text-md md:text-lg text-green-800 mt-1">{edcGregorian}</p>
        </div>
        {/* Today's Date Card */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-700 uppercase">{t('todaysDate', lang)}</h3>
          <p className="text-xl md:text-2xl font-bold text-blue-900 mt-2">{currentJalaliDate}</p>
          <p className="text-md md:text-lg text-blue-800 mt-1">{formatGregorian(today)}</p>
        </div>
        {/* Progress Card */}
        <div className="p-4 bg-yellow-50 rounded-lg flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-yellow-700 uppercase">{t('progress', lang)}</h3>
          <div className="flex-grow flex flex-col justify-center">
            {daysPassedFromLMP !== undefined ? (
              <>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-2xl font-bold text-yellow-900">{daysPassedFromLMP}</p>
                  <p className="text-xs text-gray-500 -mt-1">{t('daysPassed', lang)}</p>
                </div>
                <hr className="border-t border-yellow-200 my-1"/>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-2xl font-bold text-yellow-900">{daysRemaining}</p>
                  <p className="text-xs text-gray-500 -mt-1">{t('daysRemaining', lang)}</p>
                </div>
              </>
            ) : (
              <div className="mt-1">
                <p className="text-4xl font-bold text-yellow-900">{daysRemaining}</p>
                <p className="text-xs text-gray-500 mt-1">{t('daysRemaining', lang)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const TabButton: React.FC<{title: string, view: View, activeView: View, onClick: (v: View) => void, count?: number}> = ({title, view, activeView, onClick, count}) => {
  const isActive = activeView === view;
  const activeClasses = 'border-primary-500 text-primary-600';
  const inactiveClasses = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  const countBg = view === 'redflags' ? 'bg-danger text-white' : 'bg-primary-100 text-primary-600';

  return (
    <button
      onClick={() => onClick(view)}
      className={`${isActive ? activeClasses : inactiveClasses} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 rtl:space-x-reverse`}
    >
      <span>{title}</span>
      {count !== undefined && <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${countBg}`}>{count}</span>}
    </button>
  );
};


const VisitPlanner: React.FC<{ schedule: Visit[], gaWeeks: number, lang: Language }> = ({ schedule, gaWeeks, lang }) => {
    const upcomingVisits = schedule.filter(v => v.week >= gaWeeks);
    const pastVisits = schedule.filter(v => v.week < gaWeeks);

    const taskSeparator = lang === 'fa' ? '، ' : ', ';

    return (
        <div>
            <h3 className="text-xl font-bold text-primary-800 mb-4">{t('visitScheduleTitle', lang)}</h3>
            <div className="space-y-6">
                <div>
                    <h4 className="font-semibold text-lg text-gray-700 mb-2">{t('upcomingVisits', lang)}</h4>
                    <ul className="space-y-3">
                        {upcomingVisits.slice(0, 5).map((visit, index) => (
                            <li key={index} className="p-3 bg-primary-50 rounded-lg flex items-start space-x-4 rtl:space-x-reverse">
                               <div className="font-bold text-primary-600 text-lg w-16 text-center">{visit.week} wks</div>
                               <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{visit.jalaliDate} <span className="text-sm text-gray-500">({formatGregorian(visit.date)})</span></p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {visit.tasks.map(taskKey => t(taskKey, lang)).join(taskSeparator)}
                                    </p>
                               </div>
                            </li>
                        ))}
                    </ul>
                </div>
                 {pastVisits.length > 0 && (
                     <div>
                        <h4 className="font-semibold text-lg text-gray-500 mb-2">{t('pastVisits', lang)}</h4>
                        <ul className="space-y-2">
                             {pastVisits.slice(-3).reverse().map((visit, index) => (
                                <li key={index} className="p-2 bg-gray-50 rounded-lg flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                                   <div className="font-semibold w-16 text-center">{visit.week} wks</div>
                                   <div>{visit.jalaliDate}</div>
                                </li>
                             ))}
                         </ul>
                     </div>
                 )}
            </div>
        </div>
    );
};

const RedFlags: React.FC<{ flags: RedFlag[], lang: Language }> = ({ flags, lang }) => (
    <div>
        <h3 className="text-xl font-bold text-danger mb-4 flex items-center space-x-2 rtl:space-x-reverse">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>{t('redFlagsTitle', lang)}</span>
        </h3>
        <div className="space-y-4">
            {flags.map((flag, index) => (
                <div key={index} className="p-4 border-r-4 rtl:border-r-0 rtl:border-l-4 border-danger bg-red-50 rounded-l-lg rtl:rounded-l-none rtl:rounded-r-lg">
                    <h4 className="font-bold text-red-800">{flag.title[lang]}</h4>
                    <p className="text-sm text-red-700 mt-1">{flag.details[lang]}</p>
                    <p className="text-sm text-red-700 mt-2">
                        <span className="font-semibold">{t('keySymptoms', lang)}</span> {flag.symptoms.map(s => s[lang]).join(', ')}
                    </p>
                </div>
            ))}
        </div>
    </div>
);