import { Pregnancy, PregnancyData, CarePlan, Visit, RedFlag } from '../types';
// FIX: Import `translations` from its source in `i18n.ts` instead of from `types.ts`, where it isn't exported. This resolves type resolution errors.
import { translations } from '../i18n';
import { addDays, daysBetween, toJalali, formatJalali } from './calendarService';
import { CLINICAL_EVENTS, RED_FLAGS_BY_TRIMESTER } from '../constants';

export const getPregnancyData = (pregnancy: Pregnancy): PregnancyData => {
  const today = new Date();
  // The GA is now calculated from the final EDC. 280 days total pregnancy length.
  const gaDays = 280 - daysBetween(today, pregnancy.edc);
  const gaWeeks = Math.floor(gaDays / 7);
  const gaRemainderDays = gaDays % 7;
  
  const updatedPregnancy = {
      ...pregnancy,
      gaDays,
      currentDate: today,
  };

  const trimester = getTrimester(gaWeeks);
  const carePlan = getCarePlan(gaWeeks);
  // The visit schedule should be based on the final EDC, not the raw LMP.
  // We can calculate a "virtual" LMP from the final EDC for this.
  const virtualLMP = addDays(pregnancy.edc, -280);
  const visitSchedule = generateVisitSchedule(virtualLMP);
  const redFlags = getRedFlags(trimester);
  
  const daysPassedFromLMP = pregnancy.lmp ? daysBetween(pregnancy.lmp, today) : undefined;
  
  return {
    pregnancy: updatedPregnancy,
    gaWeeks,
    gaRemainderDays,
    trimester,
    today,
    currentJalaliDate: formatJalali(toJalali(today)),
    edcJalali: formatJalali(toJalali(pregnancy.edc)),
    carePlan,
    visitSchedule,
    redFlags,
    daysPassedFromLMP,
  };
};

const getTrimester = (gaWeeks: number): 1 | 2 | 3 => {
  if (gaWeeks < 14) return 1;
  if (gaWeeks < 28) return 2;
  return 3;
};

const getCarePlan = (gaWeeks: number): CarePlan => {
  const carePlan: CarePlan = {
    upcoming: [],
    completed: [],
    missed: [],
  };

  CLINICAL_EVENTS.forEach(event => {
    if (gaWeeks >= event.startWeek && gaWeeks <= event.endWeek) {
      carePlan.upcoming.push(event);
    } else if (gaWeeks > event.endWeek) {
      carePlan.completed.push(event);
    }
    // Simple missed logic: if it's a critical event and we are past its window
    if (event.isCritical && gaWeeks > event.endWeek + 1) { // 1 week grace period
        // A more complex app would check if it was actually done. We assume not for this logic.
        // Let's refine this to only show recently missed critical items
        if(gaWeeks < event.endWeek + 4) { // show for 4 weeks after due
           // Check if it's not already in completed
           if(!carePlan.completed.find(e => e.name.en === event.name.en)) {
             carePlan.missed.push(event);
           }
        }
    }
  });

  return carePlan;
};

const generateVisitSchedule = (virtualLMP: Date): Visit[] => {
    const schedule: Visit[] = [];
    const standardTasks: (keyof typeof translations)[] = ['taskBP', 'taskWeight', 'taskUA', 'taskFHR', 'taskFH'];
    const lateTasks: (keyof typeof translations)[] = [...standardTasks, 'taskFetalMovement'];
    const finalTasks: (keyof typeof translations)[] = [...lateTasks, 'taskCervicalExam'];
    
    // From 4 to 28 weeks: every 4 weeks
    for (let week = 8; week <= 28; week += 4) {
        schedule.push(createVisit(virtualLMP, week, standardTasks));
    }
    // From 28 to 36 weeks: every 2 weeks
    for (let week = 30; week <= 36; week += 2) {
        schedule.push(createVisit(virtualLMP, week, lateTasks));
    }
    // From 36 weeks to delivery: weekly
    for (let week = 37; week <= 41; week += 1) {
        schedule.push(createVisit(virtualLMP, week, finalTasks));
    }
    return schedule;
};

const createVisit = (lmp: Date, week: number, tasks: (keyof typeof translations)[]): Visit => {
    const visitDate = addDays(lmp, week * 7);
    return {
        week,
        date: visitDate,
        jalaliDate: formatJalali(toJalali(visitDate)),
        tasks
    };
};


const getRedFlags = (trimester: 1 | 2 | 3): RedFlag[] => {
    return RED_FLAGS_BY_TRIMESTER[trimester] || [];
};