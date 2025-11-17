import React from 'react';
import { CarePlan as CarePlanType, ClinicalEvent, EventCategory } from '../types';
import { Language, t } from '../i18n';

interface CarePlanProps {
  carePlan: CarePlanType;
  gaWeeks: number;
  lang: Language;
}

const getCategoryStyle = (category: EventCategory) => {
  switch (category) {
    case EventCategory.Test: return { icon: '🔬', color: 'bg-blue-100 text-blue-800' };
    case EventCategory.Ultrasound: return { icon: '🖥️', color: 'bg-indigo-100 text-indigo-800' };
    case EventCategory.Screening: return { icon: '🧪', color: 'bg-purple-100 text-purple-800' };
    case EventCategory.Medication: return { icon: '💊', color: 'bg-green-100 text-green-800' };
    case EventCategory.Counseling: return { icon: '💬', color: 'bg-yellow-100 text-yellow-800' };
    case EventCategory.Milestone: return { icon: '⭐', color: 'bg-pink-100 text-pink-800' };
    default: return { icon: '📄', color: 'bg-gray-100 text-gray-800' };
  }
};

const EventItem: React.FC<{ event: ClinicalEvent, lang: Language }> = ({ event, lang }) => {
    const style = getCategoryStyle(event.category);
    return (
        <li className="flex items-start space-x-4 rtl:space-x-reverse p-4 bg-gray-50 rounded-lg">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${style.color}`}>
                {style.icon}
            </div>
            <div>
                <h4 className="font-bold text-gray-800">{event.name[lang]}</h4>
                <p className="text-sm text-gray-600">{event.description[lang]}</p>
                <div className="text-xs font-semibold mt-1">
                    <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                        {t('dueWeeksLabel', lang)} {event.startWeek} - {event.endWeek}
                    </span>
                </div>
            </div>
        </li>
    );
};


export const CarePlan: React.FC<CarePlanProps> = ({ carePlan, gaWeeks, lang }) => {
  return (
    <div className="space-y-8">
      {carePlan.missed.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-danger mb-3 flex items-center space-x-2 rtl:space-x-reverse">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{t('missedItemsTitle', lang)}</span>
          </h3>
          <ul className="space-y-3">
            {carePlan.missed.map((event, index) => <EventItem key={`missed-${index}`} event={event} lang={lang} />)}
          </ul>
        </div>
      )}
      
      <div>
        <h3 className="text-xl font-bold text-primary-800 mb-3">{t('upcomingTasksTitle', lang)}</h3>
        {carePlan.upcoming.length > 0 ? (
            <ul className="space-y-3">
                {carePlan.upcoming.map((event, index) => <EventItem key={`upcoming-${index}`} event={event} lang={lang} />)}
            </ul>
        ) : (
            <p className="text-gray-500 p-4 bg-gray-50 rounded-lg text-center">{t('noUpcomingTasks', lang)}</p>
        )}
      </div>

      {carePlan.completed.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-500 mb-3">{t('completedMilestonesTitle', lang)}</h3>
          <ul className="space-y-3 opacity-70">
            {carePlan.completed.slice(-5).reverse().map((event, index) => <EventItem key={`completed-${index}`} event={event} lang={lang} />)}
          </ul>
        </div>
      )}
    </div>
  );
};