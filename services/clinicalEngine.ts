import { Pregnancy, PregnancyData, CarePlan, Visit, RedFlag, VisitTaskKey } from '../types';
import { addDays, diffDays, toJalali, formatJalali } from './calendarService';
import { CLINICAL_EVENTS, RED_FLAGS_BY_TRIMESTER } from '../constants';
import { TERM_PREGNANCY_DAYS } from './datingService';

export const getPregnancyData = (pregnancy: Pregnancy): PregnancyData => {
  const today = new Date();
  
  // Calculate the difference in days between today and the EDC using signed integer math.
  // If Today is BEFORE EDC, daysRemaining is POSITIVE.
  // If Today is AFTER EDC (Overdue), daysRemaining is NEGATIVE.
  const daysRemaining = diffDays(today, pregnancy.edc);

  // Calculate Gestational Age in days.
  // 280 - DaysRemaining.
  const gaDays = TERM_PREGNANCY_DAYS - daysRemaining;
  
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
  const virtualLMP = addDays(pregnancy.edc, -TERM_PREGNANCY_DAYS);
  const visitSchedule = generateVisitSchedule(virtualLMP);
  const redFlags = getRedFlags(trimester);
  
  // Fix: Align daysPassedFromLMP with gaDays. 
  // This ensures that DaysPassed (gaDays) + DaysRemaining (280 - gaDays) always equals 280.
  // This overrides the physical calendar duration (which might be 283 days due to Jalali leap years/month lengths)
  // with the clinical "40 weeks" duration.
  const daysPassedFromLMP = gaDays;
  
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
    const standardTasks: VisitTaskKey[] = ['taskBP', 'taskWeight', 'taskUA', 'taskFHR', 'taskFH'];
    const lateTasks: VisitTaskKey[] = [...standardTasks, 'taskFetalMovement'];
    const finalTasks: VisitTaskKey[] = [...lateTasks, 'taskCervicalExam'];
    
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

const createVisit = (lmp: Date, week: number, tasks: VisitTaskKey[]): Visit => {
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