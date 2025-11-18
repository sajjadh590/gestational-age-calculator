
export const translations = {
  // General
  appName: {
    fa: "دستیار مامایی و زنان",
    en: "Obstetrics & Midwifery Assistant",
  },
  newCase: {
    fa: "پرونده جدید",
    en: "New Case",
  },
  saveCase: { fa: "ذخیره پرونده", en: "Save Case" },
  save: { fa: "ذخیره", en: "Save" },
  manageCases: { fa: "مدیریت پرونده‌ها", en: "Manage Cases" },
  cases: { fa: "پرونده‌ها", en: "Cases" },
  patientManagerTitle: { fa: "لیست پرونده‌های ذخیره شده", en: "Saved Case List" },
  loadCase: { fa: "مشاهده", en: "View" },
  deleteCase: { fa: "حذف", en: "Delete" },
  noSavedCases: { fa: "هیچ پرونده ذخیره شده‌ای وجود ندارد.", en: "No saved cases found." },
  enterPatientName: { fa: "لطفا نام یا شناسه بیمار را وارد کنید:", en: "Please enter a patient name or identifier:" },
  caseSaved: { fa: "با موفقیت ذخیره شد.", en: "saved successfully." },
  confirmDeleteCase: { fa: "آیا از حذف این پرونده مطمئن هستید؟ این عمل غیرقابل بازگشت است.", en: "Are you sure you want to delete this case? This action cannot be undone." },
  untitledCase: { fa: "پرونده بدون نام", en: "Untitled Case" },
  addPatient: { fa: "افزودن بیمار جدید", en: "Add New Patient" },
  patientNamePrompt: { fa: "نام یا شناسه بیمار", en: "Patient Name / ID" },
  backToPatientList: { fa: "لیست بیماران", en: "Patient List" },
  cancel: { fa: "انصراف", en: "Cancel" },
  welcomeMessage: { fa: "به دستیار مامایی و زنان خوش آمدید!", en: "Welcome to the Obstetrics & Midwifery Assistant!" },
  welcomeCTA: { fa: "برای شروع، اولین بیمار خود را اضافه کنید.", en: "Add your first patient to get started." },


  // GACalculator
  gaCalculatorTitle: {
    fa: "محاسبه و تعیین سن بارداری",
    en: "Pregnancy Dating & Reconciliation",
  },
  gaCalculatorSubtitle: {
      fa: "اطلاعات بیمار، LMP و/یا سونوگرافی را برای محاسبه دقیق سن بارداری وارد کنید.",
      en: "Enter patient info, LMP, and/or Ultrasound data for accurate GA calculation."
  },
  lmpDatingTab: {
    fa: "اطلاعات LMP",
    en: "LMP Data",
  },
  ultrasoundDatingTab: {
    fa: "اطلاعات سونوگرافی",
    en: "Ultrasound Data",
  },
  lmpInstruction: {
    fa: "اولین روز آخرین قاعدگی (LMP) را به شمسی وارد کنید.",
    en: "Enter the First Day of the Last Menstrual Period (LMP) in Jalali.",
  },
  day: { fa: "روز", en: "Day" },
  month: { fa: "ماه", en: "Month" },
  year: { fa: "سال", en: "Year" },
  weeks: { fa: "هفته", en: "Weeks" },
  days: { fa: "روز", en: "Days" },
  crlLabel: { fa: "CRL (mm)", en: "CRL (mm)" },
  bpdLabel: { fa: "BPD (mm)", en: "BPD (mm)" },
  hcLabel: { fa: "HC (mm)", en: "HC (mm)" },
  acLabel: { fa: "AC (mm)", en: "AC (mm)" },
  flLabel: { fa: "FL (mm)", en: "FL (mm)" },
  usBiometryInstruction: {
    fa: "برای محاسبه سن، اندازه‌گیری‌های بیومتری را وارد کنید.",
    en: "Enter biometry measurements to calculate GA.",
  },
  usReportInstruction: {
      fa: "سن بارداری گزارش شده در سونوگرافی قبلی را وارد کنید.",
      en: "Enter the GA from a previous ultrasound report.",
  },
  biometryEntry: { fa: "ورود اندازه‌ها", en: "Biometry Entry" },
  reportEntry: { fa: "ورود گزارش", en: "Report Entry" },
  scanDate: { fa: "تاریخ سونوگرافی", en: "Date of Scan" },
  gaAtScan: { fa: "سن بارداری در زمان سونوگرافی", en: "GA at time of scan" },
  calculateButton: {
    fa: "محاسبه و تطبیق",
    en: "Calculate & Reconcile",
  },
  invalidDateError: {
    fa: "تاریخ شمسی وارد شده معتبر نیست. لطفا مقادیر را بررسی کنید.",
    en: "The entered Jalali date is not valid. Please check the values.",
  },
  invalidGAError: {
      fa: "مقادیر هفته و روز سن بارداری معتبر نیست.",
      en: "The GA weeks and days values are not valid."
  },
  noInputError: {
    fa: "لطفا حداقل اطلاعات LMP یا سونوگرافی را وارد کنید.",
    en: "Please enter at least LMP or Ultrasound data.",
  },
  calculationError: {
      fa: "خطا در محاسبه. لطفا ورودی‌ها را بررسی کنید.",
      en: "Calculation error. Please check your inputs."
  },
  ultrasoundDateMissing: { 
    fa: "لطفا تاریخ سونوگرافی را برای مقادیر بیومتری وارد کنید.", 
    en: "Please enter the scan date for the biometry values." 
  },
  // Results Display
  calculationResults: {
    fa: "نتایج محاسبه",
    en: "Calculation Results",
  },
  datingMethod: {
    fa: "روش نهایی تعیین سن",
    en: "Final Dating Method",
  },
  lmpBased: { fa: "بر اساس LMP", en: "LMP Based" },
  ultrasoundBased: { fa: "بر اساس سونوگرافی", en: "Ultrasound Based" },
  reconciliationNote: {
    fa: "توضیحات تطبیق",
    en: "Reconciliation Note",
  },
  finalEDC: { fa: "تاریخ تخمینی زایمان (EDC)", en: "Final Estimated Due Date (EDC)"},
  confirmAndStart: { fa: "ایجاد پرونده و شروع پایش", en: "Create Case & Start Monitoring" },
  usVsLMPComparison: { fa: "مقایسه LMP با سونوگرافی", en: "LMP vs. Ultrasound Comparison" },
  edcByLMP: { fa: "EDC بر اساس LMP", en: "EDC from LMP" },
  edcByUS: { fa: "EDC بر اساس سونوگرافی", en: "EDC from Ultrasound" },
  projectedGAToday: { fa: "سن تخمینی امروز (بر اساس سونو)", en: "Projected GA Today (from US)" },
  
  // Dating Reconciliation Messages (ACOG)
  reconcile_t1_early: {
    fa: "مغایرت >۵ روز در سه ماهه اول (<9هفته). EDC سونوگرافی طبق ACOG معتبرتر است.",
    en: "Discrepancy >5 days in early first trimester (<9w). Ultrasound EDC is more reliable per ACOG.",
  },
  reconcile_t1_late: {
    fa: "مغایرت >۷ روز در سه ماهه اول (9-13هفته و ۶ روز). EDC سونوگرافی طبق ACOG معتبرتر است.",
    en: "Discrepancy >7 days in late first trimester (9w-13w6d). Ultrasound EDC is more reliable per ACOG.",
  },
  reconcile_t2_early: {
    fa: "مغایرت >۷ روز در اوایل سه ماهه دوم (14-15هفته و ۶ روز). EDC سونوگرافی طبق ACOG معتبرتر است.",
    en: "Discrepancy >7 days in early second trimester (14w-15w6d). Ultrasound EDC is more reliable per ACOG.",
  },
  reconcile_t2_mid: {
    fa: "مغایرت >۱۰ روز در اواسط سه ماهه دوم (16-21هفته و ۶ روز). EDC سونوگرافی طبق ACOG معتبرتر است.",
    en: "Discrepancy >10 days in mid second trimester (16w-21w6d). Ultrasound EDC is more reliable per ACOG.",
  },
  reconcile_t2_late: {
    fa: "مغایرت >۱۴ روز در اواخر سه ماهه دوم (22-27هفته و ۶ روز). EDC سonoگرافی طبق ACOG معتبرتر است.",
    en: "Discrepancy >14 days in late second trimester (22w-27w6d). Ultrasound EDC is more reliable per ACOG.",
  },
  reconcile_t3: {
    fa: "مغایرت >۲۱ روز در سه ماهه سوم (>=28هفته). EDC سonoگرافی طبق ACOG معتبرتر است.",
    en: "Discrepancy >21 days in third trimester (>=28w). Ultrasound EDC is more reliable per ACOG.",
  },
  reconcile_useLMP: {
    fa: "مغایرت در محدوده قابل قبول طبق ACOG است. تعیین سن بر اساس LMP انجام می‌شود.",
    en: "Discrepancy is within acceptable limits based on ACOG guidelines. Dating is based on LMP.",
  },

  // Dashboard
  patientName: { fa: "نام بیمار:", en: "Patient Name:" },
  ga: { fa: "سن بارداری", en: "Gestational Age" },
  trimester: { fa: "سه ماهه", en: "Trimester" },
  edc: { fa: "تاریخ تخمینی زایمان", en: "Estimated Delivery Date" },
  daysRemaining: { fa: "روزهای باقیمانده", en: "Days Remaining" },
  until40w: { fa: "تا ۴۰ هفتگی", en: "until 40 weeks" },
  todaysDate: { fa: "تاریخ امروز", en: "Today's Date" },
  progress: { fa: "وضعیت پیشرفت", en: "Progress" },
  daysPassed: { fa: "روزهای گذشته", en: "Days Passed" },
  sinceLMP: { fa: "از LMP", en: "since LMP" },
  carePlan: { fa: "برنامه مراقبتی", en: "Care Plan" },
  visitPlanner: { fa: "برنامه ویزیت‌ها", en: "Visit Planner" },
  redFlags: { fa: "علائم خطر", en: "Red Flags" },
  visitScheduleTitle: { fa: "برنامه ویزیت‌های پیش از زایمان", en: "Prenatal Visit Schedule" },
  upcomingVisits: { fa: "ویزیت‌های آتی", en: "Upcoming Visits" },
  pastVisits: { fa: "ویزیت‌های گذشته", en: "Past Visits" },
  redFlagsTitle: { fa: "علائم خطر مهم در این مرحله", en: "Important Red Flags for this Stage" },
  keySymptoms: { fa: "علائم کلیدی:", en: "Key Symptoms:" },

  // Visit Planner Tasks
  taskBP: { fa: "فشار خون", en: "BP" },
  taskWeight: { fa: "وزن", en: "Weight" },
  taskUA: { fa: "آنالیز ادرار", en: "UA" },
  taskFHR: { fa: "صدای قلب جنین", en: "FHR" },
  taskFH: { fa: "ارتفاع رحم", en: "FH" },
  taskFetalMovement: { fa: "بررسی حرکات جنین", en: "Fetal Movement" },
  taskCervicalExam: { fa: "معاینه سرویکس (در صورت لزوم)", en: "Cervical Exam (if indicated)" },

  // CarePlan
  missedItemsTitle: { fa: "موارد حیاتی بالقوه فراموش شده", en: "Potentially Missed Critical Items" },
  upcomingTasksTitle: { fa: "وظایف و رویدادهای پیش رو", en: "Upcoming Tasks & Milestones" },
  noUpcomingTasks: { fa: "در بازه‌های زمانی تعریف شده، وظیفه فوری وجود ندارد. لطفاً به برنامه ویزیت‌ها مراجعه کنید.", en: "No immediate upcoming tasks within the defined windows. Please refer to the visit planner." },
  completedMilestonesTitle: { fa: "رویدادهای تکمیل شده", en: "Completed Milestones" },
  dueWeeksLabel: { fa: "موعد: هفته‌های", en: "Due: Weeks" },

  // Timeline
  timelineTitle: { fa: "خط زمانی بارداری", en: "Pregnancy Timeline" },
  week: { fa: "هفته", en: "Week" },
  w: { fa: "هفته", en: "w" },
  start: { fa: "شروع", en: "Start" },
  trimester1: { fa: "سه ماهه اول", en: "Trimester 1" },
  trimester2: { fa: "سه ماهه دوم", en: "Trimester 2" },
  trimester3: { fa: "سه ماهه سوم", en: "Trimester 3" },
  ntScan: { fa: "غربالگری NT\n(۱۱-۱۳هفته)", en: "NT Scan\n(11-13w)" },
  anatomyScan: { fa: "سونوگرافی آنومالی\n(۱۸-۲۲هفته)", en: "Anatomy Scan\n(18-22w)" },
  gdmScreen: { fa: "غربالگری دیابت\n(۲۴-۲۸هفته)", en: "GDM Screen\n(24-28w)" },
  gbsScreen: { fa: "غربالگری GBS\n(۳۶-۳۷هفته)", en: "GBS Screen\n(36-37w)" },
  dueDate: { fa: "موعد زایمان\n(۴۰هفته)", en: "Due Date\n(40w)" },
};

export type Language = 'fa' | 'en';

export const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key]?.[lang] || translations[key]?.['en'] || key;
};
