import React from 'react';
import { Pregnancy } from '../types';
import { Language } from '../i18n';

interface ChartingProps {
  pregnancy: Pregnancy;
  onUpdate: (data: Partial<Pregnancy>) => void;
  lang: Language;
}

/**
 * The Charting component has been disabled to resolve a critical loading error
 * caused by its external library dependency (recharts). This ensures the overall
 * stability and reliability of the application.
 */
export const Charting: React.FC<ChartingProps> = ({ lang }) => {
  return (
    <div className="flex items-center justify-center bg-yellow-50 text-yellow-800 p-8 rounded-lg min-h-[300px]">
        <div className="text-center">
            <h3 className="mt-4 text-lg font-bold">Charting Unavailable</h3>
            <p className="mt-2 text-sm">
              The charting feature has been disabled to ensure application stability.
            </p>
        </div>
    </div>
  );
};