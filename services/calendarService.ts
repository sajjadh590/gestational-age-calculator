import { JalaliDate } from '../types';

// jalaali-js is loaded from CDN, so we declare it globally.
declare const jalaali: {
  toJalaali: (gy: number, gm: number, gd: number) => JalaliDate;
  toGregorian: (jy: number, jm: number, jd: number) => { gy: number; gm: number; gd: number };
  isValidJalaaliDate: (jy: number, jm: number, jd: number) => boolean;
  jalaaliMonthLength: (jy: number, jm: number) => number;
};

const isJalaaliLoaded = () => typeof jalaali !== 'undefined' && jalaali.toJalaali;

// Date Formatting
const GREGORIAN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const JALALI_MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];

export const formatGregorian = (date: Date): string => {
  return `${GREGORIAN_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const formatJalali = (jDate: JalaliDate): string => {
  if (!jDate || typeof jDate.jm !== 'number' || jDate.jm < 1 || jDate.jm > 12) {
      return "Invalid Date";
  }
  return `${jDate.jd} ${JALALI_MONTHS[jDate.jm - 1]} ${jDate.jy}`;
};

export const toJalali = (date: Date): JalaliDate => {
  if (!isJalaaliLoaded() || !date || isNaN(date.getTime())) {
    console.error("Jalaali calendar system not available or invalid date provided.");
    return { jy: 1970, jm: 1, jd: 1 };
  }
  return jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
};

export const fromJalali = (jDate: JalaliDate): Date => {
  if (!isJalaaliLoaded()) {
    console.error("Jalaali calendar system not available.");
    return new Date(0); // Return epoch as a fallback
  }
  const gDate = jalaali.toGregorian(jDate.jy, jDate.jm, jDate.jd);
  return new Date(gDate.gy, gDate.gm - 1, gDate.gd);
};

export const isValidJalali = (jy: number, jm: number, jd: number): boolean => {
    if (isNaN(jy) || isNaN(jm) || isNaN(jd)) return false;
    if (!isJalaaliLoaded()) {
        console.error("Jalaali calendar system not available.");
        return false;
    }
    return jalaali.isValidJalaaliDate(jy, jm, jd);
}

export const getJalaliMonthLength = (jy: number, jm: number): number => {
    if (!isJalaaliLoaded()) {
        // Fallback logic if library not loaded
        if (jm <= 6) return 31;
        if (jm <= 11) return 30;
        return 29; // Approximate for Esfand
    }
    return jalaali.jalaaliMonthLength(jy, jm);
};

// Clinical Date Calculations

/**
 * Adds days to a date using Gregorian calendar logic.
 * Handles month and year rollovers (including leap years) accurately.
 * This performs a true duration addition (timedelta).
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Calculates the absolute difference in days between two dates.
 * Uses UTC normalization to ensure the calculation represents "calendar days",
 * ignoring Daylight Saving Time (DST) shifts or local time anomalies.
 */
export const daysBetween = (date1: Date, date2: Date): number => {
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.floor(Math.abs(utc1 - utc2) / oneDay);
};

/**
 * Calculates the signed difference in days between two dates (date2 - date1).
 * Returns a positive number if date2 is after date1.
 * Uses UTC normalization to strictly calculate calendar duration.
 */
export const diffDays = (date1: Date, date2: Date): number => {
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.floor((utc2 - utc1) / oneDay);
};