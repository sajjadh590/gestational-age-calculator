
export interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
}

export interface UltrasoundData {
    crl?: number; // mm
    bpd?: number; // mm
    hc?: number;  // mm
    ac?: number;  // mm
    fl?: number;  // mm
    scanDate: Date;
    gaOnScanDateDays?: number; // GA in days as reported on the scan date
}

// For Charting
export interface Vital {
  date: string; // ISO string for simplicity
  weight?: number; // in kg
  bpSystolic?: number;
  bpDiastolic?: number;
}

export interface FetalBiometryEntry {
  date: string; // ISO string
  gaWeeks: number; // GA at time of scan
  bpd?: number; // mm
  hc?: number;  // mm
  ac?: number;  // mm
  fl?: number;  // mm
}

export interface Pregnancy {
  id: string;
  name: string;
  lmp?: Date;
  ultrasound?: UltrasoundData;
  gaDays: number;
  edc: Date;
  datingMethod: string;
  reconciliationMessage?: string;
  currentDate: Date;
  vitals: Vital[];
  fetalBiometry: FetalBiometryEntry[];
}

export interface PregnancyData {
  pregnancy: Pregnancy;
  gaWeeks: number;
  gaRemainderDays: number;
  trimester: 1 | 2 | 3;
  today: Date;
  currentJalaliDate: string;
  edcJalali: string;
  carePlan: CarePlan;
  visitSchedule: Visit[];
  redFlags: RedFlag[];
  daysPassedFromLMP?: number;
}

export enum EventCategory {
  Test = "Lab Test",
  Ultrasound = "Ultrasound",
  Screening = "Screening",
  Medication = "Medication/Supplement",
  Counseling = "Counseling & Education",
  Milestone = "Key Milestone",
  Warning = "Red Flag"
}

export type BilingualString = {
  fa: string;
  en: string;
};

export interface ClinicalEvent {
  name: BilingualString;
  description: BilingualString;
  category: EventCategory;
  startWeek: number;
  endWeek: number;
  isCritical?: boolean;
}

export interface CarePlan {
  upcoming: ClinicalEvent[];
  completed: ClinicalEvent[];
  missed: ClinicalEvent[];
}

export type VisitTaskKey =
  | 'taskBP'
  | 'taskWeight'
  | 'taskUA'
  | 'taskFHR'
  | 'taskFH'
  | 'taskFetalMovement'
  | 'taskCervicalExam';

export interface Visit {
  week: number;
  date: Date;
  jalaliDate: string;
  tasks: VisitTaskKey[];
}

export interface RedFlag {
    title: BilingualString;
    details: BilingualString;
    symptoms: BilingualString[];
}