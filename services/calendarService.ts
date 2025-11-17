import { JalaliDate } from '../types';

// jalaali-js is loaded from CDN, so we declare it globally.
declare const jalaali: {
  toJalaali: (gy: number, gm: number, gd: number) => JalaliDate;
  toGregorian: (jy: number, jm: number, jd: number) => { gy: number; gm: number; gd: number };
  isValidJalaaliDate: (jy: number, jm: number, jd: number) => boolean;
};

// Date Formatting
const GREGORIAN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const JALALI_MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];

export const formatGregorian = (date: Date): string => {
  return `${GREGORIAN_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const formatJalali = (jDate: JalaliDate): string => {
  return `${jDate.jd} ${JALALI_MONTHS[jDate.jm - 1]} ${jDate.jy}`;
};

export const toJalali = (date: Date): JalaliDate => {
  // FIX: Corrected typo in function call from 'toJalali' to 'toJalaali' to match the type definition.
  return jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
};

export const fromJalali = (jDate: JalaliDate): Date => {
  const gDate = jalaali.toGregorian(jDate.jy, jDate.jm, jDate.jd);
  return new Date(gDate.gy, gDate.gm - 1, gDate.gd);
};

export const isValidJalali = (jy: number, jm: number, jd: number): boolean => {
    if (isNaN(jy) || isNaN(jm) || isNaN(jd)) return false;
    return jalaali.isValidJalaaliDate(jy, jm, jd);
}

// Clinical Date Calculations
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const daysBetween = (date1: Date, date2: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000;
    // Use Math.floor to avoid rounding issues with DST
    const time1 = date1.getTime();
    const time2 = date2.getTime();
    return Math.floor(Math.abs(time1 - time2) / oneDay);
};