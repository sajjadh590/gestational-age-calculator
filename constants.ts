
import { ClinicalEvent, EventCategory, RedFlag } from './types';

export const CLINICAL_EVENTS: ClinicalEvent[] = [
  // First Trimester
  { 
    name: { fa: "اولین ویزیت بارداری", en: "First Prenatal Visit" },
    description: { fa: "ویزیت جامع اولیه شامل تاریخچه پزشکی، معاینه فیزیکی و آزمایشات اولیه.", en: "Initial comprehensive visit including history, physical exam, and initial lab work." },
    category: EventCategory.Milestone, startWeek: 6, endWeek: 10 
  },
  { 
    name: { fa: "مصرف مکمل اسید فولیک", en: "Folic Acid Supplementation" },
    description: { fa: "حیاتی برای جلوگیری از نقص لوله عصبی. روزانه ۴۰۰-۸۰۰ میکروگرم.", en: "Crucial for preventing neural tube defects. 400-800 mcg daily." },
    category: EventCategory.Medication, startWeek: 0, endWeek: 13 
  },
  { 
    name: { fa: "سونوگرافی تعیین سن", en: "Dating Ultrasound" },
    description: { fa: "تایید بارداری، تعیین سن (معمولاً با CRL) و بررسی چندقلویی.", en: "Confirms pregnancy, dates the pregnancy (usually via CRL), and checks for multiples." },
    category: EventCategory.Ultrasound, startWeek: 7, endWeek: 11 
  },
  { 
    name: { fa: "آزمایشات خون اولیه", en: "Initial Blood Work" },
    description: { fa: "پنل جامع شامل: گروه خونی و Rh، غربالگری آنتی‌بادی، CBC (برای کم‌خونی)، ایمنی سرخجه، سیفلیس (RPR/VDRL)، HIV و هپاتیت B (HBsAg). برای ریسک دیابت، FBS یا HbA1c در نظر گرفته شود.", en: "Comprehensive panel including: Blood type & Rh factor, Antibody screen, CBC (for anemia), Rubella immunity, Syphilis (RPR/VDRL), HIV, and Hepatitis B (HBsAg). Consider FBS or HbA1c for GDM risk." },
    category: EventCategory.Test, startWeek: 8, endWeek: 12 
  },
  {
    name: { fa: "آزمایشات اولیه ادرار", en: "Initial Urine Tests" },
    description: { fa: "کشت ادرار برای غربالگری باکتریوری بدون علامت و آنالیز ادرار برای پروتئین و گلوکز.", en: "Urine culture to screen for asymptomatic bacteriuria and a urinalysis for protein and glucose." },
    category: EventCategory.Test, startWeek: 8, endWeek: 12
  },
  { 
    name: { fa: "سونوگرافی NT", en: "Nuchal Translucency (NT) Scan" },
    description: { fa: "سونوگرافی برای غربالگری ناهنجاری‌های کروموزومی مانند سندرم داون.", en: "Ultrasound to screen for chromosomal abnormalities like Down syndrome." },
    category: EventCategory.Screening, startWeek: 11, endWeek: 13, isCritical: true 
  },
  { 
    name: { fa: "غربالگری سه ماهه اول", en: "First Trimester Screen" },
    description: { fa: "ترکیب سونوگرافی NT با آزمایش خون (hCG, PAPP-A) برای ریسک آنیوپلوئیدی.", en: "Combines NT scan with blood tests (hCG, PAPP-A) for aneuploidy risk." },
    category: EventCategory.Screening, startWeek: 11, endWeek: 13 
  },
  
  // Second Trimester
  { 
    name: { fa: "غربالگری کوآد مارکر", en: "Quad Screen" },
    description: { fa: "آزمایش خون برای غربالگری سندرم داون، تریزومی ۱۸ و نقص لوله عصبی در صورت انجام نشدن غربالگری اول.", en: "Blood test to screen for Down syndrome, trisomy 18, and neural tube defects if first trimester screen was missed." },
    category: EventCategory.Screening, startWeek: 15, endWeek: 22 
  },
  { 
    name: { fa: "سونوگرافی آنومالی", en: "Anatomy Ultrasound" },
    description: { fa: "اسکن دقیق برای ارزیابی آناتومی جنین، جفت و مایع آمنیوتیک.", en: "Detailed scan to assess fetal anatomy, placenta, and amniotic fluid." },
    category: EventCategory.Ultrasound, startWeek: 18, endWeek: 22, isCritical: true 
  },
  { 
    name: { fa: "تست چالش گلوکز (OGTT)", en: "Glucose Challenge Test (OGTT)" },
    description: { fa: "تست غربالگری دیابت بارداری (GDM).", en: "Screening test for gestational diabetes mellitus (GDM)." },
    category: EventCategory.Screening, startWeek: 24, endWeek: 28, isCritical: true 
  },
  { 
    name: { fa: "مکمل آهن", en: "Iron Supplementation" },
    description: { fa: "اغلب برای پیشگیری یا درمان کم‌خونی توصیه می‌شود.", en: "Often recommended to prevent or treat anemia." },
    category: EventCategory.Medication, startWeek: 20, endWeek: 40 
  },
  { 
    name: { fa: "تزریق روگام برای مادران Rh منفی", en: "RhoGAM for Rh-Negative Mothers" },
    description: { fa: "جلوگیری از تولید آنتی‌بادی که می‌تواند بر بارداری‌های آینده تأثیر بگذارد.", en: "Prevents antibody formation that could affect future pregnancies." },
    category: EventCategory.Medication, startWeek: 28, endWeek: 28, isCritical: true 
  },

  // Third Trimester
  { 
    name: { fa: "واکسن سه‌گانه (Tdap)", en: "Tdap Vaccine" },
    description: { fa: "محافظت از نوزاد در برابر سیاه‌سرفه.", en: "Protects the newborn from pertussis (whooping cough)." },
    category: EventCategory.Medication, startWeek: 27, endWeek: 36 
  },
  { 
    name: { fa: "شمارش حرکات جنین", en: "Kick Counts / Fetal Movement Monitoring" },
    description: { fa: "نظارت مادر بر سلامت جنین.", en: "Maternal monitoring of fetal well-being." },
    category: EventCategory.Counseling, startWeek: 28, endWeek: 42 
  },
  { 
    name: { fa: "غربالگری استرپتوکوک گروه B (GBS)", en: "Group B Strep (GBS) Screening" },
    description: { fa: "نمونه‌برداری برای بررسی باکتری GBS جهت جلوگیری از عفونت نوزاد.", en: "Swab to check for GBS bacteria to prevent newborn infection." },
    category: EventCategory.Screening, startWeek: 36, endWeek: 37, isCritical: true 
  },
  { 
    name: { fa: "بیوفیزیکال پروفایل (BPP)", en: "Biophysical Profile (BPP)" },
    description: { fa: "سونوگرافی برای ارزیابی سلامت جنین در بارداری‌های پرخطر.", en: "Ultrasound to assess fetal well-being in high-risk pregnancies." },
    category: EventCategory.Ultrasound, startWeek: 32, endWeek: 42 
  },
  { 
    name: { fa: "مشاوره علائم زایمان", en: "Counseling on Labor Signs" },
    description: { fa: "آموزش علائم زایمان واقعی و زمان مراجعه به بیمارستان.", en: "Educating on signs of true labor, when to go to the hospital." },
    category: EventCategory.Counseling, startWeek: 36, endWeek: 42 
  },
  { 
    name: { fa: "بحث در مورد القای زایمان", en: "Induction of Labor Discussion" },
    description: { fa: "بحث در مورد بارداری‌هایی که از ۴۱ هفته فراتر می‌روند.", en: "Discussion for pregnancies extending beyond 41 weeks." },
    category: EventCategory.Milestone, startWeek: 41, endWeek: 42 
  },
];


export const RED_FLAGS_BY_TRIMESTER: { [key: number]: RedFlag[] } = {
  1: [
    { 
      title: { fa: "خونریزی واژینال", en: "Vaginal Bleeding" }, 
      details: { fa: "هرگونه خونریزی باید ارزیابی شود. می‌تواند نشانه سقط یا حاملگی خارج رحمی باشد.", en: "Any bleeding should be evaluated. Can indicate miscarriage or ectopic pregnancy." }, 
      symptoms: [
        { fa: "لکه بینی یا خونریزی شدید", en: "Spotting or heavy bleeding" }, 
        { fa: "درد یا گرفتگی شکم", en: "Abdominal cramping or pain" }
      ] 
    },
    { 
      title: { fa: "تهوع و استفراغ شدید", en: "Severe Nausea/Vomiting" }, 
      details: { fa: "هیپرامزیس گراویداروم می‌تواند منجر به کم‌آبی و کاهش وزن شود.", en: "Hyperemesis Gravidarum can lead to dehydration and weight loss." }, 
      symptoms: [
        { fa: "ناتوانی در نگه داشتن مایعات برای بیش از ۱۲ ساعت", en: "Inability to keep down fluids for >12 hours" },
        { fa: "کاهش وزن قابل توجه", en: "Significant weight loss" }
      ]
    },
    { 
      title: { fa: "علائم حاملگی خارج رحمی", en: "Ectopic Pregnancy Signs" }, 
      details: { fa: "یک اورژانس تهدیدکننده حیات که در آن جنین خارج از رحم رشد می‌کند.", en: "A life-threatening emergency where the fetus grows outside the uterus." }, 
      symptoms: [
        { fa: "درد شدید و یک طرفه شکم", en: "Sharp, one-sided abdominal pain" },
        { fa: "درد سرشانه", en: "Shoulder tip pain" },
        { fa: "سرگیجه یا غش", en: "Dizziness or fainting" }
      ] 
    },
  ],
  2: [
    { 
      title: { fa: "علائم پره‌اکلامپسی", en: "Preeclampsia Signs" }, 
      details: { fa: "یک اختلال فشار خون جدی که نیاز به توجه فوری دارد.", en: "A serious blood pressure disorder. Requires immediate attention." }, 
      symptoms: [
        { fa: "سردرد شدیدی که برطرف نمی‌شود", en: "Severe headache that won't go away" },
        { fa: "تغییرات بینایی (تاری دید، دیدن لکه‌ها)", en: "Vision changes (blurriness, spots)" },
        { fa: "درد ربع فوقانی راست شکم (RUQ)", en: "Upper right quadrant (RUQ) abdominal pain" },
        { fa: "تورم ناگهانی دست‌ها/صورت", en: "Sudden swelling of hands/face" }
      ]
    },
    { 
      title: { fa: "علائم زایمان زودرس", en: "Preterm Labor Signs" }, 
      details: { fa: "زایمانی که قبل از هفته ۳۷ بارداری شروع می‌شود.", en: "Labor that begins before 37 weeks of pregnancy." }, 
      symptoms: [
        { fa: "انقباضات منظم (هر ۱۰ دقیقه یا کمتر)", en: "Regular contractions (every 10 min or closer)" },
        { fa: "کمردرد مداوم و مبهم", en: "Constant low, dull backache" },
        { fa: "فشار در لگن", en: "Pelvic pressure" },
        { fa: "نشت مایع یا خونریزی واژینال", en: "Leaking fluid or vaginal bleeding" }
      ]
    },
    { 
      title: { fa: "کاهش حرکات جنین", en: "Decreased Fetal Movement" }, 
      details: { fa: "پس از شروع حرکات، کاهش قابل توجه نیاز به ارزیابی دارد.", en: "Once movement is established, a significant reduction needs evaluation." }, 
      symptoms: [
        { fa: "کمتر از ۱۰ حرکت در ۲ ساعت (بعد از هفته ۲۸)", en: "Fewer than 10 movements in 2 hours (after 28 weeks)" }
      ]
    },
  ],
  3: [
    { 
      title: { fa: "پره‌اکلامپسی / سندرم HELLP", en: "Preeclampsia / HELLP Syndrome" }, 
      details: { fa: "پیشرفت پره‌اکلامپسی می‌تواند سریع و خطرناک باشد.", en: "Progression of preeclampsia can be rapid and dangerous." }, 
      symptoms: [
        { fa: "سردرد شدید", en: "Severe headache" },
        { fa: "تغییرات بینایی", en: "Vision changes" },
        { fa: "درد RUQ", en: "RUQ pain" },
        { fa: "تهوع/استفراغ", en: "Nausea/vomiting" },
        { fa: "تنگی نفس", en: "Shortness of breath" }
      ]
    },
    { 
      title: { fa: "دکولمان جفت", en: "Placental Abruption" }, 
      details: { fa: "جدا شدن جفت از دیواره رحم. یک وضعیت اورژانسی.", en: "The placenta separates from the uterine wall. An emergency." }, 
      symptoms: [
        { fa: "درد ناگهانی و مداوم شکم یا کمر", en: "Sudden, constant abdominal or back pain" },
        { fa: "خونریزی واژینال (ممکن است وجود نداشته باشد)", en: "Vaginal bleeding (can be absent)" },
        { fa: "حساسیت یا سفتی رحم", en: "Uterine tenderness or rigidity" }
      ]
    },
    { 
      title: { fa: "پارگی کیسه آب (PPROM/PROM)", en: "Rupture of Membranes (PPROM/PROM)" }, 
      details: { fa: "پاره شدن کیسه آب قبل از شروع دردهای زایمان.", en: "Water breaking before labor starts." }, 
      symptoms: [
        { fa: "خروج ناگهانی یا نشت قطره‌ای مایع از واژن", en: "A gush or a steady trickle of fluid from the vagina" }
      ]
    },
    { 
      title: { fa: "کاهش حرکات جنین", en: "Decreased Fetal Movement" }, 
      details: { fa: "یک شاخص کلیدی برای سلامت جنین.", en: "A key indicator of fetal well-being." }, 
      symptoms: [
        { fa: "کمتر از ۱۰ حرکت در ۲ ساعت", en: "Fewer than 10 movements in 2 hours" }
      ]
    },
  ],
};
