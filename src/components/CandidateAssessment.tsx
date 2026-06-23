import React, { useState, useEffect, useMemo } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { AuditChain } from "../utils/AuditChain";
import { safeSessionStorage } from "../utils/storage";
import {
  Scale,
  Sparkles,
  Cpu,
  UserCheck,
  Building2,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  Info,
  X,
  Languages,
  Activity,
  Upload,
  Camera,
  CameraOff,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  BarChart3,
  Layers,
  Check,
  Eye,
  Trash2,
  RotateCcw
} from "lucide-react";

// Types
export interface KineticProfile {
  name: string;
  locomotionType: string;
  experienceYears: string;
  educationLevel: string;
  isFluctuating: boolean;
  capabilities: Record<string, string>;
  capabilitiesGoodDay: Record<string, string>;
  capabilitiesBadDay: Record<string, string>;
}

export interface EnvironmentAudit {
  entrance: string;
  parking: string;
  elevator: string;
  corridor: string;
  workstation: string;
  restroom: string;
  emergency: string;
  hybrid_work: string;
}

export interface CandidateAssessmentProps {
  language: "ar" | "en";
  onComplete: (data: {
    kineticProfile: KineticProfile;
    environmentAudit: EnvironmentAudit;
    evidenceStrength: number;
    trustIndex: number;
    requiresReview: boolean;
    hasConflict: boolean;
    gaitMetrics: any;
    uploadedFileName: string;
  }) => void;
  onCancel: () => void;
}

// Full translated dictionaries for candidate portal
const labels = {
  ar: {
    title: "بوابة قياس ملاءمة بيئة العمل والقدرات للمرشح",
    subtitle: "إجراء المسح الفني ومطابقة الكفاءة الحركية مع الممر الآمن وكود البناء السعودي (بلدي)",
    step1: "١. الملف الحركي",
    step2: "٢. مطابقة البيئة",
    step3: "٣. توثيق الأدلة",
    step4: "٤. التشخيص والملخص",
    
    // Step 1
    personalInfo: "الهوية المهنية والشخصية للمرشح",
    fullName: "الاسم الكامل للمرشح (مطابق للهوية الوطنية):",
    namePlaceholder: "سلطان عبد العزيز الخالدي...",
    locomotionTitle: "الوسيلة الرئيسية للتنقل والمناورة الحالية:",
    experienceLabel: "عدد سنوات الخبرة المهنية المتراكمة:",
    experiencePlaceholder: "مثال: 5",
    educationLabel: "التحصيل الأكاديمي الحاصل عليه:",
    eduHighSchool: "دون الجامعي (دبلوم أو ثانوي)",
    eduBachelor: "بكالوريوس",
    eduPostgrad: "دراسات عليا (ماجستير / دكتوراه)",
    
    fluctuateTitle: "هل تتذبذب الكفاءة الحركية أو العضلية يومًا بعد يوم؟",
    fluctuateDesc: "تفعيل هذا الخيار يتيح تسجيل استجابة القدرات في الأيام الجيدة (النشطة) والأيام السيئة (المنهكة) كلاً على حدة لموازنة التعب العضلي.",
    capabilitiesTableTitle: "مصفوفة القدرات الحركية الـ15 الأساسية للوصول الشامل (كود SBC)",
    capColumnName: "القدرة والمناورة الحركية",
    capColumnGeneral: "مستوى التحمل العام",
    capColumnGood: "يوم نشط (جيد)",
    capColumnBad: "يوم منهك (سيء)",
    optionCan: "يستطيع بشكل مستقل",
    optionAccom: "يستطيع بتكييف تيسيري",
    optionCannot: "لا يستطيع",

    // Step 2
    envTitle: "التهيئة الهندسية المبدئية لمقر المنشأة والمكاتب",
    envDesc: "مسح بيئي هندسي بـ 8 شواهد رئيسية لتقييم مدى تيسير البنية التحتية ومطابقة كود البناء السعودي:",
    envStatusCompliant: "متوافق ومتاح بالكامل",
    envStatusNeedsReview: "يتطلب مسح هندسي أو تدقيق",
    envStatusInaccessible: "غير متوافق / عائق مادي",
    envLabelEntrance: "المدخل الرئيسي والمنحدر الخارجي",
    envTipEntrance: "يتطلب منحدرًا لا يتعدى ميله 1:12 مع وجود واجهات مساعدة متوافقة مع متطلبات كود البناء السعودي.",
    envLabelParking: "المواقف المخصصة للأشخاص ذوي الإعاقة ومسار الحركة",
    envTipParking: "يُشترط توفير موقف بعرض لا يقل عن 3.6م مع خطوط تنظيمية صفراء ومسار ممهد خالٍ من العوائق المادية.",
    envLabelElevator: "المصاعد المهيأة للوصول",
    envTipElevator: "توفير أزرار تحكم منخفضة الارتفاع (لا تزيد عن 1.2م)، مؤشرات صوتية وبصرية، وعرض باب مريح (أكبر من 90 سم).",
    envLabelCorridor: "الممرات والأبواب الداخلية",
    envTipCorridor: "ممر بعرض لا يقل عن 1.5م للدوران المستمر مع أرضية مانعة للانزلاق وباب يفتح بقوة ضغط خفيفة.",
    envLabelWorkstation: "المحطة المكتبية ومحيط بيئة العمل المباشر",
    envTipWorkstation: "مكتب مفرغ من الأسفل وبارتفاع مريح (75-80 سم) لتسهيل مناورة الكرسي المتحرك.",
    envLabelRestroom: "دورة المياه المهيئة بالكامل",
    envTipRestroom: "دورة مياه واسعة بقطر دوران 1.5م، مقابض مساعدة جدارية مدعومة هندسياً، وباب يفتح للخارج.",
    envLabelEmergency: "مخارج وخطة الطوارئ والإخلاء الآمن",
    envTipEmergency: "توفير جرس إنذار وامض مرئي، مسار هروب خالٍ من الدرجات، ومناطق لجوء مخصصة للحماية المؤقتة.",
    envLabelHybrid: "خيار نمط العمل المختلط (عن بعد / مكتبي)",
    envTipHybrid: "توفير تجهيزات تقنية ونظم اتصال مرنة لمشاركة المستندات والمهام عن بُعد عند الضرورة.",

    // Step 3
    evidenceTitle: "طبقة تأكيد الأدلة وقرائن الحوكمة والتحليل الحي",
    evidenceDesc: "دمج الإقرارات الطبية، مستندات المنشأة والمحاكاة التفاعلية للفيديو حركياً لرفع نسبة موثوقية الطلب المزدوج ومكافحة الانحياز والاستبعاد الفني:",
    evTabManual: "أ) ملف الإقرارات اليدوية للقدرات",
    evTabUpload: "ب) مستند تقرير التهيئة المكتوب",
    evTabCamera: "ج) مسح الكاميرا الفوري والقياسات الحيوية",
    
    evManualReady: "الملف الحركي الموجه نشط ومكتمل وجاهز كمرجعية إدخال افتراضية.",
    evUploadPrompt: "اسحب ملف التقرير الطبي، كروكي هندسي، أو وثيقة الفحص البيئي (.pdf, .jpg, .png, .mp4)",
    evUploadSuccess: "تم تأكيد استلام وثيقة المطالبة بنجاح وبشكل آمن:",
    evUploadStrength: "يرجى تحديد مستوى وجدارة المستند المرفق:",
    strengthStrong: "مستند قوي موثق رسمياً (ترخيص كود البناء أو شهادة صحية)",
    strengthMedium: "مستند متوسط (كروكي أولي أو تقرير تقييم موازٍ للمنشأة)",
    strengthWeak: "مستند ضعيف (إقرار ورقي أو وثيقة غير معتمدة)",
    
    evCamSecureAlert: "الكاميرا تتطلب استضافة آمنة (HTTPS) — استخدم الإدخال اليدوي أو رفع ملف، أو استضف الملف عبر GitHub Pages/Netlify.",
    evCamStartBtn: "البدء الفوري بالمحاكاة الحركية الفورية والتقاط القياسات (Gait Simulation)",
    evCamActive: "جاري تحليل زوايا الظهر والورك والأطراف ومفاصل الحركة ديناميكياً لتوليد الإشارات الحركية الست...",
    evCamMetricsTitle: "القياسات الحيوية الـ6 الملتقطة بمستشعرات محاكاة الحركة (2D Dials):",
    gaitDisclaimer: "محاكاة توضيحية لسرعة المشي والقياسات الحيوية. لم تُختبر هذه النماذج بعد على بيانات مرشحين حقيقيين، لتوضيح طبيعة النظام المستهدف حوكمته في الدفعة السابعة.",
    
    gaitSpeed: "سرعة المشي المقدرة",
    gaitCadence: "معدل الخطوات في الدقيقة",
    gaitSymmetry: "مؤشر خلل الاتساق والنبر",
    gaitStride: "طول خطوة المشية",
    gaitSupport: "زمن الدعم المزدوج الكلي",
    gaitDoubleSupport: "زمن الدعم المزدوج الكلي",
    gaitVariability: "مؤشر ذبذبة المشي العصبي",
    
    metricsNormal: "طبيعي وآمن",
    metricsDanger: "انتبه: عتبة خطورة سقوط أو تذبذب عالٍ",
    
    evBlendTitle: "حوكمة ومطابقة تماسك الأدلة الكلية (Evidence Coherence):",
    evStrengthScore: "قوة تماسك الأدلة وقرائن الملاءمة المحسوبة:",
    evErrorLabel: "يجب ملء الإدخال اليدوي وتأكيد أو ثبوت دليل واحد على الأقل لتجاوز عتبة الـ (0) والتقدم.",

    // Step 4
    summaryTitle: "الملخص والتشخيص الإجمالي لاستدامة التوظيف والتهيئة",
    summaryDesc: "التقرير الهندسي والملخص الموجه للمدقق البشري والمنشأة قبل بدء استعراض بيئة العمل والوصول الشامل:",
    sumIdentity: "الهوية الحالية للملف المهني",
    sumCapabilities: "توزيع مصفوفة القدرات الحركية الـ15 الأساسية للمرشح سلطان",
    sumToggleView: "تبديل المعاينة (مخطط الملاءمة الرياضية / جدول تفصيلي)",
    sumTrustIndex: "مؤشر جدارة التثبت وموثوقية المعايير (Miyar TrustIndex):",
    sumTrustDesc: "أداة حوكمة لمنع الهدر التمكيني أو إصدار توصيات اعتباطية غير مطابقة للتكوين العضلية الفعلي.",
    sumConflictLabel: "⚖️ تنبيه تعارض حاد في تماسك الأدلة:",
    sumConflictDesc: "تضارب حرج: تم الإقرار بوجود قدرة مستقلة كاملة على المشي بالمصفوفة اليدوية، بينما سجلت كاميرا المسح الفوري سرعة تقل عن 0.8 م/ثانية. تم تخفيض درجة الثقة كإجراء امتثال وحظر إصدار التوصيات التلقائية ويتطلب مراجعة بشرية للتحقق.",
    sumReadyBanner: "✓ الملاءمة الحركية مهيأة بالكامل وجاهزة للانتقال للتحليل البيئي للوظيفة",
    sumReadyDesc: "تم بنجاح حظر الاستبعاد الرياضي وتوثيق التيسيرات الحركية للمرشح سلطان عبد العزيز الخالدي. يمكنك التقدم للخطوة التالية لمطابقتها مع البيئة لتجهيز التقرير النهائي.",
    
    // Navigation
    btnPrev: "السابق",
    btnNext: "التالي",
    btnCancel: "إلغاء التقييم والرجوع",
    btnFinish: "✓ جاهز لتحليل الوظيفة"
  },
  en: {
    title: "Candidate Workspace Suitability & Capabilities Portal",
    subtitle: "Coherence audit matching physical endurance, structural landmarks, and Saudi Building Code (SBC) criteria",
    step1: "1. Motion Profile",
    step2: "2. Spatial Environment",
    step3: "3. Evidence Integrity",
    step4: "4. Diagnostics",
    
    // Step 1
    personalInfo: "Candidate Professional Identity",
    fullName: "Candidate Full Name (Consistent with National Registry):",
    namePlaceholder: "Sultan Abdulaziz Al-Khaldi...",
    locomotionTitle: "Primary Means of Physical Locomotion:",
    experienceLabel: "Cumulative Years of Professional Experience:",
    experiencePlaceholder: "e.g., 5",
    educationLabel: "Highest Level of Education Completed:",
    eduHighSchool: "Non-University (Diploma or High School)",
    eduBachelor: "Bachelor's Degree",
    eduPostgrad: "Postgraduate Degree (Master / PhD)",
    
    fluctuateTitle: "Does muscular or motor capacity fluctuate day-to-day?",
    fluctuateDesc: "Enabling this exposes distinct columns to log performance on Active Days (Good) and Fatigued Days (Bad) separately to prevent physical strain overshoot.",
    capabilitiesTableTitle: "Miyar's 15 Core Physical Capabilities of Universal Access (SBC Code)",
    capColumnName: "Mobility & Reach Dimension",
    capColumnGeneral: "General Endurance level",
    capColumnGood: "Active Day (Good)",
    capColumnBad: "Fatigued Day (Bad)",
    optionCan: "Sustained Independently",
    optionAccom: "Requires Adaptive Accommodation",
    optionCannot: "Cannot Perform",

    // Step 2
    envTitle: "Workspace Initial Architectural Accessibility",
    envDesc: "8 structural checkpoints indicating initial facility compliance against global and SBC guidelines:",
    envStatusCompliant: "SBC-Compliant / Accessible",
    envStatusNeedsReview: "Requires Field Audit / Engineering inspection",
    envStatusInaccessible: "Non-Compliant / Physical Hazard",
    envLabelEntrance: "Main Entrance & Ramp Access",
    envTipEntrance: "Requires a maximum 1:12 ramp slope with continuous handrails in accordance with SBC criteria.",
    envLabelParking: "Reserved Parking & Route of Travel",
    envTipParking: "Parking spot at least 3.6m wide with yellow hazard stripes and a barrier-free access aisle.",
    envLabelElevator: "Accessible Elevators",
    envTipElevator: "Low-reach controls (under 1.2m), audible and visual indicators, with door clear width over 90cm.",
    envLabelCorridor: "Corridors & Clear Openings",
    envTipCorridor: "Minimum 1.5m clear corridor width for full wheelchair turning circle and slip-resistant floor surface.",
    envLabelWorkstation: "Adapted Desk & Immediate Workstation",
    envTipWorkstation: "Under-desk knee clearance and comfortable height (75-80cm) allowing smooth wheelchair positioning.",
    envLabelRestroom: "Fully Accommodating Restrooms",
    envTipRestroom: "Spacious layout with a 1.5m turning diameter, heavy-duty safety grab bars, and an outward swinging door.",
    envLabelEmergency: "Emergency Alarming & Rapid Evacuation",
    envTipEmergency: "Equipped with flashing visual strobe alarms, zero-step exit routes, and designated safe refuge areas.",
    envLabelHybrid: "Flexible / Hybrid Capability Options",
    envTipHybrid: "Technical setup and flexible collaboration structures allowing remote contribution during severe fatigue.",

    // Step 3
    evidenceTitle: "Multi-Source Evidence Alignment Layer",
    evidenceDesc: "Integrating manual forms, electronic file uploads, and interactive vision-based video kinematics to maximize placement confidence and mitigate structural waste:",
    evTabManual: "A) Manual Structural Declarations",
    evTabUpload: "B) Architectural Self-Audit Upload",
    evTabCamera: "C) Video Gait Telemetry Simulation",
    
    evManualReady: "Manual capabilities matrix is fully completed and stored in-memory as the default physical baseline.",
    evUploadPrompt: "Drag and drop certified medical report, building scheme, or workspace photograph (.pdf, .jpg, .png, .mp4)",
    evUploadSuccess: "Official document submitted and securely cached:",
    evUploadStrength: "Indicate uploaded evidence reliability tier:",
    strengthStrong: "Strong Official (Accredited auditor report or certified SBC license)",
    strengthMedium: "Medium Conceptual (Architectural draft or corporate audit self-checks)",
    strengthWeak: "Weak Unchecked (Standard photo or self-attested oral claim)",
    
    evCamSecureAlert: "Camera requires secure hosting (HTTPS) — use manual input or upload files, or host on GitHub Pages/Netlify.",
    evCamStartBtn: "Start Gait Telemetry Tracking Simulation Mode",
    evCamActive: "Algorithmic camera solver running... Tracking kinematic angles, joint nodes, and spatial stance ratios.",
    evCamMetricsTitle: "The 6 Gait Telemetry Metrics Captured dynamically (2D Dials):",
    gaitDisclaimer: "Illustrative simulation of gait speed and kinematics. These models are not yet calibrated with real subjects, demonstrating the target engine governance in Batch 7.",
    
    gaitSpeed: "Estimated Gait Speed",
    gaitCadence: "Cadence Speed Rate",
    gaitSymmetry: "Symmetry Deficit Offset",
    gaitStride: "Stride Walking Length",
    gaitDoubleSupport: "Double Support Stance Index",
    gaitVariability: "Neuro-gait Variability Metric",
    
    metricsNormal: "Normal & Highly Stable",
    metricsDanger: "Warning: High sway fluctuation / fall risk detected",
    
    evBlendTitle: "Decentralized Evidence Coherence Convergence Model:",
    evStrengthScore: "Aggregated Evidence Coherence Score:",
    evErrorLabel: "Access Denied: Evidence score is 0. Please satisfy the manual profiling details or confirm document/telemetry evidence.",

    // Step 4
    summaryTitle: "Comprehensive Technical Analysis & Workspace Diagnostic Summary",
    summaryDesc: "Certified layout summary prepared for the accredited human auditor and the recruitment supervisor:",
    sumIdentity: "Assembled Professional File Identity",
    sumCapabilities: "Distribution of the 15 Physical Capabilities Profile",
    sumToggleView: "Toggle Presentation Layout (Donut Chart / Inline Detail Rows)",
    sumTrustIndex: "Reliability & Compliance TrustIndex (Miyar TrustIndex):",
    sumTrustDesc: "A multi-layered metric preventing computational shortcuts and confirming structural integrity before site construction.",
    sumConflictLabel: "⚖️ Alert: Cross-Source Evidence Discrepancy Found!",
    sumConflictDesc: "High Risk Discrepancy: Candidate physical registry indicated fully independent walking, but video diagnostics recorded a gait speed limit lower than 0.8 m/s. Placement reliability is capped at 35% with an automated lock requiring accredited auditing to unlock recommendations.",
    sumReadyBanner: "✓ Candidate Physical Threshold Profile Resolved Successfully",
    sumReadyDesc: "Sultan Abdulaziz Al-Khaldi's physical requirements have been mapped. You are now authorized to compare these with target office physical parameters in the next tab.",
    
    // Navigation
    btnPrev: "Back",
    btnNext: "Next",
    btnCancel: "Decline and Exit",
    btnFinish: "✓ Ready for Workspace Integration"
  }
};

const LTypes = {
  ar: [
    { id: "wheelchair_manual", name: "كرسي متحرك يدوياً" },
    { id: "wheelchair_electric", name: "كرسي متحرك كهربائياً" },
    { id: "crutches", name: "عكازات أو مساند مشي ثنائية" },
    { id: "prosthetic_lower", name: "طرف صناعي سفلي" },
    { id: "prosthetic_upper", name: "طرف صناعي علوي" },
    { id: "limited_upper", name: "حركة محدودة بالطرف العلوي" },
    { id: "limited_lower", name: "حركة محدودة بالطرف السفلي" },
    { id: "spinal", name: "إصابات الحبل الشوكي" },
    { id: "cerebral_motor", name: "شلل دماغي أو اضطراب عصبي حركي" },
    { id: "other_motor", name: "صعوبات حركية مخصصة أخرى" }
  ],
  en: [
    { id: "wheelchair_manual", name: "Manual Wheelchair User" },
    { id: "wheelchair_electric", name: "Electric Wheelchair User" },
    { id: "crutches", name: "Walking Crutches / Support Frames" },
    { id: "prosthetic_lower", name: "Lower-limb Prosthesis" },
    { id: "prosthetic_upper", name: "Upper-limb Prosthesis" },
    { id: "limited_upper", name: "Limited Upper-limb Dexterity" },
    { id: "limited_lower", name: "Limited Lower-limb Mobility" },
    { id: "spinal", name: "Spinal Cord Impact" },
    { id: "cerebral_motor", name: "Cerebral Motor / Neuro Disorders" },
    { id: "other_motor", name: "Other Specific Motor Difficulties" }
  ]
};

const CapList = {
  ar: [
    { id: "keyboard", name: "استخدام لوحة المفاتيح والتحكم الرقمي" },
    { id: "mouse", name: "التحكم المنسق بمؤشر الماوس" },
    { id: "writing", name: "الكتابة اليدوية وتدوين المستندات بالقلم" },
    { id: "carry_light", name: "حمل وتناول الأغراض الخفيفة (< 2 كغم)" },
    { id: "carry_heavy", name: "رفع أو حمل أغراض ثقيلة (> 10 كغم)" },
    { id: "both_hands", name: "التنسيق المشترك والقبض المتبادل باليدين معاً" },
    { id: "walk_50m", name: "المشي لمسافة قصيرة (50 م) بشكل مستقل تماماً" },
    { id: "walk_500m", name: "المشي لمسافة متوسطة (500 م) متواصلة بدون عناء" },
    { id: "stairs", name: "صعود السلالم والدرج وتخطي العتبات الهندسية" },
    { id: "indoor_nav", name: "المناورة الحركية والالتفاف داخل المكاتب والصالات" },
    { id: "outdoor_nav", name: "التنقل الخارجي بالساحات العامة والمواقف الرملية" },
    { id: "driving", name: "قيادة مركبة مجهزة بمتحكمات خاصة أو مهيأة" },
    { id: "sit_4h", name: "الجلوس المتواصل في محطة مكتبية لمدة 4 ساعات" },
    { id: "stand_30m", name: "الوقوف المستقر في موقع ثابت لمدة 30 دقيقة" },
    { id: "bend_reach", name: "الانحناء والتقاط الأغراض والوصول للمستويات المتباينة" }
  ],
  en: [
    { id: "keyboard", name: "Keyboard usage and digital controls" },
    { id: "mouse", name: "Coordinated tracking with standard mouse" },
    { id: "writing", name: "Manual writing and document annotation by pen" },
    { id: "carry_light", name: "Carrying & handling light items (< 2 kg)" },
    { id: "carry_heavy", name: "Lifting or pulling heavy objects (> 10 kg)" },
    { id: "both_hands", name: "Combined dual-hand coordination & bilateral grip" },
    { id: "walk_50m", name: "Walking short distance (50m) fully independently" },
    { id: "walk_500m", name: "Walking medium distance (500m) without assistance" },
    { id: "stairs", name: "Climbing architectural stairs and step threshold hops" },
    { id: "indoor_nav", name: "Sufficient 180° rotation & mobility inside offices" },
    { id: "outdoor_nav", name: "Maneuvering across yards, asphalt & sandy slopes" },
    { id: "driving", name: "Driving a customized or hydraulically modified vehicle" },
    { id: "sit_4h", name: "Continuous seating at desk environment for 4 hours" },
    { id: "stand_30m", name: "Sustained standing in fixed hub zone for 30 minutes" },
    { id: "bend_reach", name: "Bending down and multi-level vertical reach" }
  ]
};

export function CandidateAssessment({ language, onComplete, onCancel }: CandidateAssessmentProps) {
  const t = labels[language];
  const locomotionOptions = LTypes[language];
  const capabilitiesKeys = CapList[language];

  // Steps state: 1 to 4
  const [currentStep, setCurrentStep] = useState(1);
  const [maxReachedStep, setMaxReachedStep] = useState(1);

  // Form State - Step 1
  const [candName, setCandName] = useState(() => safeSessionStorage.getItem("cand_name") || "");
  const [candLocomotion, setCandLocomotion] = useState(() => safeSessionStorage.getItem("cand_locomotion") || "wheelchair_manual");
  const [candExp, setCandExp] = useState(() => safeSessionStorage.getItem("cand_exp") || "");
  const [candEdu, setCandEdu] = useState(() => safeSessionStorage.getItem("cand_edu") || "bachelor");
  const [candIsFluctuating, setCandIsFluctuating] = useState(() => {
    return safeSessionStorage.getItem("cand_is_fluctuating") === "true";
  });

  // 15 Capabilities State
  const [capabilities, setCapabilities] = useState<Record<string, string>>(() => {
    const cached = safeSessionStorage.getItem("cand_capabilities");
    if (cached) return JSON.parse(cached);
    // default everyone can perform
    const initial: Record<string, string> = {};
    CapList.ar.forEach(c => {
      initial[c.id] = "can";
    });
    return initial;
  });

  const [capabilitiesGoodDay, setCapabilitiesGoodDay] = useState<Record<string, string>>(() => {
    const cached = safeSessionStorage.getItem("cand_capabilities_good");
    if (cached) return JSON.parse(cached);
    const initial: Record<string, string> = {};
    CapList.ar.forEach(c => {
      initial[c.id] = "can";
    });
    return initial;
  });

  const [capabilitiesBadDay, setCapabilitiesBadDay] = useState<Record<string, string>>(() => {
    const cached = safeSessionStorage.getItem("cand_capabilities_bad");
    if (cached) return JSON.parse(cached);
    const initial: Record<string, string> = {};
    CapList.ar.forEach(c => {
      initial[c.id] = "can";
    });
    return initial;
  });

  // Step 2 State - Environment (8 landmarks)
  const [envData, setEnvData] = useState<Record<string, string>>(() => {
    const cached = safeSessionStorage.getItem("cand_env_data");
    if (cached) return JSON.parse(cached);
    return {
      entrance: "compliant",
      parking: "compliant",
      elevator: "compliant",
      corridor: "compliant",
      workstation: "compliant",
      restroom: "compliant",
      emergency: "compliant",
      hybrid_work: "compliant"
    };
  });

  // Step 3 State - Evidence
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(() => {
    const cachedName = sessionStorage.getItem("ev_file_name");
    const cachedSize = sessionStorage.getItem("ev_file_size");
    return cachedName ? { name: cachedName, size: cachedSize || "" } : null;
  });
  const [docStrength, setDocStrength] = useState<string>(() => {
    return sessionStorage.getItem("ev_doc_strength") || "medium";
  });
  const [hasGaitAnalysis, setHasGaitAnalysis] = useState(() => {
    return sessionStorage.getItem("ev_gait_done") === "true";
  });
  const [gaitMetrics, setGaitMetrics] = useState(() => {
    const cached = sessionStorage.getItem("ev_gait_metrics");
    if (cached) return JSON.parse(cached);
    return {
      speed: 1.3,
      cadence: 112,
      symmetry: 6,
      length: 1.5,
      doubleSupport: 20,
      variability: 2.1
    };
  });

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<"" | "stream" | "scanning" | "completed">("");
  const [simulationCountdown, setSimulationCountdown] = useState(4);
  const [simulationLog, setSimulationLog] = useState("");
  const [streamObj, setStreamObj] = useState<MediaStream | null>(null);

  // Step 4 State
  const [viewMode, setViewMode] = useState<"donut" | "table">("donut");

  // Save changes to safeSessionStorage whenever variables change
  useEffect(() => {
    safeSessionStorage.setItem("cand_name", candName);
    safeSessionStorage.setItem("cand_locomotion", candLocomotion);
    safeSessionStorage.setItem("cand_exp", candExp);
    safeSessionStorage.setItem("cand_edu", candEdu);
    safeSessionStorage.setItem("cand_is_fluctuating", String(candIsFluctuating));
    safeSessionStorage.setItem("cand_capabilities", JSON.stringify(capabilities));
    safeSessionStorage.setItem("cand_capabilities_good", JSON.stringify(capabilitiesGoodDay));
    safeSessionStorage.setItem("cand_capabilities_bad", JSON.stringify(capabilitiesBadDay));
    safeSessionStorage.setItem("cand_env_data", JSON.stringify(envData));
    safeSessionStorage.setItem("ev_doc_strength", docStrength);
    safeSessionStorage.setItem("ev_gait_done", String(hasGaitAnalysis));
    safeSessionStorage.setItem("ev_gait_metrics", JSON.stringify(gaitMetrics));
    if (uploadedFile) {
      safeSessionStorage.setItem("ev_file_name", uploadedFile.name);
      safeSessionStorage.setItem("ev_file_size", uploadedFile.size);
    } else {
      safeSessionStorage.removeItem("ev_file_name");
      safeSessionStorage.removeItem("ev_file_size");
    }
  }, [
    candName, candLocomotion, candExp, candEdu, candIsFluctuating,
    capabilities, capabilitiesGoodDay, capabilitiesBadDay, envData,
    uploadedFile, docStrength, hasGaitAnalysis, gaitMetrics
  ]);

  useEffect(() => {
    // Record assessment_started (screen1/step1)
    AuditChain.recordAuditStep("assessment_started", {
      step: 1,
      language,
      timestamp: Date.now()
    }).catch(err => console.error("Error logging assessment_started:", err));
  }, []);

  // Handle clickable progress index navigation
  const handleStepClick = (stepNum: number) => {
    if (stepNum <= maxReachedStep) {
      setCurrentStep(stepNum);
    }
  };

  const handleNextStep = () => {
    // Validate Step 1 forms
    if (currentStep === 1) {
      if (!candName.trim()) {
        alert(language === "ar" ? "يرجى كتابة الاسم الكامل للمرشح للمتابعة" : "Please input candidate's name to proceed");
        return;
      }
    }

    // Validate Step 3 evidence before going to Step 4
    if (currentStep === 3) {
      if (evidenceStrength === 0) {
        alert(language === "ar" ? "تعذر المتابعة: لم يتم ربط أو توثيق أي أدلة. يرجى تزويد مستند أو تشغيل المحاكاة بالفيديو أولاً." : "Coherence Error: Please insert a file or execute the gait analysis mode to generate evidence.");
        return;
      }
    }

    const next = currentStep + 1;
    setCurrentStep(next);
    if (next > maxReachedStep) {
      setMaxReachedStep(next);
    }
    // Scroll container smoothly to top of wizard to assist focus transitions
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 3 File upload mock handlers
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const name = file.name;
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";
      setUploadedFile({ name, size: sizeInMB });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const name = file.name;
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";
      setUploadedFile({ name, size: sizeInMB });
    }
  };

  // Camera capture simulation
  const checkSecureProtocol = () => {
    return window.location.protocol !== "file:";
  };

  const triggerGaitCapture = async () => {
    setRecordingStatus("stream");
    setIsCameraActive(true);
    setSimulationCountdown(4);
    setSimulationLog(language === "ar" ? "جاري تشغيل عدسة المسح..." : "Activating camera lens stream...");

    const isSecure = checkSecureProtocol();
    if (isSecure) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        setStreamObj(stream);
      } catch (err) {
        console.warn("Camera hardware not provisioned or blocked:", err);
        setSimulationLog(language === "ar" ? "محاكاة الرؤية الضوئية الرقمية نشطة..." : "Digital frame solver active...");
      }
    }

    // Staged updates represent computer vision tracking progress
    setTimeout(() => {
      setRecordingStatus("scanning");
      setSimulationLog(language === "ar" ? "جاري قياس السرعة وهندسة بسط الخطوة..." : "Evaluating physical speed & stride width...");
    }, 1500);

    setTimeout(() => {
      setSimulationLog(language === "ar" ? "جاري احتساب ذبذبة المشية ومقدار الدعم المزدوج..." : "Estimating step symmetry and double support time...");
    }, 3200);

    setTimeout(() => {
      // Complete recording & generate realistic randomised values
      // Range criteria: Gait Speed (0.5 to 1.6), Cadence (90 to 140), Symmetry (3 to 28), Stride Length (1.1 to 1.8), Double Stance (12 to 25), Variability (1.5 to 5.2)
      const mockSpeed = parseFloat((0.6 + Math.random() * 0.9).toFixed(2)); // Can be dangerously low sometimes to test conflict <0.8
      const mockCadence = Math.floor(95 + Math.random() * 35);
      const mockSymmetry = Math.round(4 + Math.random() * 22); // Symmetry deficit
      const mockStride = parseFloat((1.2 + Math.random() * 0.5).toFixed(2));
      const mockSupport = Math.round(14 + Math.random() * 9);
      const mockVariability = parseFloat((1.6 + Math.random() * 2.8).toFixed(2));

      setGaitMetrics({
        speed: mockSpeed,
        cadence: mockCadence,
        symmetry: mockSymmetry,
        length: mockStride,
        doubleSupport: mockSupport,
        variability: mockVariability
      });

      setRecordingStatus("completed");
      setHasGaitAnalysis(true);
      setIsCameraActive(false);

      if (streamObj) {
        streamObj.getTracks().forEach(track => track.stop());
        setStreamObj(null);
      }
    }, 5500);
  };

  const cancelGaitRecording = () => {
    if (streamObj) {
      streamObj.getTracks().forEach(track => track.stop());
      setStreamObj(null);
    }
    setIsCameraActive(false);
    setRecordingStatus("");
  };

  // MATHS ENGINE: Evidence Blending (قاعدة مزج الأدلة)
  const evidenceStrength = useMemo(() => {
    const hasManual = true; // Always filled
    const hasUpload = !!uploadedFile;
    const hasGait = hasGaitAnalysis;

    // Document average score based on weight selection (Strong = 100, Medium = 70, Weak = 35)
    let doc_average = 70;
    if (hasUpload) {
      if (docStrength === "strong") doc_average = 100;
      else if (docStrength === "medium") doc_average = 70;
      else if (docStrength === "weak") doc_average = 35;
    }

    // Gait automated score (calculated from speed ratio + symmetry ratio)
    let gait_score = 75;
    if (hasGait) {
      const speedComplianceRatio = Math.min(100, Math.max(20, (gaitMetrics.speed / 1.4) * 100));
      const symmetryAccrual = Math.max(10, 100 - gaitMetrics.symmetry * 2.5); // lower asymmetry deficit = higher score
      gait_score = Math.round((speedComplianceRatio * 0.70) + (symmetryAccrual * 0.30));
    }

    // Blend:
    // Manual/file only => 100% doc_average weight
    // Camera only => 100% gait_score weight
    // Both => gait_score * 0.70 + doc_average * 0.30
    if ((hasManual || hasUpload) && !hasGait) {
      return doc_average;
    } else if (hasGait && !hasManual && !hasUpload) {
      return gait_score;
    } else if (hasGait && (hasManual || hasUpload)) {
      return Math.round((gait_score * 0.70) + (doc_average * 0.30));
    }
    return 0;
  }, [uploadedFile, docStrength, hasGaitAnalysis, gaitMetrics]);

  // CLINICAL COMPRESSION: TrustIndex and Conflict solver constructed using IIFE (مسبوك بـ IIFE)
  const trustData = useMemo(() => {
    return (() => {
      const hasManual = true;
      const hasUpload = !!uploadedFile;
      const hasGait = hasGaitAnalysis;
      const gaitScore = gaitMetrics.speed; // Represents gait speed speed limit for conflict

      // Get manual walker status from walk_50m capability
      const manualWalkStatus = capabilities["walk_50m"] || "can";

      let baseValue = 0;
      if (hasGait && hasUpload) {
        baseValue = 100;
      } else if (hasGait || hasUpload) {
        baseValue = 70;
      } else if (hasManual) {
        baseValue = 40;
      }

      // Conflict Detection
      let conflictDetected = false;
      if (manualWalkStatus === "can" && gaitScore < 0.8) {
        conflictDetected = true;
        baseValue = Math.min(baseValue, 35);
      }

      return {
        trustIndexValue: baseValue,
        hasConflict: conflictDetected,
        requiresReview: conflictDetected
      };
    })();
  }, [uploadedFile, hasGaitAnalysis, gaitMetrics, capabilities]);

  // Distribution calculation of 15 capabilities for diagnostic chart rendering
  const capabilityCategoryRatio = useMemo(() => {
    let can = 0;
    let accom = 0;
    let cannot = 0;

    capabilitiesKeys.forEach(c => {
      let val = "can";
      if (candIsFluctuating) {
        // Average the days or select badDay for safety metrics
        const good = capabilitiesGoodDay[c.id] || "can";
        const bad = capabilitiesBadDay[c.id] || "can";
        if (good === "cannot" || bad === "cannot") {
          val = "cannot";
        } else if (good === "accom" || bad === "accom") {
          val = "accom";
        } else {
          val = "can";
        }
      } else {
        val = capabilities[c.id] || "can";
      }

      if (val === "can") can++;
      else if (val === "accom") accom++;
      else cannot++;
    });

    return { can, accom, cannot };
  }, [capabilities, capabilitiesGoodDay, capabilitiesBadDay, candIsFluctuating, capabilitiesKeys]);

  const handleFinishWizard = async () => {
    try {
      await AuditChain.recordAuditStep("candidate_profile_locked", {
        name: candName,
        locomotionType: candLocomotion,
        isFluctuating: candIsFluctuating,
        evidenceStrength,
        timestamp: Date.now()
      });
    } catch (e) {
      console.error("Failed to log candidate_profile_locked:", e);
    }

    onComplete({
      kineticProfile: {
        name: candName,
        locomotionType: candLocomotion,
        experienceYears: candExp,
        educationLevel: candEdu,
        isFluctuating: candIsFluctuating,
        capabilities,
        capabilitiesGoodDay,
        capabilitiesBadDay
      },
      environmentAudit: envData as unknown as EnvironmentAudit,
      evidenceStrength,
      trustIndex: trustData.trustIndexValue,
      requiresReview: trustData.requiresReview,
      hasConflict: trustData.hasConflict,
      gaitMetrics,
      uploadedFileName: uploadedFile ? uploadedFile.name : ""
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="candidate-portal-root">
      {/* Title Header Block */}
      <div className="border-b border-border/60 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gold uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-gold/20 inline-block font-mono">
              {t.step1} - {t.step4}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight" id="portal-header-title">
              {t.title}
            </h1>
            <p className="text-xs md:text-sm text-muted">
              {t.subtitle}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="self-start md:self-center px-4 py-2 border border-border text-xs rounded-xl hover:bg-white/5 text-slate-300 transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>{t.btnCancel}</span>
          </button>
        </div>
      </div>

      {/* 2. Step Progress Indicator Grid WITH Clickable Previously Completed Navigation */}
      <nav className="grid grid-cols-2 md:grid-cols-4 gap-2.5" aria-label="Step Progress Wizard">
        {[
          { num: 1, label: t.step1 },
          { num: 2, label: t.step2 },
          { num: 3, label: t.step3 },
          { num: 4, label: t.step4 }
        ].map(s => {
          const isActive = currentStep === s.num;
          const isCompleted = s.num < currentStep;
          const isClickable = s.num <= maxReachedStep;

          return (
            <button
              key={s.num}
              onClick={() => isClickable && handleStepClick(s.num)}
              disabled={!isClickable}
              className={`p-3.5 rounded-xl text-right font-medium text-xs border transition-all duration-300 relative flex flex-col justify-between h-20 outline-none ${
                isActive
                  ? "bg-primary/10 border-primary text-white ring-2 ring-primary/40 shadow-lg shadow-primary/15"
                  : isCompleted
                  ? "bg-emerald-950/15 border-emerald-500/35 text-slate-200 cursor-pointer hover:bg-emerald-950/25"
                  : isClickable
                  ? "bg-surface/50 border-border text-slate-300 cursor-pointer hover:bg-elevated"
                  : "bg-surface/20 border-border/30 text-slate-500 cursor-not-allowed"
              }`}
              aria-current={isActive ? "step" : undefined}
              aria-label={`Step ${s.num}: ${s.label}`}
            >
              {/* Floating check indicator or number badge */}
              <div className="flex items-center justify-between w-full">
                <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] uppercase font-black ${
                  isCompleted ? "bg-emerald-500 text-black" : isActive ? "bg-primary text-white" : "bg-slate-800 text-slate-400"
                }`}>
                  {isCompleted ? "✓" : s.num}
                </span>
                {isCompleted && (
                  <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {language === "ar" ? "مكتمل" : "OK"}
                  </span>
                )}
              </div>
              <span className={`block font-bold tracking-tight text-sm ${isActive ? "text-primary-h" : ""}`}>
                {s.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* 3. Wizard Content Body Panels */}
      <div className="glass-card p-6 md:p-8 relative min-h-[480px]">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: language === "ar" ? 15 : -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: language === "ar" ? -15 : 15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            
            {/* STEP 1: Candidate Kinetic Profiling */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-primary-h" />
                    <span>{t.personalInfo}</span>
                  </h2>
                  <p className="text-xs text-muted">
                    {language === "ar" ? "إدخال الهوية المهنية ومصفوفة التحمل والمناورة الـ15 الحركية." : "Input professional identity attributes and the 15 access standard capabilities."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label htmlFor="cand-name-input" className="block text-sm font-semibold text-slate-200">
                      {t.fullName}
                    </label>
                    <input
                      id="cand-name-input"
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                      placeholder={t.namePlaceholder}
                      value={candName}
                      onChange={(e) => setCandName(e.target.value)}
                    />
                  </div>

                  {/* Locomotion selection */}
                  <div className="space-y-2">
                    <label htmlFor="cand-loco" className="block text-sm font-semibold text-slate-200">
                      {t.locomotionTitle}
                    </label>
                    <select
                      id="cand-loco"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium cursor-pointer"
                      value={candLocomotion}
                      onChange={(e) => setCandLocomotion(e.target.value)}
                    >
                      {locomotionOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <label htmlFor="cand-exp-input" className="block text-sm font-semibold text-slate-200">
                      {t.experienceLabel}
                    </label>
                    <input
                      id="cand-exp-input"
                      type="number"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                      placeholder={t.experiencePlaceholder}
                      value={candExp}
                      onChange={(e) => setCandExp(e.target.value)}
                    />
                  </div>

                  {/* Education level */}
                  <div className="space-y-2">
                    <label htmlFor="cand-edu" className="block text-sm font-semibold text-slate-200">
                      {t.educationLabel}
                    </label>
                    <select
                      id="cand-edu"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium cursor-pointer"
                      value={candEdu}
                      onChange={(e) => setCandEdu(e.target.value)}
                    >
                      <option value="highschool">{t.eduHighSchool}</option>
                      <option value="bachelor">{t.eduBachelor}</option>
                      <option value="postgrad">{t.eduPostgrad}</option>
                    </select>
                  </div>
                </div>

                {/* 15 Capabilities Table Switcher */}
                <div className="border-t border-border/40 pt-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-xl border border-border/80">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <Scale className="w-4 h-4 text-gold" />
                        <span>{t.fluctuateTitle}</span>
                      </h3>
                      <p className="text-[11px] text-muted max-w-xl">
                        {t.fluctuateDesc}
                      </p>
                    </div>
                    {/* Switch Toggle */}
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={candIsFluctuating} 
                        onChange={(e) => setCandIsFluctuating(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] rtl:after:right-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      <span className="ms-3 text-xs font-bold text-slate-300">
                        {language === "ar" ? "تفعيل مؤشر التذبذب" : "Fluctuation Mode"}
                      </span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base font-extrabold text-[#EDF2F7]">
                      {t.capabilitiesTableTitle}
                    </h3>
                    
                    {/* Grid-based Responsive Radiogroups for standard access keys */}
                    <div className="border border-border rounded-xl overflow-hidden bg-surface/50">
                      
                      {/* Interactive Grid Table Header */}
                      <div className="grid grid-cols-12 bg-slate-950 p-4 text-xs font-extrabold text-slate-300 border-b border-border font-mono tracking-wide">
                        <div className="col-span-12 md:col-span-5">{t.capColumnName}</div>
                        {!candIsFluctuating ? (
                          <div className="col-span-12 md:col-span-7 mt-2 md:mt-0 text-right md:text-center">{t.capColumnGeneral}</div>
                        ) : (
                          <>
                            <div className="col-span-6 md:col-span-3.5 mt-2 md:mt-0 text-center text-primary-h">{t.capColumnGood}</div>
                            <div className="col-span-6 md:col-span-3.5 mt-2 md:mt-0 text-center text-rose-400">{t.capColumnBad}</div>
                          </>
                        )}
                      </div>

                      {/* Capacity Rows */}
                      <div className="divide-y divide-border">
                        {capabilitiesKeys.map((c, rowIdx) => {
                          const capId = c.id;

                          return (
                            <div 
                              key={capId} 
                              className="grid grid-cols-12 p-4 text-xs items-center gap-2 hover:bg-slate-900/20"
                              id={`cap-row-${capId}`}
                            >
                              {/* Left Ability Name and Index Indicator */}
                              <div className="col-span-12 md:col-span-5 font-medium text-slate-200">
                                <span className="inline-block font-mono text-[10px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded me-2">
                                  {(rowIdx + 1).toString().padStart(2, "0")}
                                </span>
                                <span>{c.name}</span>
                              </div>

                              {/* Right Cap Options (Native HTML inputs styled visually for keyboard navigation) */}
                              {!candIsFluctuating ? (
                                <div 
                                  className="col-span-12 md:col-span-7 flex flex-wrap gap-2 justify-start md:justify-around mt-2 md:mt-0"
                                  role="radiogroup"
                                  aria-label={c.name}
                                >
                                  {["can", "accom", "cannot"].map((optVal) => {
                                    const checked = capabilities[capId] === optVal;
                                    const optLabel = optVal === "can" ? t.optionCan : optVal === "accom" ? t.optionAccom : t.optionCannot;
                                    
                                    return (
                                      <label 
                                        key={optVal} 
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-medium cursor-pointer transition-all select-none ${
                                          checked 
                                            ? "bg-primary/10 border-primary text-white" 
                                            : "border-border bg-slate-900/40 text-muted hover:border-slate-500 hover:text-slate-200"
                                        }`}
                                      >
                                        <input
                                          type="radio"
                                          name={`cap-${capId}`}
                                          value={optVal}
                                          checked={checked}
                                          onChange={() => setCapabilities(p => ({ ...p, [capId]: optVal }))}
                                          className="sr-only"
                                        />
                                        <span className={`w-2.5 h-2.5 rounded-full inline-block border ${
                                          checked ? "bg-primary border-primary" : "border-slate-600"
                                        }`}></span>
                                        <span>{optLabel}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              ) : (
                                <>
                                  {/* Fluctuation: Good Day Column */}
                                  <div className="col-span-6 md:col-span-3.5 flex flex-col gap-1.5 mt-2 md:mt-0 p-1.5 rounded-lg bg-cyan-950/10 border border-cyan-500/10">
                                    <span className="text-[10px] text-primary-h font-bold block text-center mb-1">{t.capColumnGood}</span>
                                    <div className="flex flex-col gap-1" role="radiogroup" aria-label={`${c.name} - ${t.capColumnGood}`}>
                                      {["can", "accom", "cannot"].map((optVal) => {
                                        const checked = capabilitiesGoodDay[capId] === optVal;
                                        const optLabel = optVal === "can" ? t.optionCan : optVal === "accom" ? t.optionAccom : t.optionCannot;

                                        return (
                                          <label 
                                            key={optVal} 
                                            className={`flex items-center gap-1 px-1.5 py-1 rounded border text-[10px] font-medium cursor-pointer transition-all ${
                                              checked 
                                                ? "bg-primary/25 border-primary text-white font-bold" 
                                                : "border-border/60 bg-slate-950/40 text-muted hover:text-slate-200"
                                            }`}
                                          >
                                            <input
                                              type="radio"
                                              name={`cap-good-${capId}`}
                                              value={optVal}
                                              checked={checked}
                                              onChange={() => setCapabilitiesGoodDay(p => ({ ...p, [capId]: optVal }))}
                                              className="sr-only"
                                            />
                                            <span className={`w-2 h-2 rounded-full inline-block ${checked ? "bg-primary" : "bg-slate-700"}`} />
                                            <span className="truncate">{optLabel}</span>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Fluctuation: Bad Day Column */}
                                  <div className="col-span-6 md:col-span-3.5 flex flex-col gap-1.5 mt-2 md:mt-0 p-1.5 rounded-lg bg-rose-950/10 border border-rose-500/10">
                                    <span className="text-[10px] text-rose-400 font-bold block text-center mb-1">{t.capColumnBad}</span>
                                    <div className="flex flex-col gap-1" role="radiogroup" aria-label={`${c.name} - ${t.capColumnBad}`}>
                                      {["can", "accom", "cannot"].map((optVal) => {
                                        const checked = capabilitiesBadDay[capId] === optVal;
                                        const optLabel = optVal === "can" ? t.optionCan : optVal === "accom" ? t.optionAccom : t.optionCannot;

                                        return (
                                          <label 
                                            key={optVal} 
                                            className={`flex items-center gap-1 px-1.5 py-1 rounded border text-[10px] font-medium cursor-pointer transition-all ${
                                              checked 
                                                ? "bg-rose-500/25 border-rose-500 text-white font-bold" 
                                                : "border-border/60 bg-slate-950/40 text-muted hover:text-slate-200"
                                            }`}
                                          >
                                            <input
                                              type="radio"
                                              name={`cap-bad-${capId}`}
                                              value={optVal}
                                              checked={checked}
                                              onChange={() => setCapabilitiesBadDay(p => ({ ...p, [capId]: optVal }))}
                                              className="sr-only"
                                            />
                                            <span className={`w-2 h-2 rounded-full inline-block ${checked ? "bg-rose-500" : "bg-slate-700"}`} />
                                            <span className="truncate">{optLabel}</span>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* STEP 2: Environment Survey matching standard landmarks with tooltips */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary-h" />
                    <span>{t.envTitle}</span>
                  </h2>
                  <p className="text-xs text-muted">
                    {t.envDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: "entrance", name: t.envLabelEntrance, tooltip: t.envTipEntrance },
                    { id: "parking", name: t.envLabelParking, tooltip: t.envTipParking },
                    { id: "elevator", name: t.envLabelElevator, tooltip: t.envTipElevator },
                    { id: "corridor", name: t.envLabelCorridor, tooltip: t.envTipCorridor },
                    { id: "workstation", name: t.envLabelWorkstation, tooltip: t.envTipWorkstation },
                    { id: "restroom", name: t.envLabelRestroom, tooltip: t.envTipRestroom },
                    { id: "emergency", name: t.envLabelEmergency, tooltip: t.envTipEmergency },
                    { id: "hybrid_work", name: t.envLabelHybrid, tooltip: t.envTipHybrid }
                  ].map(e => {
                    const currentVal = envData[e.id];

                    return (
                      <div 
                        key={e.id} 
                        className="p-5 rounded-xl border border-border bg-slate-900/35 hover:bg-slate-900/50 transition-colors space-y-3 relative group"
                        id={`env-grid-${e.id}`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <span className="text-sm font-bold text-white leading-tight">
                            {e.name}
                          </span>
                          
                          {/* Built-in high contrast tooltip / info trigger */}
                          <div className="relative cursor-help text-slate-400 hover:text-gold">
                            <HelpCircle className="w-4 h-4 flex-shrink-0" />
                            <div className="absolute right-0 top-6 hidden group-hover:block z-50 bg-slate-950 border border-gold/40 text-[10px] text-gold p-3 rounded-lg shadow-xl w-60 text-right leading-normal">
                              {e.tooltip}
                            </div>
                          </div>
                        </div>

                        {/* Status Selection Row */}
                        <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label={e.name}>
                          {[
                            { val: "compliant", label: t.envStatusCompliant, colorClass: "peer-checked:bg-emerald-500/15 peer-checked:border-emerald-500 peer-checked:text-emerald-300" },
                            { val: "needs_review", label: t.envStatusNeedsReview, colorClass: "peer-checked:bg-amber-500/15 peer-checked:border-amber-500 peer-checked:text-amber-300" },
                            { val: "inaccessible", label: t.envStatusInaccessible, colorClass: "peer-checked:bg-rose-500/15 peer-checked:border-rose-500 peer-checked:text-rose-300" }
                          ].map(statusOpt => {
                            const isChecked = currentVal === statusOpt.val;

                            return (
                              <label
                                key={statusOpt.val}
                                className={`text-[10px] font-bold py-2 px-1 text-center rounded-lg border border-border/60 bg-slate-950/40 text-muted transition-all select-none cursor-pointer duration-200 relative ${
                                  isChecked ? "ring-1 ring-primary/20" : ""
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`env-${e.id}`}
                                  value={statusOpt.val}
                                  checked={isChecked}
                                  onChange={() => setEnvData(prev => ({ ...prev, [e.id]: statusOpt.val }))}
                                  className="sr-only peer"
                                />
                                <span className={`absolute inset-0 rounded-lg border transition-all pointer-events-none ${
                                  isChecked 
                                    ? statusOpt.val === "compliant" 
                                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-300" 
                                      : statusOpt.val === "needs_review" 
                                      ? "bg-amber-500/10 border-amber-500 text-amber-300" 
                                      : "bg-rose-500/10 border-rose-500 text-rose-300"
                                    : "border-transparent"
                                }`} />
                                <span className={isChecked ? "text-white" : ""}>{statusOpt.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: Multi-layer Evidence and Gait analysis Simulation */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-primary-h" />
                    <span>{t.evidenceTitle}</span>
                  </h2>
                  <p className="text-xs text-muted">
                    {t.evidenceDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Layer A: Manual Inputs summaries */}
                  <div className="glass-card p-5 border-l-4 border-l-cyan-500 flex flex-col justify-between h-72">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold tracking-widest block">
                        {language === "ar" ? "قناة المدخل أ" : "Channel A"}
                      </span>
                      <h3 className="text-sm font-extrabold text-[#EDF2F7]">
                        {t.evTabManual}
                      </h3>
                      <p className="text-[11px] text-muted leading-relaxed">
                        {t.evManualReady}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-lg border border-border/60 text-[10px] text-slate-300 font-mono space-y-1 relative overflow-hidden">
                      <div><strong className="text-white">{language === "ar" ? "الاسم:" : "Name:"}</strong> {candName}</div>
                      <div><strong className="text-white">{language === "ar" ? "تذبذب:" : "Fluctuate:"}</strong> {candIsFluctuating ? (language === "ar" ? "نعم" : "Yes") : (language === "ar" ? "لا" : "No")}</div>
                      <div className="flex justify-between pt-1 border-t border-border/20 mt-1">
                        <span className="text-emerald-400 font-bold">✓ Independent: {capabilityCategoryRatio.can}</span>
                        <span className="text-rose-400">✗ Blocked: {capabilityCategoryRatio.cannot}</span>
                      </div>
                    </div>
                  </div>

                  {/* Layer B: File Upload Frame */}
                  <div className="glass-card p-5 border-l-4 border-l-purple-500 flex flex-col justify-between h-72">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-mono text-purple-400 font-bold tracking-widest block">
                        {language === "ar" ? "قناة المدخل ب" : "Channel B"}
                      </span>
                      <h3 className="text-sm font-extrabold text-[#EDF2F7]">
                        {t.evTabUpload}
                      </h3>
                      <p className="text-[11px] text-muted">
                        {language === "ar" ? "توثيق بالتقارير المرفقة:" : "Validate with official physical documents:"}
                      </p>
                    </div>

                    <div 
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleFileDrop}
                      className="border border-dashed border-border/80 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-900/30 transition-colors relative"
                    >
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.png,.mp4" 
                        onChange={handleFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        id="document-uploader"
                      />
                      
                      {!uploadedFile ? (
                        <div className="space-y-1">
                          <Upload className="w-5 h-5 mx-auto text-purple-400 animate-bounce" />
                          <span className="text-[10px] text-slate-300 block leading-tight">
                            {t.evUploadPrompt}
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 justify-center text-emerald-400 text-[10px] font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{language === "ar" ? "تم قبول الوثيقة!" : "Document registered!"}</span>
                          </div>
                          <span className="text-[11px] text-slate-100 font-mono block truncate max-w-[200px] mx-auto">
                            {uploadedFile.name} ({uploadedFile.size})
                          </span>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setUploadedFile(null);
                            }}
                            className="text-[9px] text-rose-400 hover:underline mx-auto block cursor-pointer"
                          >
                            {language === "ar" ? "إزالة" : "Remove"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Choose Strength if file present */}
                    {uploadedFile && (
                      <div className="space-y-1 bg-slate-950 p-2 rounded-lg border border-purple-500/20">
                        <span className="text-[9px] text-muted block leading-tight">{t.evUploadStrength}</span>
                        <div className="grid grid-cols-3 gap-1" role="radiogroup" aria-label="Evidence authenticity tier">
                          {[
                            { val: "strong", label: language === "ar" ? "قوي" : "Strong" },
                            { val: "medium", label: language === "ar" ? "متوسط" : "Medium" },
                            { val: "weak", label: language === "ar" ? "ضعيف" : "Weak" }
                          ].map(tier => (
                            <label key={tier.val} className={`text-[9px] text-center p-1 rounded-md border text-slate-300 cursor-pointer transition-colors ${
                              docStrength === tier.val ? "bg-purple-950/40 border-purple-500 text-white" : "border-border/40 hover:border-slate-500"
                            }`}>
                              <input 
                                type="radio" 
                                name="doc-strength" 
                                value={tier.val} 
                                checked={docStrength === tier.val}
                                onChange={() => setDocStrength(tier.val)}
                                className="sr-only" 
                              />
                              <span>{tier.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Layer C: Interactive Simulation Camera */}
                  <div className="glass-card p-5 border-l-4 border-l-gold flex flex-col justify-between h-72">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono text-gold font-bold tracking-widest block">
                        {language === "ar" ? "قناة المدخل ج" : "Channel C"}
                      </span>
                      <h3 className="text-sm font-extrabold text-[#EDF2F7]">
                        {t.evTabCamera}
                      </h3>
                      <p className="text-[11px] text-muted leading-relaxed">
                        {language === "ar" ? "تحليل الكاميرا للالتزام بالحركة المشية." : "Video stance & postural gait capture analysis."}
                      </p>
                    </div>

                    {/* Camera simulation canvas trigger area */}
                    {!isCameraActive && (
                      <div className="space-y-2">
                        <button
                          onClick={triggerGaitCapture}
                          className="w-full py-3 px-2 bg-slate-950 hover:bg-slate-900 border border-gold/30 rounded-xl text-[10px] font-bold text-gold cursor-pointer flex items-center justify-center gap-2 transition-colors duration-200"
                        >
                          <Camera className="w-4 h-4 text-gold" />
                          <span>{t.evCamStartBtn}</span>
                        </button>
                        
                        {hasGaitAnalysis && (
                          <div className="text-center font-mono text-[9px] text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                            ✓ {language === "ar" ? "اكتمل المسح بنجاح! السير: " : "Gait resolved: "} {gaitMetrics.speed} m/s
                          </div>
                        )}
                      </div>
                    )}

                    {/* Active capture overlay */}
                    {isCameraActive && (
                      <div className="absolute inset-x-4 top-16 bottom-4 lg:inset-x-0 lg:top-0 lg:bottom-0 bg-black/95 z-50 rounded-2xl p-4 flex flex-col justify-between items-center text-center">
                        <div className="w-full flex justify-between items-center border-b border-border/40 pb-2">
                          <span className="text-[10px] font-bold text-cyan-300 animate-pulse flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
                            <span>{language === "ar" ? "مسح حركي تفاعلي..." : "Interpreting Gait Sequence..."}</span>
                          </span>
                          <button 
                            onClick={cancelGaitRecording}
                            className="p-1 rounded bg-white/10 hover:bg-white/25 text-white cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Simulation Hologram Visual block */}
                        <div className="relative w-full h-32 flex items-center justify-center overflow-hidden border border-border/30 rounded-lg bg-slate-950 mt-2">
                          {/* Animated Scanning Matrix Line */}
                          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-0 animate-scanningLine shadow-[0_0_10px_cyan]"></div>
                          
                          {/* Skeletal wireframe avatar silhouette */}
                          <svg viewBox="0 0 100 100" className="w-20 h-20 text-cyan-500/30 opacity-60">
                            <circle cx="50" cy="20" r="6" stroke="var(--primary)" strokeWidth="1.5" />
                            <line x1="50" y1="26" x2="50" y2="60" stroke="var(--primary)" strokeWidth="1.5" />
                            <line x1="50" y1="35" x2="35" y2="25" stroke="var(--primary)" strokeWidth="1.5" />
                            <line x1="50" y1="35" x2="65" y2="25" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" />
                            <line x1="50" y1="60" x2="40" y2="85" stroke="var(--primary)" strokeWidth="2" className="animate-pulse" />
                            <line x1="50" y1="60" x2="60" y2="85" stroke="var(--primary)" strokeWidth="2" />
                          </svg>

                          <div className="absolute inset-0 bg-radial from-transparent to-black" />
                        </div>

                        <span className="text-[10px] text-slate-300 font-bold block max-w-sm mt-2 leading-relaxed h-8">
                          {simulationLog}
                        </span>

                        <div className="w-full flex gap-2 mt-2">
                          <button 
                            onClick={cancelGaitRecording}
                            className="flex-1 py-1.5 bg-slate-900 border border-border rounded text-[9px] text-white cursor-pointer"
                          >
                            {language === "ar" ? "تراجع" : "Cancel"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Protocol Alert banner */}
                    <div className="border border-border p-2 rounded-lg bg-bg text-[9px] text-[#A0AEC0] italic leading-snug">
                      {t.gaitDisclaimer}
                    </div>

                  </div>

                </div>

                {/* 2D Metrics Gauges Display once completed */}
                {hasGaitAnalysis && (
                  <div className="animate-scaleUp p-5 rounded-2xl border border-border/80 bg-slate-950/40 space-y-4">
                    <h3 className="text-sm font-extrabold text-[#EDF2F7]">
                      {t.evCamMetricsTitle}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {[
                        { label: t.gaitSpeed, val: gaitMetrics.speed, unit: "m/s", max: 1.8, danger: gaitMetrics.speed < 0.8 },
                        { label: t.gaitCadence, val: gaitMetrics.cadence, unit: "spd", max: 150, danger: false },
                        { label: t.gaitSymmetry, val: gaitMetrics.symmetry, unit: "%", max: 30, danger: gaitMetrics.symmetry > 22 },
                        { label: t.gaitStride, val: gaitMetrics.length, unit: "m", max: 2.0, danger: false },
                        { label: t.gaitDoubleSupport, val: gaitMetrics.doubleSupport, unit: "%", max: 40, danger: false },
                        { label: t.gaitVariability, val: gaitMetrics.variability, unit: "%", max: 10, danger: gaitMetrics.variability > 4.5 }
                      ].map(g => {
                        // Angle calculation for 2D Gauges
                        const pct = Math.min(100, (g.val / g.max) * 100);
                        const radius = 24;
                        const circum = 2 * Math.PI * radius;
                        const strokeOffset = circum - (pct / 100) * circum;

                        return (
                          <div 
                            key={g.label} 
                            className="bg-slate-900/60 p-3 rounded-xl border border-border flex flex-col items-center text-center space-y-2"
                            id={`metric-dial-${g.unit}`}
                          >
                            <span className="text-[10px] text-muted block truncate w-full font-bold">{g.label}</span>
                            
                            {/* SVG circular gauge segment */}
                            <div className="relative w-14 h-14">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle 
                                  cx="28" 
                                  cy="28" 
                                  r={radius} 
                                  stroke="#243450" 
                                  strokeWidth="3.5" 
                                  fill="none" 
                                />
                                <circle 
                                  cx="28" 
                                  cy="28" 
                                  r={radius} 
                                  stroke={g.danger ? "#F87171" : "#06B6D4"} 
                                  strokeWidth="3.5" 
                                  fill="none" 
                                  strokeDasharray={circum}
                                  strokeDashoffset={strokeOffset}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-[11px] font-bold text-white leading-none">
                                <span>{g.val}</span>
                                <span className="text-[7px] text-slate-500 mt-0.5">{g.unit}</span>
                              </div>
                            </div>

                            <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full ${
                              g.danger 
                                ? "bg-red-400/10 text-red-300 border border-red-500/25" 
                                : "bg-emerald-500/5 text-emerald-400 border border-emerald-500/20"
                            }`}>
                              {g.danger ? t.metricsDanger : t.metricsNormal}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Evidence Blending summary index bar */}
                <div className="border-t border-border/40 pt-6 space-y-4">
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="space-y-1 text-center sm:text-right">
                      <span className="text-xs font-bold text-slate-300 block">{t.evBlendTitle}</span>
                      <p className="text-[10px] text-muted">
                        {language === "ar" 
                          ? "* يدوي/مستند يزن 100٪ مستقل، وبوجود الكاميرا تعيَّن التقدير: الكاميرا 70٪ والمستند 30٪." 
                          : "* Manual/Document weights 100% solo; in dual analytics: gait gets 70% and document average weights 30%."}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-sm justify-end">
                      <span className="text-xs font-mono text-muted whitespace-nowrap">{t.evStrengthScore}</span>
                      <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden border border-border/80 relative flex-grow max-w-[150px]">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${evidenceStrength}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold font-mono text-white">{evidenceStrength}%</span>
                    </div>
                  </div>

                  {evidenceStrength === 0 && (
                    <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-500/30 text-orange-200 text-xs flex gap-2 items-center">
                      <AlertTriangle className="w-5 h-5 text-gold flex-shrink-0" />
                      <span>{t.evErrorLabel}</span>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* STEP 4: Comprehensive Diagnostics & TrustIndex Conflict warning alerts */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-pulse" />
                    <span>{t.summaryTitle}</span>
                  </h2>
                  <p className="text-xs text-muted">
                    {t.summaryDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left Column: Summary Card */}
                  <div className="space-y-5">
                    
                    {/* File Professional Identity details */}
                    <div className="p-5 rounded-2xl border border-border bg-slate-900/30 space-y-3">
                      <h3 className="text-xs uppercase font-mono tracking-widest text-[#06B6D4] font-extrabold flex items-center gap-2 border-b border-border/40 pb-2">
                        <UserCheck className="w-4 h-4 text-primary" />
                        <span>{t.sumIdentity}</span>
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-950/60 rounded-xl border border-border/40">
                          <span className="text-muted block text-[10px] font-bold">{language === "ar" ? "الاسم المستهدف:" : "Candidate Name:"}</span>
                          <span className="text-white font-extrabold mt-0.5 block">{candName}</span>
                        </div>
                        <div className="p-3 bg-slate-950/60 rounded-xl border border-border/40">
                          <span className="text-muted block text-[10px] font-bold">{language === "ar" ? "نوع الحركة الرئيسي:" : "Locomotion Medium:"}</span>
                          <span className="text-white font-extrabold mt-0.5 block truncate">
                            {locomotionOptions.find(o => o.id === candLocomotion)?.name || candLocomotion}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-950/60 rounded-xl border border-border/40">
                          <span className="text-muted block text-[10px] font-bold">{language === "ar" ? "الخبرة المجمعة:" : "Years of Experience:"}</span>
                          <span className="text-white font-extrabold mt-0.5 block">{candExp ? `${candExp} ${language === "ar" ? "سنوات" : "Years"}` : "-"}</span>
                        </div>
                        <div className="p-3 bg-slate-950/60 rounded-xl border border-border/40">
                          <span className="text-muted block text-[10px] font-bold">{language === "ar" ? "المستوى الدراسي:" : "Highest Degree:"}</span>
                          <span className="text-white font-extrabold mt-0.5 block">
                            {candEdu === "bachelor" ? t.eduBachelor : candEdu === "postgrad" ? t.eduPostgrad : t.eduHighSchool}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* TrustIndex (using IIFE values computed above) */}
                    <div className="p-5 rounded-2xl border border-border bg-slate-900/30 space-y-4">
                      
                      <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
                        <div className="space-y-0.5">
                          <h3 className="text-xs uppercase font-mono tracking-widest text-gold font-extrabold">
                            {t.sumTrustIndex}
                          </h3>
                          <p className="text-[10px] text-muted max-w-xs">{t.sumTrustDesc}</p>
                        </div>

                        {/* Interactive trust badge */}
                        <div className={`p-4 rounded-xl border text-center font-mono ${
                          trustData.trustIndexValue >= 80 
                            ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400" 
                            : trustData.trustIndexValue >= 50 
                            ? "bg-amber-950/20 border-amber-500/30 text-amber-400" 
                            : "bg-red-950/30 border-red-500/35 text-red-400"
                        }`}>
                          <span className="text-xs font-bold block opacity-70">TRUST</span>
                          <span className="text-2xl font-black">{trustData.trustIndexValue}%</span>
                        </div>
                      </div>

                      {/* Conflict Detection UI block */}
                      {trustData.hasConflict && (
                        <div className="p-4 rounded-2xl border border-rose-500/40 bg-rose-950/20 text-rose-200 text-xs space-y-2 animate-pulse">
                          <div className="flex items-center gap-2 text-rose-400 font-extrabold">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <span>{t.sumConflictLabel}</span>
                          </div>
                          <p className="leading-relaxed text-[11px] font-bold">
                            {t.sumConflictDesc}
                          </p>
                        </div>
                      )}

                    </div>

                  </div>

                  {/* Right Column: Donut chart and View Toggle for capabilities */}
                  <div className="p-5 rounded-2xl border border-border bg-slate-900/35 flex flex-col justify-between">
                    
                    <div className="flex justify-between items-center border-b border-border/40 pb-3 mb-4">
                      <span className="text-xs font-bold text-slate-200">{t.sumCapabilities}</span>
                      
                      {/* Swappable Table/Chart View trigger click */}
                      <button 
                        onClick={() => setViewMode(prev => prev === "donut" ? "table" : "donut")}
                        className="px-3.5 py-1.5 border border-border text-[10px] font-bold rounded-lg hover:bg-white/5 text-gold flex items-center gap-1.5 transition-colors cursor-pointer"
                        id="toggle-summary-view"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>{t.sumToggleView}</span>
                      </button>
                    </div>

                    <div className="flex-grow flex items-center justify-center min-h-[220px]">
                      
                      {viewMode === "donut" ? (
                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center w-full">
                          
                          {/* Glowing custom SVG Donut segment counts */}
                          <div className="relative w-36 h-36">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                              <circle cx="50" cy="50" r="40" fill="none" stroke="#1E293B" strokeWidth="10" />
                              
                              {/* Slice 1: Can (Emerald) */}
                              {capabilityCategoryRatio.can > 0 && (
                                <circle 
                                  cx="50" 
                                  cy="50" 
                                  r="40" 
                                  fill="none" 
                                  stroke="#10B981" 
                                  strokeWidth="10" 
                                  strokeDasharray={`${(capabilityCategoryRatio.can / 15) * 251.2} 251.2`}
                                  strokeDashoffset="0"
                                />
                              )}

                              {/* Slice 2: Accommodations (Yellow) */}
                              {capabilityCategoryRatio.accom > 0 && (
                                <circle 
                                  cx="50" 
                                  cy="50" 
                                  r="40" 
                                  fill="none" 
                                  stroke="#F59E0B" 
                                  strokeWidth="10" 
                                  strokeDasharray={`${(capabilityCategoryRatio.accom / 15) * 251.2} 251.2`}
                                  strokeDashoffset={`-${(capabilityCategoryRatio.can / 15) * 251.2}`}
                                />
                              )}

                              {/* Slice 3: Cannot (Rose) */}
                              {capabilityCategoryRatio.cannot > 0 && (
                                <circle 
                                  cx="50" 
                                  cy="50" 
                                  r="40" 
                                  fill="none" 
                                  stroke="#EF4444" 
                                  strokeWidth="10" 
                                  strokeDasharray={`${(capabilityCategoryRatio.cannot / 15) * 251.2} 251.2`}
                                  strokeDashoffset={`-${((capabilityCategoryRatio.can + capabilityCategoryRatio.accom) / 15) * 251.2}`}
                                />
                              )}
                            </svg>
                            
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center leading-none">
                              <span className="text-2xl font-black text-white font-mono">15</span>
                              <span className="text-[8px] text-slate-500 uppercase font-mono mt-1 tracking-wider">Metrics</span>
                            </div>
                          </div>

                          {/* Legend box counts */}
                          <div className="text-xs space-y-2.5 font-sans">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                              <span className="text-slate-200">
                                {t.optionCan}: <strong className="font-mono text-sm ml-1">{capabilityCategoryRatio.can}</strong>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
                              <span className="text-slate-200">
                                {t.optionAccom}: <strong className="font-mono text-sm ml-1">{capabilityCategoryRatio.accom}</strong>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded bg-red-500 inline-block" />
                              <span className="text-slate-200">
                                {t.optionCannot}: <strong className="font-mono text-sm ml-1">{capabilityCategoryRatio.cannot}</strong>
                              </span>
                            </div>
                          </div>

                        </div>
                      ) : (
                        /* Compact Detail Rows view */
                        <div className="w-full max-h-56 overflow-y-auto space-y-1.5 pr-2 pl-2">
                          {capabilitiesKeys.map(c => {
                            let statusVal = "can";
                            if (candIsFluctuating) {
                              // evaluate compound or display good/bad day
                              statusVal = capabilitiesGoodDay[c.id] || "can";
                            } else {
                              statusVal = capabilities[c.id] || "can";
                            }

                            return (
                              <div key={c.id} className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-border/40 text-[11px]">
                                <span className="text-slate-300 truncate max-w-[210px]">{c.name}</span>
                                
                                {candIsFluctuating ? (
                                  <div className="flex gap-1">
                                    <span className="text-[9px] bg-cyan-950 text-cyan-400 px-1 py-0.5 rounded">
                                      Good: {capabilitiesGoodDay[c.id] === "can" ? "✓" : capabilitiesGoodDay[c.id] === "accom" ? "◈" : "✗"}
                                    </span>
                                    <span className="text-[9px] bg-rose-950 text-rose-400 px-1 py-0.5 rounded">
                                      Bad: {capabilitiesBadDay[c.id] === "can" ? "✓" : capabilitiesBadDay[c.id] === "accom" ? "◈" : "✗"}
                                    </span>
                                  </div>
                                ) : (
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                    statusVal === "can" 
                                      ? "bg-emerald-500/10 text-emerald-400" 
                                      : statusVal === "accom" 
                                      ? "bg-amber-500/10 text-amber-400" 
                                      : "bg-red-500/10 text-red-500"
                                  }`}>
                                    {statusVal === "can" ? t.optionCan : statusVal === "accom" ? t.optionAccom : t.optionCannot}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                    </div>

                  </div>

                </div>

                {/* Final placement ready banner */}
                <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/15 select-none space-y-1">
                  <span className="text-sm font-black text-emerald-300 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{t.sumReadyBanner}</span>
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    {t.sumReadyDesc}
                  </p>
                </div>

              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </div>

      {/* 4. Next/Prev Navigation Row */}
      <footer className="flex flex-row justify-between items-center border-t border-border/60 pt-6">
        <div>
          {currentStep > 1 && (
            <button
              onClick={handlePrevStep}
              className="px-6 py-3 border border-border rounded-xl text-sm font-bold text-slate-300 hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4 rtl:scale-x-[-1]" />
              <span>{currentStep === 2 ? `${t.btnPrev}: ${t.step1}` : currentStep === 3 ? `${t.btnPrev}: ${t.step2}` : `${t.btnPrev}: ${t.step3}`}</span>
            </button>
          )}
        </div>

        <div>
          {currentStep < 4 ? (
            <button
              onClick={handleNextStep}
              disabled={currentStep === 3 && evidenceStrength === 0}
              className={`px-8 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300 flex items-center gap-2 ${
                currentStep === 3 && evidenceStrength === 0
                  ? "bg-slate-800 text-slate-500 border border-border/45 cursor-not-allowed opacity-50"
                  : "bg-primary hover:bg-primary-h hover:scale-[1.01] shadow-xl shadow-primary/10 cursor-pointer"
              }`}
            >
              <span>{currentStep === 1 ? `${t.btnNext}: ${t.step2}` : currentStep === 2 ? `${t.btnNext}: ${t.step3}` : `${t.btnNext}: ${t.step4}`}</span>
              <ChevronLeft className="w-4 h-4 rtl:scale-x-[-1]" />
            </button>
          ) : (
            <button
              onClick={handleFinishWizard}
              className="px-8 py-3.5 bg-primary hover:bg-primary-h hover:scale-[1.01] shadow-xl shadow-primary/20 text-sm font-bold text-white rounded-xl flex items-center gap-2 cursor-pointer transition-all animate-pulse"
            >
              <FileCheck2 className="w-5 h-5 text-cyan-300" />
              <span>{t.btnFinish}</span>
            </button>
          )}
        </div>
      </footer>

    </div>
  );
}
