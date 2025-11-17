
import React from 'react';
import { Language, t } from '../i18n';

interface TimelineProps {
  gaWeeks: number;
  lang: Language;
}

export const Timeline: React.FC<TimelineProps> = ({ gaWeeks, lang }) => {
  const totalWeeks = 42;
  const progressPercentage = Math.min((gaWeeks / totalWeeks) * 100, 100);
  
  const getMilestoneClass = (week: number) => {
    return gaWeeks >= week ? 'bg-primary-500' : 'bg-gray-300';
  };

  const milestone = (week: number, nameKey: 'ntScan' | 'anatomyScan' | 'gdmScreen' | 'gbsScreen' | 'dueDate') => (
      <div className="w-1/5 text-center">
          <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${getMilestoneClass(week)}`}></div>
          <div className="text-xs text-gray-600 leading-tight">{t(nameKey, lang)}</div>
      </div>
  );
  
  const markerStyle: React.CSSProperties = {
    [lang === 'fa' ? 'right' : 'left']: `calc(${progressPercentage}% - 28px)`,
  };

  const trimester1DividerStyle: React.CSSProperties = {
    [lang === 'fa' ? 'right' : 'left']: '33.33%',
  };
  const trimester2DividerStyle: React.CSSProperties = {
    [lang === 'fa' ? 'right' : 'left']: '66.66%',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold text-primary-800 mb-4">{t('timelineTitle', lang)}</h3>
      <div className="relative pt-8">
        {/* Progress Bar Container */}
        <div className="relative h-2 bg-gray-200 rounded-full">
          {/* Progress Fill */}
          <div 
            className={`absolute top-0 h-2 bg-primary-500 rounded-full transition-all duration-500 ${lang === 'fa' ? 'right-0' : 'left-0'}`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
          
          {/* Trimester Dividers */}
          <div className="absolute h-4 w-0.5 bg-gray-400 -top-1" style={trimester1DividerStyle}></div>
          <div className="absolute h-4 w-0.5 bg-gray-400 -top-1" style={trimester2DividerStyle}></div>

          {/* Current Week Marker */}
          <div 
            className="absolute top-1/2 -mt-5 transition-all duration-500" 
            style={markerStyle}
          >
            <div className="relative flex flex-col items-center w-14">
                <span className="text-xs font-bold bg-primary-500 text-white py-1 px-2 rounded-md shadow-md whitespace-nowrap">
                    {t('week', lang)} {gaWeeks}
                </span>
                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-primary-500"></div>
            </div>
          </div>
        </div>

        {/* Trimester Labels */}
        <div className="flex text-xs text-gray-500 mt-4 font-semibold">
          <div className="w-1/3 text-center">{t('trimester1', lang)}</div>
          <div className="w-1/3 text-center">{t('trimester2', lang)}</div>
          <div className="w-1/3 text-center">{t('trimester3', lang)}</div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
            <span>{t('start', lang)}</span>
            <span>{totalWeeks}{t('w', lang)}</span>
        </div>
        
         {/* Key Events */}
        <div className="flex justify-between mt-6">
            {milestone(12, 'ntScan')}
            {milestone(20, 'anatomyScan')}
            {milestone(26, 'gdmScreen')}
            {milestone(36, 'gbsScreen')}
            {milestone(40, 'dueDate')}
        </div>
      </div>
    </div>
  );
};