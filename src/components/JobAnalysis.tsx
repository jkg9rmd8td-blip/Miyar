import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  motion,
  AnimatePresence
} from "motion/react";
import { AuditChain } from "../utils/AuditChain";
import {
  Building2,
  Scale,
  Activity,
  Layers,
  Cpu,
  Sliders,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle2,
  Info,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  DollarSign,
  HelpCircle,
  FileCheck2,
  Wrench
} from "lucide-react";

// The 15 Universal Accessibility & Support guidelines (aligning with CandidateAssessment)
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

// Unified weights dictionary for the 5 scenario types
const SCENARIO_WEIGHTS = {
  cognitive: { tasks: .25, env: .15, evidence: .30, accommodation: .18, financial: .12 },
  physical: { tasks: .40, env: .25, evidence: .15, accommodation: .12, financial: .08 },
  service: { tasks: .28, env: .20, evidence: .22, accommodation: .18, financial: .12 },
  compliance: { tasks: .22, env: .15, evidence: .38, accommodation: .15, financial: .10 },
  hybrid: { tasks: .30, env: .20, evidence: .20, accommodation: .15, financial: .15 }
};

interface ScenarioWeights {
  tasks: number;
  env: number;
  evidence: number;
  accommodation: number;
  financial: number;
}

// Fixed Professional suggestions for Critical Tasks based on scenario
const PRESET_CRITICAL_TASKS = {
  cognitive: [
    { name_ar: "تحليل البيانات البرمجية وإعداد التقارير الفنية", name_en: "Software Data Analysis & Technical Reporting", physical_demand: false, caps: ["keyboard", "mouse", "sit_4h"] },
    { name_ar: "صياغة المخطط التوجيهي وتطوير النظم الرقمية", name_en: "Drafting System Architectural Blueprints", physical_demand: false, caps: ["keyboard", "sit_4h"] },
    { name_ar: "مراجعة المستندات التعاقدية والحسابات المالية بدقة", name_en: "Reviewing Contractural and Financial Documents", physical_demand: false, caps: ["writing", "sit_4h"] }
  ],
  physical: [
    { name_ar: "تجهيز وتغليف الشحنات بمركز الخدمات اللوجستية", name_en: "Preparing & Packaging Logistics Shipments", physical_demand: true, caps: ["both_hands", "carry_light", "stand_30m", "bend_reach"] },
    { name_ar: "فرز وتصنيف الأجزاء الصناعية الخفيفة بموقع الإنتاج", name_en: "Sorting & Classifying Light Components on Site", physical_demand: true, caps: ["both_hands", "carry_light", "stand_30m"] },
    { name_ar: "تنظيم الأرشيف الملفي اليدوي وترتيب وثائق المنشأة", name_en: "Organizing Physical Document Archives", physical_demand: true, caps: ["carry_light", "indoor_nav", "bend_reach"] }
  ],
  service: [
    { name_ar: "استقبل استفسارات العملاء بصالة الاستقبال الرئيسية", name_en: "Receiving Customer Queries in Front Desk", physical_demand: false, caps: ["keyboard", "indoor_nav", "sit_4h"] },
    { name_ar: "إدارة وتوجيه حركة المراجعين بمركز الرعاية الشاملة", name_en: "Guiding Visitor Flow In Care Center", physical_demand: true, caps: ["indoor_nav", "walk_50m", "stand_30m"] },
    { name_ar: "تقديم الدعم الفني المباشر بالصالات الرقمية", name_en: "Providing On-Floor Customer Facilitation Support", physical_demand: false, caps: ["keyboard", "sit_4h", "indoor_nav"] }
  ],
  compliance: [
    { name_ar: "التدقيق الهندسي وميدان مراجعة كود البناء السعودي", name_en: "Engineering Audit & Saudi Building Code Evaluation", physical_demand: true, caps: ["writing", "indoor_nav", "walk_50m", "bend_reach"] },
    { name_ar: "مراقبة سجلات الجودة الوقائية والسلامة المهنية", name_en: "Monitoring Safety Logs & Quality Criteria On Floor", physical_demand: false, caps: ["keyboard", "indoor_nav", "sit_4h"] },
    { name_ar: "فحص التقارير التنظيمية السنوية وحوكمة سجلات العمل", name_en: "Reviewing Compliance Records & Operational Ledger Documents", physical_demand: false, caps: ["keyboard", "writing", "sit_4h"] }
  ],
  hybrid: [
    { name_ar: "التصميم الفني للمحتوى الرقمي التسويقي", name_en: "Digital Content Design for Campaign Portals", physical_demand: false, caps: ["keyboard", "mouse", "sit_4h"] },
    { name_ar: "عقد الاجتماعات الفنية والتشغيلية المباشرة والافتراضية", name_en: "Conducting Operations Sync Meetings digitally", physical_demand: false, caps: ["keyboard", "sit_4h"] },
    { name_ar: "إدخال المعاملات الرقمية بنظام إدارة كفاءة الموارد السحابي", name_en: "Cloud Portal Core Transaction & Resource Entry", physical_demand: false, caps: ["keyboard", "sit_4h"] }
  ]
};

// Fixed Suggestions for Flexible Tasks
const PRESET_FLEXIBLE_TASKS = {
  cognitive: [
    { name_ar: "المشاركة التشاورية لتقييم الأفكار ربع السنوية", name_en: "Interactive Advisory Ideation", flexibility_type: "flexible_scheduling", physical_demand: false, caps: ["sit_4h"] },
    { name_ar: "إلقاء محاضرات الوعي التقني لمنتسبي الكفاءات", name_en: "Instructing Technical Workshops", flexibility_type: "partial_modification", physical_demand: false, caps: ["keyboard", "sit_4h"] }
  ],
  physical: [
    { name_ar: "تعديل أزمنة التسليم للشحنات غير المستعجلة", name_en: "Adjusting Delivery Timelines of Low Priority Goods", flexibility_type: "flexible_scheduling", physical_demand: true, caps: ["carry_light", "indoor_nav"] },
    { name_ar: "استخدام عربة رافعة هيدروليكية ومساعدة في التحريك", name_en: "Using Hydraulic Lifting Trolley Helpers", flexibility_type: "technical_alternative", physical_demand: false, caps: ["both_hands", "indoor_nav"] }
  ],
  service: [
    { name_ar: "مساندة الزملاء بقسم المحادثات البرمجية الفورية", name_en: "Backing client messaging channels", flexibility_type: "full_delegation", physical_demand: false, caps: ["keyboard", "sit_4h"] },
    { name_ar: "الرد الهاتفي الذكي الموزع لتخفيف السير الميداني", name_en: "Handling Smart Remote Helpdesk Line Support", flexibility_type: "technical_alternative", physical_demand: false, caps: ["keyboard", "sit_4h"] }
  ],
  compliance: [
    { name_ar: "إسناد الزيارات البعيدة خارج المنطقة لمدقق مساعد", name_en: "Delegating far physical audits to associate inspectors", flexibility_type: "full_delegation", physical_demand: false, caps: ["driving"] },
    { name_ar: "المراجعة المكتبية المتأخرة لتراخيص كود البناء", name_en: "Late office-based inspection checks of SBC drafts", flexibility_type: "flexible_scheduling", physical_demand: false, caps: ["keyboard", "sit_4h"] }
  ],
  hybrid: [
    { name_ar: "التنظيم الرقمي لملفات مشاريع الإدارة المتعددة", name_en: "Virtual database and assets folders maintenance", flexibility_type: "technical_alternative", physical_demand: false, caps: ["keyboard", "sit_4h"] },
    { name_ar: "صياغة المذكرات التعريفية للحلول التشغيلية الهجينة", name_en: "Writing digital workflow handbooks", flexibility_type: "flexible_scheduling", physical_demand: false, caps: ["keyboard", "sit_4h"] }
  ]
};

// Spatial accessibility elements (Step 4)
const SPATIAL_ELEMENTS = {
  ar: [
    { key: "ramp", name: "١. المنحدرات والمداخل الخارجية", desc: "تسهيل وصول الكراسي والأجهزة من المواقف للمدخل الرئيسي" },
    { key: "parking_mark", name: "٢. أرصفة ومواقف ذوي الإعاقة", desc: "مواقف مهيئة مخططة باللون الأصفر مع مسار خروج واسع" },
    { key: "elevator", name: "٣. المصاعد المهيأة للخدمة", desc: "أزرار منخفضة، لوحات برايل، وإشارات صوتية" },
    { key: "corridor", name: "٤. الممرات والأبواب الداخلية", desc: "ممرات واسعة ومقابض سهلة الالتواء للمستفيد" },
    { key: "desk_adjust", name: "٥. المحطة والمكتب المخصص", desc: "مكتب قابل لتعديل الارتفاع ومفرغ بالأسفل للمناورة المريحة" },
    { key: "restroom_mod", name: "٦. دورات المياه المهيأة بالكامل", desc: "مساحة التفاف كافية، مقابض مساعدة، وباب يفتح للخارج" },
    { key: "door_auto", name: "٧. أبواب طوارئ ومخارج منزلقة التلقائية", desc: "أبواب ذكية ذات فتح آلي مرن ومجال هروب آمن وبلا درجة" },
    { key: "software", name: "٨. أدوات برمجية مساعدة وبيئة عمل مريحة", desc: "تطبيقات قارئ شاشة أو تجهيزات تقنية ملائمة للمديري" }
  ],
  en: [
    { key: "ramp", name: "1. Main Entrance & Ramp", desc: "Ramp slopes and clear access lanes from parking areas to the gate" },
    { key: "parking_mark", name: "2. ADA Parking & Signage", desc: "Correctly scaled parking spots with yellow ground lines and access path" },
    { key: "elevator", name: "3. Accessible Elevator", desc: "Low-reach control panels, tactile braille, and audible alarms" },
    { key: "corridor", name: "4. Corridors & Main Openings", desc: "1.5m turning clearances and non-slip level floor surfaces" },
    { key: "desk_adjust", name: "5. Fully Ergonomic Workspace", desc: "Under-desk knee clearance and mechanical/electrical height adjustments" },
    { key: "restroom_mod", name: "6. Completely ADA Restroom", desc: "Safe support handles, 1.5m turning diameter, and light swing doors" },
    { key: "door_auto", name: "7. Automated Emergency Exits", desc: "Flash indicators, zero-step safe-zones, and automated push bars" },
    { key: "software", name: "8. Assistive Workplace Tech & Software", desc: "Adaptive text readers, visual signals, and customized digital suites" }
  ]
};

// Accommodation pricing catalog (Low, Mid, High in SAR)
const ACCOMMODATION_CATALOG: Record<string, { low: number; mid: number; high: number }> = {
  ramp: { low: 6000, mid: 9000, high: 15000 },
  desk_adjust: { low: 2500, mid: 4500, high: 7000 },
  restroom_mod: { low: 15000, mid: 22000, high: 35000 },
  parking_mark: { low: 800, mid: 1500, high: 3000 },
  door_auto: { low: 4000, mid: 7000, high: 12000 },
  ergonomic: { low: 1500, mid: 3000, high: 6000 },
  transport: { low: 0, mid: 500, high: 1200 },
  software: { low: 0, mid: 800, high: 2500 }
};

interface Task {
  id: string;
  name: string;
  physicalDemand: boolean;
  isCritical: boolean;
  capabilityIds: string[];
  flexibilityType?: string; // only for flexible tasks
}

interface JobAnalysisProps {
  language: "ar" | "en";
  onCancel: () => void;
  onComplete: (data: any) => void;
  keyboardFirstMode?: boolean;
}

export function JobAnalysis({ language, onCancel, onComplete, keyboardFirstMode = false }: JobAnalysisProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [liveAnnouncement, setLiveAnnouncement] = useState("");

  // Setup form states (Step 1)
  const [jobTitle, setJobTitle] = useState("أخصائي علاقات عملاء مميز");
  const [deptName, setDeptName] = useState("إدارة علاقات المستفيدين والامتثال البيئي");
  const [facilityName, setFacilityName] = useState("الشركة السعودية لحلول الأعمال والاتصالات");
  const [facilityType, setFacilityType] = useState("semi_gov"); // private, public, semi_gov
  const [scenario, setScenario] = useState<"cognitive" | "physical" | "service" | "compliance" | "hybrid">("cognitive");
  const [weights, setWeights] = useState<ScenarioWeights>(SCENARIO_WEIGHTS.cognitive);

  // States for focus card in Scenario (Step 1) to trigger weights view on hover/focus
  const [focusedScenario, setFocusedScenario] = useState<string | null>(null);

  // Interactive Tasks list (Step 2 & 3)
  const [criticalTasks, setCriticalTasks] = useState<Task[]>(() => {
    // default presets for cognitive scenario initially
    return PRESET_CRITICAL_TASKS.cognitive.map((t, idx) => ({
      id: `crit_${idx}`,
      name: t.name_ar,
      physicalDemand: t.physical_demand,
      isCritical: true,
      capabilityIds: t.caps
    }));
  });

  const [flexibleTasks, setFlexibleTasks] = useState<Task[]>(() => {
    // default presets for cognitive scenario initially
    return PRESET_FLEXIBLE_TASKS.cognitive.map((t, idx) => ({
      id: `flex_${idx}`,
      name: t.name_ar,
      physicalDemand: t.physical_demand,
      isCritical: false,
      capabilityIds: t.caps,
      flexibilityType: t.flexibility_type
    }));
  });

  // Entry temporary state for adding/editing a Critical Task
  const [newCritName, setNewCritName] = useState("");
  const [newCritPhysical, setNewCritPhysical] = useState(false);
  const [newCritCaps, setNewCritCaps] = useState<string[]>([]);
  const [critFormError, setCritFormError] = useState("");

  // Entry temporary state for adding/editing a Flexible Task
  const [newFlexName, setNewFlexName] = useState("");
  const [newFlexPhysical, setNewFlexPhysical] = useState(false);
  const [newFlexCaps, setNewFlexCaps] = useState<string[]>([]);
  const [newFlexType, setNewFlexType] = useState("partial_modification"); // full_delegation, partial_modification, technical_alternative, flexible_scheduling
  const [flexFormError, setFlexFormError] = useState("");

  // Step 4: Accommodations selected tiers (0 = None, 1 = Low, 2 = Mid, 3 = High)
  const [spatialAccommodations, setSpatialAccommodations] = useState<Record<string, number>>({
    ramp: 0,
    parking_mark: 0,
    elevator: 0,
    corridor: 0,
    desk_adjust: 0,
    restroom_mod: 0,
    door_auto: 0,
    software: 0
  });

  const [rampSlopeValue, setRampSlopeValue] = useState(12);

  const [funderMap, setFunderMap] = useState<Record<string, "hadaf" | "employer">>({
    ramp: "employer",
    parking_mark: "employer",
    elevator: "employer",
    corridor: "employer",
    desk_adjust: "hadaf",
    restroom_mod: "employer",
    door_auto: "employer",
    software: "hadaf"
  });

  // Calculate Weights and update when scenario changes
  useEffect(() => {
    setWeights(SCENARIO_WEIGHTS[scenario]);
    // Pre-populate tasks matching the scenario to make it highly immersive & coherent
    const presetsCrit = PRESET_CRITICAL_TASKS[scenario] || [];
    setCriticalTasks(presetsCrit.map((t, idx) => ({
      id: `crit_${scenario}_${idx}`,
      name: language === "ar" ? t.name_ar : t.name_en,
      physicalDemand: t.physical_demand,
      isCritical: true,
      capabilityIds: t.caps
    })));

    const presetsFlex = PRESET_FLEXIBLE_TASKS[scenario] || [];
    setFlexibleTasks(presetsFlex.map((t, idx) => ({
      id: `flex_${scenario}_${idx}`,
      name: language === "ar" ? t.name_ar : t.name_en,
      physicalDemand: t.physical_demand,
      isCritical: false,
      capabilityIds: t.caps,
      flexibilityType: t.flexibility_type
    })));

    // announce to screenreader
    const msg = language === "ar" 
      ? `تم تغيير سيناريو الوظيفة إلى "${getScenarioNameAr(scenario)}". وتم تحديث أوزان المطابقة والمهام المقترحة آلياً.`
      : `Job analysis scenario switched to ${scenario}. Accommodation weights and suggestions updated accordingly.`;
    triggerAnnouncement(msg);
  }, [scenario, language]);

  // Assistive announcer
  const triggerAnnouncement = (msg: string) => {
    setLiveAnnouncement(msg);
    setTimeout(() => setLiveAnnouncement(""), 3500);
  };

  function getScenarioNameAr(sc: string) {
    switch (sc) {
      case "cognitive": return "إدراكي وذهني";
      case "physical": return "بدني وحركي";
      case "service": return "خدمات وصالات مستفيدين";
      case "compliance": return "رقابة وامتثال بيئي";
      case "hybrid": return "عمل مكتبي وهجين";
      default: return sc;
    }
  }

  // Derived state calculations (for real-time anomaly calculation)
  const totalTasksCount = criticalTasks.length + flexibleTasks.length;
  const criticalTasksCount = criticalTasks.length;
  const physicalDemandTasksCount = useMemo(() => {
    const critPhys = criticalTasks.filter(t => t.physicalDemand).length;
    const flexPhys = flexibleTasks.filter(t => t.physicalDemand).length;
    return critPhys + flexPhys;
  }, [criticalTasks, flexibleTasks]);

  // Anomaly Failsafes and Checks
  // Check 1: criticalTasks/totalTasks > 0.75 -> Warn "نسبة المهام الحرجة مرتفعة"
  const isHighCriticalRatio = useMemo(() => {
    if (totalTasksCount === 0) return false;
    return (criticalTasksCount / totalTasksCount) > 0.75;
  }, [criticalTasksCount, totalTasksCount]);

  // Check 2: scenario !== 'physical' and physicalDemandTasks/totalTasks > 0.90 -> STRICT EXPLOIT LOCK
  const isFraudCircumventionTriggered = useMemo(() => {
    if (totalTasksCount === 0) return false;
    if (scenario === "physical") return false;
    return (physicalDemandTasksCount / totalTasksCount) > 0.90;
  }, [scenario, physicalDemandTasksCount, totalTasksCount]);

  // Step 4: Accommodation metrics
  const HIGH_RISK_THRESHOLD_SAR = 20000;

  const currentAccommodationsList = useMemo(() => {
    return Object.entries(spatialAccommodations).map(([key, value]) => {
      const prices = ACCOMMODATION_CATALOG[key] || { low: 0, mid: 0, high: 0 };
      let cost = 0;
      let labelAr = "بدون تكلفة";
      let labelEn = "No accommodation";
      
      if (value === 1) {
        cost = prices.low;
        labelAr = "تهيئة أساسية";
        labelEn = "Basic accommodation";
      } else if (value === 2) {
        cost = prices.mid;
        labelAr = "تهيئة متوسطة";
        labelEn = "Medium accommodation";
      } else if (value === 3) {
        cost = prices.high;
        labelAr = "تهيئة شاملة";
        labelEn = "Comprehensive adjustment";
      }

      return {
        key,
        level: value,
        costLow: value === 0 ? 0 : prices.low,
        costHigh: value === 0 ? 0 : prices.high,
        currentCost: cost,
        labelAr,
        labelEn,
        nameAr: SPATIAL_ELEMENTS.ar.find(e => e.key === key)?.name || key,
        nameEn: SPATIAL_ELEMENTS.en.find(e => e.key === key)?.name || key,
        maxCostPossible: prices.high,
        isHighRisk: Number(prices.high) > HIGH_RISK_THRESHOLD_SAR && Number(value) > 0
      };
    });
  }, [spatialAccommodations]);

  const totalCostLowSum = useMemo(() => {
    return currentAccommodationsList.reduce((acc, curr) => acc + curr.costLow, 0);
  }, [currentAccommodationsList]);

  const totalCostHighSum = useMemo(() => {
    return currentAccommodationsList.reduce((acc, curr) => acc + curr.costHigh, 0);
  }, [currentAccommodationsList]);

  // Trigger live aggregate cost announcement
  const prevTotalCostRef = useRef(0);
  useEffect(() => {
    const currentTotal = totalCostHighSum;
    if (currentTotal !== prevTotalCostRef.current) {
      prevTotalCostRef.current = currentTotal;
      const msg = language === "ar" 
        ? `حساب تكلفة التعديلات البيئية: يتراوح نطاق التكلفة الحالي بين ${totalCostLowSum} و ${totalCostHighSum} ريال سعودي.`
        : `Accommodation cost calculation: current range spans SAR ${totalCostLowSum} to SAR ${totalCostHighSum}.`;
      triggerAnnouncement(msg);
    }
  }, [totalCostLowSum, totalCostHighSum, language]);

  // Check if any element represents high-risk high cost
  const containsHighRiskAccommodations = useMemo(() => {
    return currentAccommodationsList.some(item => item.isHighRisk);
  }, [currentAccommodationsList]);

  // Add a critical task helper
  const handleAddCriticalTask = () => {
    if (!newCritName.trim()) {
      setCritFormError(language === "ar" ? "يرجى تحديد أو صياغة مسمى للمهمة" : "Task name cannot be empty");
      return;
    }
    if (newCritCaps.length === 0) {
      setCritFormError(language === "ar" ? "يجب اختيار قدرة حركية واحدة على الأقل مرتبطة بالمهمة لضمان التحقق الرياضي" : "At least one physical capability alignment is required");
      return;
    }

    const newTask: Task = {
      id: `crit_custom_${Date.now()}`,
      name: newCritName,
      physicalDemand: newCritPhysical,
      isCritical: true,
      capabilityIds: newCritCaps
    };

    setCriticalTasks([...criticalTasks, newTask]);
    setNewCritName("");
    setNewCritPhysical(false);
    setNewCritCaps([]);
    setCritFormError("");

    triggerAnnouncement(
      language === "ar" ? `تم تسجيل المهمة الحرجة "${newTask.name}" بنجاح` : `Critical task "${newTask.name}" added successfully`
    );
  };

  // Add a flexible task helper
  const handleAddFlexibleTask = () => {
    if (!newFlexName.trim()) {
      setFlexFormError(language === "ar" ? "يرجى تحديد أو صياغة مسمى للمهمة المرنة" : "Task name cannot be empty");
      return;
    }
    if (newFlexCaps.length === 0) {
      setFlexFormError(language === "ar" ? "يجب اختيار قدرة حركية واحدة على الأقل مرتبطة بالمهمة لضمان التحقق المتبادل" : "At least one physical capability alignment is required");
      return;
    }

    const newTask: Task = {
      id: `flex_custom_${Date.now()}`,
      name: newFlexName,
      physicalDemand: newFlexPhysical,
      isCritical: false,
      capabilityIds: newFlexCaps,
      flexibilityType: newFlexType
    };

    setFlexibleTasks([...flexibleTasks, newTask]);
    setNewFlexName("");
    setNewFlexPhysical(false);
    setNewFlexCaps([]);
    setFlexFormError("");

    triggerAnnouncement(
      language === "ar" ? `تم تسجيل المهمة المرنة "${newTask.name}" بنجاح` : `Flexible task "${newTask.name}" added successfully`
    );
  };

  // Delete helpers
  const handleDeleteCritTask = (id: string) => {
    setCriticalTasks(criticalTasks.filter(t => t.id !== id));
    triggerAnnouncement(language === "ar" ? "تمت إزالة المهمة الحرجة" : "Critical task removed");
  };

  const handleDeleteFlexTask = (id: string) => {
    setFlexibleTasks(flexibleTasks.filter(t => t.id !== id));
    triggerAnnouncement(language === "ar" ? "تمت إزالة المهمة المرنة" : "Flexible task removed");
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      if (currentStep + 1 > maxStep) setMaxStep(currentStep + 1);
      triggerAnnouncement(language === "ar" ? `الانتقال للخطوة ${currentStep + 1}` : `Moved to step ${currentStep + 1}`);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      triggerAnnouncement(language === "ar" ? `الرجوع للخطوة ${currentStep - 1}` : `Returned to step ${currentStep - 1}`);
    }
  };

  // Finish analysis and output data to main App orchestrator
  const handleIssueReport = () => {
    if (isFraudCircumventionTriggered) {
      triggerAnnouncement(
        language === "ar" 
          ? "تنبيه حرج لحوكمة التوظيف: تم حجب إصدار التقرير مؤقتًا لتجاوز نسبة المهام البدنية المسموح بها في هذا السيناريو. يرجى مراجعتها أولاً."
          : "Locked: Anti-circumvention check failed. High ratio of physical tasks in non-physical scenario."
      );
      return;
    }

    // Assemble final output matching state specifications of Miyar Platform
    const finalReportData = {
      title: jobTitle,
      facilityName,
      facilityType,
      scenario,
      criticalTasks,
      flexibleTasks,
      workspaceSpecs: {
        totalTasksCount,
        criticalTasksCount,
        physicalRatio: totalTasksCount > 0 ? (physicalDemandTasksCount / totalTasksCount) : 0,
        rampSlopeRatio: rampSlopeValue,
      },
      accommodations: currentAccommodationsList,
      totalAccomCost: totalCostHighSum,
      funderMap,
      suitabilityIndexPercentage: Math.max(25, Math.min(95, 95 - (physicalDemandTasksCount * 8) - (containsHighRiskAccommodations ? 15 : 0)))
    };

    // Record job_analysis_completed
    AuditChain.recordAuditStep("job_analysis_completed", {
      title: jobTitle,
      facilityName,
      scenario,
      criticalTasksCount,
      totalCostHighSum,
      timestamp: Date.now()
    }).catch(err => console.error("Error logging job_analysis_completed:", err));

    onComplete(finalReportData);
  };

  return (
    <div id="job-analysis-container" className="space-y-8 pb-12">
      {/* Screen reader live notifications */}
      <div className="sr-only" aria-live="assertive" role="alert">
        {liveAnnouncement}
      </div>

      {/* Screen Title & Header Card */}
      <div className="glass-card p-6 md:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5Spec">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-gold text-xs font-bold leading-none">
              <Building2 className="w-3.5 h-3.5" />
              <span>{language === "ar" ? "الشاشة الثانية · موازنة متطلبات بيئة الوظيفة المستهدفة" : "Screen 2 · Workspace Environment Matching"}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {language === "ar" ? "تحليل ومطابقة المتطلبات الهندسية للوظيفة" : "Architectural & Job Demands Analysis"}
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              {language === "ar" 
                ? "تقييم أطوار العمل، صياغة المهام الحرجة والمرنة، مطابقة التعديلات البيئية بكود البناء السعودي مع حوكمة تقدير التكلفة وتجنب تحايل المهام البدنية."
                : "Evaluate operational tasks, formulate flexible duties, align adaptations with Saudi Building Code constraints, and execute financial compliance checks."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-slate-700 hover:border-slate-500 rounded-xl text-xs font-bold text-slate-300 transition-luxury"
            >
              {language === "ar" ? "إلغاء والرجوع" : "Cancel and Back"}
            </button>
          </div>
        </div>

        {/* 5-Steps Circular Indicator for Wizard */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="grid grid-cols-5 gap-2 md:gap-4">
            {[
              { num: 1, nameAr: "١. التعريف والسيناريو", nameEn: "1. Definition" },
              { num: 2, nameAr: "٢. المهام الحرجة", nameEn: "2. Critical Tasks" },
              { num: 3, nameAr: "٣. المهام المرنة", nameEn: "3. Flexible Tasks" },
              { num: 4, nameAr: "٤. الترتيبات والتكلفة", nameEn: "4. Accommodations" },
              { num: 5, nameAr: "٥. الملخص والنتيجة", nameEn: "5. Final Summary" }
            ].map((step, idx) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <button
                  key={step.num}
                  disabled={step.num > maxStep}
                  onClick={() => {
                    setCurrentStep(step.num);
                    triggerAnnouncement(language === "ar" ? `الانتقال للخطوة ${step.num}` : `Switched to step ${step.num}`);
                  }}
                  className={`relative text-center py-3 px-1 md:px-2 rounded-xl border flex flex-col items-center justify-center transition-luxury cursor-pointer disabled:cursor-not-allowed ${
                    isActive 
                      ? "bg-primary/25 border-primary text-white font-extrabold focus:ring-2 focus:ring-primary" 
                      : isPast
                        ? "bg-emerald-950/25 border-emerald-900 text-emerald-400 font-bold"
                        : "bg-slate-900/60 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 font-mono ${
                    isActive ? "bg-primary text-white" : isPast ? "bg-emerald-500 text-bg" : "bg-slate-800 text-slate-400"
                  }`}>
                    {step.num}
                  </div>
                  <span className="text-[10px] md:text-xs truncate max-w-full">
                    {language === "ar" ? step.nameAr : step.nameEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main id="main-content" className="outline-none">
        <AnimatePresence mode="wait">
          {/* STEP 1: Definition & Scenario Card */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="glass-card p-6 md:p-8 space-y-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span>{language === "ar" ? "الخطوة ١: معلومات الوظيفة وصنف السيناريو المعتمد" : "Step 1: Job Identity & Selection Scenario"}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black tracking-wide text-slate-300">
                      {language === "ar" ? "المسمى الوظيفي المعتمد بالمنشأة (سلك العمل القانوني):" : "Official Job Title:"}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-primary transition-colors outline-none font-bold"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black tracking-wide text-slate-300">
                      {language === "ar" ? "القسم / الإدارة التابعة لها الوظيفة بمقر العمل:" : "Department / Operation Group:"}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-primary transition-colors outline-none"
                      value={deptName}
                      onChange={(e) => setDeptName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black tracking-wide text-slate-300">
                      {language === "ar" ? "اسم صاحب العمل / المنشأة المقررة للعقد المشروط:" : "Employer / Enterprise Name:"}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-primary transition-colors outline-none"
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black tracking-wide text-slate-300">
                      {language === "ar" ? "صنف ونطاق حجم المنشأة قانونياً:" : "Entity Classification Type:"}
                    </label>
                    <select
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-primary transition-colors outline-none font-bold"
                      value={facilityType}
                      onChange={(e) => setFacilityType(e.target.value)}
                    >
                      <option value="private">{language === "ar" ? "منشأة قطاع خاص كبرى (امتثال كامل)" : "Major Private Enterprise"}</option>
                      <option value="semi_gov">{language === "ar" ? "مؤسسة شبه حكومية / تنظيم مرن" : "Semi-Government / Broad Organization"}</option>
                      <option value="public">{language === "ar" ? "جهة حكومية / ممتثلة لكود الوصول الشامل" : "Public Government Hub / Universal Access compliant"}</option>
                    </select>
                  </div>
                </div>

                {/* Scenario Grid 2x3 */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black tracking-wide text-slate-300 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-gold" />
                      <span>{language === "ar" ? "محدد السيناريو المهني لبيئة التوظيف (شبكة موازنة الأوزان ٢×٣):" : "Job Role Scenario Category (2x3 Balance Grid):"}</span>
                    </label>
                    <p className="text-xs text-slate-400">
                      {language === "ar" 
                        ? "اختر السيناريو المناسب للوظيفة؛ يعتمد محرك المطابقة أوزاناً متفاوتة لكل صنف لضمان حوكمة التقييم."
                        : "Select the specific pattern representing the job. Every scenario enforces tailored compliance weights."}
                    </p>
                  </div>

                  {/* 2x3 Grid with focus and hover weights preview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="radiogroup" aria-label="Scenario Selector">
                    {[
                      {
                        id: "cognitive",
                        nameAr: "السيناريو الإدراكي والذهني",
                        nameEn: "Cognitive & Analytical Role",
                        descAr: "يعتمد بشكل أساسي على المدخلات الذهنية والبرمجية دون مجهود ميكانيكي حركي بالموقع المفتوح.",
                        descEn: "Role focusing on remote workspace screens, technical writing or digital program management with low physical burden.",
                        icon: Cpu,
                        weights: SCENARIO_WEIGHTS.cognitive,
                        color: "from-blue-500/20 to-indigo-500/10 border-blue-500/40"
                      },
                      {
                        id: "physical",
                        nameAr: "السيناريو البدني والحركي",
                        nameEn: "Physical & Industrial Role",
                        descAr: "يتطلب مناولة ومجهوداً حركياً مستمراً داخل الصالات اللوجستية أو خطوط التوريد.",
                        descEn: "Continuous manual handling, packaging, physical sorting, or moving objects inside manufacturing corridors.",
                        icon: Activity,
                        weights: SCENARIO_WEIGHTS.physical,
                        color: "from-red-500/20 to-orange-500/10 border-red-500/40"
                      },
                      {
                        id: "service",
                        nameAr: "السيناريو الخدمي وصالات الجمهور",
                        nameEn: "Service & Host Lobby Role",
                        descAr: "يتضمن استقبال مراجعين والتنقل بين صالات ومنافذ خدمة المستفيدين الميدانية.",
                        descEn: "Dynamic face-to-face assistance, corridor walking, guiding visitor circles, or reception floor coverage.",
                        icon: Sliders,
                        weights: SCENARIO_WEIGHTS.service,
                        color: "from-cyan-500/20 to-teal-500/10 border-cyan-500/40"
                      },
                      {
                        id: "compliance",
                        nameAr: "السيناريو الرقابي والامتثال البيئي",
                        nameEn: "Compliance & Safety Field Audit",
                        descAr: "يتواجد بشكل دائم لتقييم مواقع البناء أو الرقابة الميدانية والتدقيق على الأكواد والصحة.",
                        descEn: "Involves field structural audits, building layout inspections, and strict adherence constraints on footpaths.",
                        icon: Scale,
                        weights: SCENARIO_WEIGHTS.compliance,
                        color: "from-emerald-500/20 to-green-500/10 border-emerald-500/40"
                      },
                      {
                        id: "hybrid",
                        nameAr: "السيناريو المكتبي والهجين",
                        nameEn: "Office Hybrid Collaboration",
                        descAr: "صيغة عمل مرنة تجمع بين فترات تواصل مكتبي ملموس بمركز العمل مع مساندة عن بعد.",
                        descEn: "Flexible workstation hours, allowing physical design combined with cloud tasks mapping to alleviate fatigue.",
                        icon: Layers,
                        weights: SCENARIO_WEIGHTS.hybrid,
                        color: "from-purple-500/20 to-pink-500/10 border-purple-500/40"
                      }
                    ].map((item) => {
                      const IconComp = item.icon;
                      const isSelected = scenario === item.id;
                      const isFocusedOrHovered = focusedScenario === item.id;
                      
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setScenario(item.id as any);
                          }}
                          onFocus={() => setFocusedScenario(item.id)}
                          onBlur={() => setFocusedScenario(null)}
                          onMouseEnter={() => setFocusedScenario(item.id)}
                          onMouseLeave={() => setFocusedScenario(null)}
                          tabIndex={0}
                          role="radio"
                          aria-checked={isSelected}
                          className={`relative glass-card p-5 cursor-pointer flex flex-col justify-between overflow-hidden transition-all duration-300 h-64 border rounded-2xl ${
                            isSelected 
                              ? "ring-2 ring-primary bg-primary/10 border-primary scale-[1.01]" 
                              : "border-slate-800 hover:border-slate-600 bg-slate-900/45"
                          }`}
                        >
                          {/* Inside Background Gradient */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20 pointer-events-none`} />

                          <div className="space-y-2 relative z-10">
                            <div className="flex items-center justify-between">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                                isSelected ? "bg-primary text-white border-primary" : "bg-slate-800 text-slate-400 border-slate-700"
                              }`}>
                                <IconComp className="w-5 h-5" />
                              </div>
                              {isSelected && (
                                <span className="bg-primary/20 text-indigo-400 border border-primary/40 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono tracking-wider">
                                  {language === "ar" ? "نشط" : "ACTIVE"}
                                </span>
                              )}
                            </div>

                            <h3 className="text-sm font-black text-white mt-1">
                              {language === "ar" ? item.nameAr : item.nameEn}
                            </h3>
                            <p className="text-xs text-slate-400 line-clamp-3">
                              {language === "ar" ? item.descAr : item.descEn}
                            </p>
                          </div>

                          {/* Weights Layer on Hover/Focus */}
                          <div className="relative z-10 mt-auto pt-3 border-t border-slate-800/60">
                            <AnimatePresence mode="wait">
                              {isFocusedOrHovered || isSelected ? (
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  className="space-y-1 text-[10px]"
                                >
                                  <div className="text-[10px] font-bold text-gold flex justify-between">
                                    <span>{language === "ar" ? "توزيع موازنة المحرك الرقمي:" : "Evaluation Balance Weights:"}</span>
                                    <span>{isFocusedOrHovered ? (language === "ar" ? "(تركيز)" : "(focus)") : ""}</span>
                                  </div>
                                  <div className="grid grid-cols-5 gap-1 text-[9px] font-mono text-center text-slate-300">
                                    <div className="bg-slate-950/80 p-0.5 rounded border border-slate-800">
                                      <div className="text-[7px] text-slate-500">{language === "ar" ? "مهام" : "Task"}</div>
                                      <div className="font-bold text-indigo-400">%{Math.round(item.weights.tasks * 100)}</div>
                                    </div>
                                    <div className="bg-slate-950/80 p-0.5 rounded border border-slate-800">
                                      <div className="text-[7px] text-slate-500">{language === "ar" ? "بيئة" : "Env"}</div>
                                      <div className="font-bold text-indigo-400">%{Math.round(item.weights.env * 100)}</div>
                                    </div>
                                    <div className="bg-slate-950/80 p-0.5 rounded border border-slate-800">
                                      <div className="text-[7px] text-slate-500">{language === "ar" ? "بيان" : "Evid"}</div>
                                      <div className="font-bold text-indigo-400">%{Math.round(item.weights.evidence * 100)}</div>
                                    </div>
                                    <div className="bg-slate-950/80 p-0.5 rounded border border-slate-800">
                                      <div className="text-[7px] text-slate-500">{language === "ar" ? "تهيئة" : "Ace"}</div>
                                      <div className="font-bold text-indigo-400">%{Math.round(item.weights.accommodation * 100)}</div>
                                    </div>
                                    <div className="bg-slate-950/80 p-0.5 rounded border border-slate-800">
                                      <div className="text-[7px] text-slate-500">{language === "ar" ? "مالي" : "Fin"}</div>
                                      <div className="font-bold text-indigo-400">%{Math.round(item.weights.financial * 100)}</div>
                                    </div>
                                  </div>
                                </motion.div>
                              ) : (
                                <div className="text-[10px] text-slate-500 flex items-center justify-between font-mono">
                                  <span>{language === "ar" ? "اضغط للموازنة أو ضع الفأرة لعرض أوزان الـSBC" : "Focus or hover to display SBC weights"}</span>
                                  <Info className="w-3.5 h-3.5 text-slate-600" />
                                </div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      );
                    })}

                    {/* Card 6: Regulatory Information Block to perfectly satisfy the 2x3 grid */}
                    <div className="glass-card p-5 bg-gradient-to-br from-amber-950/15 via-slate-950/40 to-slate-950/60 border border-slate-800/80 rounded-2xl flex flex-col justify-between h-64">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Scale className="w-5 h-5 text-gold" />
                          <h3 className="text-xs font-black text-rose-300 tracking-wide">
                            {language === "ar" ? "الامتثال وكود البناء السعودي" : "Regulatory SBC Compliance Guideline"}
                          </h3>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-400">
                          {language === "ar" 
                            ? "تتكامل منصة معيار مع كود الوصول الشامل في وزارة الموارد البشرية والبلديات لمنع التمييز وإصدار العروض المشروطة بالتهيئة الهندسية المعتمدة."
                            : "Integrates directly with Saudi Building Code standard 201/102 parameters to enforce legal guidelines for physical workplace inclusivity."}
                        </p>
                      </div>
                      <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 text-[10px] space-y-1 mt-2 text-slate-300">
                        <div className="font-bold text-gold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Miyar Trust Engine v2.2</span>
                        </div>
                        <p className="text-[9px] text-slate-400">
                          {language === "ar" 
                            ? "يتم تتبع سلوك المدخلات وتفعيل نظام منع التحايل آلياً لحماية مصداقية التراخيص البيئية."
                            : "Core compliance rules enforce genuine motor allocations to prevent workplace structural discrepancy."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* STEP 2: Critical Tasks and Anti-Circumvention */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Anti-Circumvention Indicator Bar */}
              <div className="glass-card p-5 border-l-4 border-l-amber-500 bg-amber-500/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-gold w-5 h-5 animate-pulse" />
                    <h3 className="text-sm font-bold text-white">
                      {language === "ar" ? "نظام كشف تدليس وتجاوز المهام الحركية" : "Fraud & Circumvention Detection Core"}
                    </h3>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                    {language === "ar" ? "الحالة: نشط ومفعل" : "Status: Active Monitoring"}
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                  {language === "ar" 
                    ? "يتطلب كل سيناريو نسبة موازنة دقيقة للمهام ذات المتطلبات الحركية (Physical Demand). إذا كان السيناريو المقر ليس بدنياً (كالذهني أو المفرط الهجين) وبنفس الوقت بلغت المهام البدنية نسبة 90٪ أو أكثر من الإجمالي، فسيقوم خوارزم الامتثال بفصل وإغلاق مفتاح التقرير بالكامل لحماية حوكمة الوثيقة."
                    : "If a non-physical scenario is chosen but physical demand is checked for over 90% of total tasks, the system disables report compilation immediately to align with safety rules."}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Task Form Builder Panel */}
                <div className="lg:col-span-1 glass-card p-6 space-y-4">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
                    <Plus className="w-5 h-5 text-primary" />
                    <span>{language === "ar" ? "منشئ المهام الحرجة" : "Critical Task Creator"}</span>
                  </h3>

                  <div className="space-y-3">
                    {/* Fixed presets list based on scenario */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black tracking-wide text-slate-400 block">
                        {language === "ar" ? "أو حدد من المقترحات التنظيمية للسيناريو:" : "Select professional suggestions for this scenario:"}
                      </label>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {PRESET_CRITICAL_TASKS[scenario].map((preset, idx) => {
                          const name = language === "ar" ? preset.name_ar : preset.name_en;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setNewCritName(name);
                                setNewCritPhysical(preset.physical_demand);
                                setNewCritCaps(preset.caps);
                                setCritFormError("");
                              }}
                              className="w-full text-left bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 transition-colors flex items-start gap-1.5 font-sans"
                            >
                              <div className="w-1.5 h-1.5 bg-gold rounded-full mt-1.5 flex-shrink-0" />
                              <div className="truncate text-right w-full">{name}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Task Title Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-black tracking-wide text-slate-300">
                        {language === "ar" ? "تعديل المسمى أو كتابة يدوي مخصص:" : "Edit Title or Write Custom:"}
                      </label>
                      <input
                        type="text"
                        placeholder={language === "ar" ? "اكتب مسمى المهمة هنا..." : "Type custom task..."}
                        value={newCritName}
                        onChange={(e) => setNewCritName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-primary outline-none"
                      />
                    </div>

                    {/* Physical demand toggle */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">
                          {language === "ar" ? "تتطلب متطلباً حركياً / بدنياً" : "Is Kinetic / Physical demand"}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {language === "ar" ? "صنف (Physical Demand)" : "(physical_demand)"}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={newCritPhysical}
                        onChange={(e) => setNewCritPhysical(e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary focus:ring-offset-slate-950 bg-slate-800 border-slate-705 cursor-pointer"
                      />
                    </div>

                    {/* Capabilities alignment selection (At least one must be checked) */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-black tracking-wide text-slate-300">
                          {language === "ar" ? "اربط بالقدرات الـ15 (مؤشر واحد إلزامي):" : "Align 15 physical capabilities (Min 1):"}
                        </label>
                        <span className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.2 rounded">
                          {newCritCaps.length} {language === "ar" ? "محددة" : "selected"}
                        </span>
                      </div>
                      <div className="space-y-1.5 max-h-52 overflow-y-auto bg-slate-950/50 p-2 rounded-xl border border-slate-900 pr-1 select-none">
                        {CapList[language].map((cap) => {
                          const isChecked = newCritCaps.includes(cap.id);
                          return (
                            <div 
                              key={cap.id}
                              onClick={() => {
                                if (isChecked) {
                                  setNewCritCaps(newCritCaps.filter(id => id !== cap.id));
                                } else {
                                  setNewCritCaps([...newCritCaps, cap.id]);
                                }
                              }}
                              className={`flex items-center gap-2 p-1.5 rounded-lg text-[11px] cursor-pointer transition-colors ${
                                isChecked ? "bg-primary/20 text-white border border-primary/45" : "hover:bg-slate-900 text-slate-400 border border-transparent"
                              }`}
                            >
                              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${
                                isChecked ? "bg-primary border-primary text-white" : "border-slate-800"
                              }`}>
                                {isChecked && "✓"}
                              </div>
                              <span className="truncate">{cap.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {critFormError && (
                      <p className="text-xs text-rose-400 font-bold bg-rose-500/10 p-2 rounded-lg border border-rose-500/30">
                        {critFormError}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleAddCriticalTask}
                      className="w-full py-2.5 bg-primary hover:bg-primary-h rounded-xl text-xs font-black text-white transition-luxury flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{language === "ar" ? "حفظ وإدراج المهمة الحرجة" : "Add & Validate Critical Task"}</span>
                    </button>
                  </div>
                </div>

                {/* Added Tasks & Compliance Metrics */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Tasks Table */}
                  <div className="glass-card p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>{language === "ar" ? "قائمة المهام الحرجة المسجلة بالوظيفة" : "Registered Workspace Critical Tasks"}</span>
                      </h3>
                      <span className="bg-slate-900 text-slate-400 px-3 py-1 rounded-xl text-xs font-bold font-mono">
                        {criticalTasks.length} {language === "ar" ? "مهام" : "tasks"}
                      </span>
                    </div>

                    {criticalTasks.length === 0 ? (
                      <div className="text-center py-10 text-slate-500 text-sm">
                        {language === "ar" ? "لا يوجد مهام حالية. يرجى إدراج مهمة حرجة واحدة على الأقل." : "No tasks added yet. Please use the form to append tasks."}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {criticalTasks.map((task) => {
                          const matchedCaps = CapList[language].filter(c => task.capabilityIds.includes(c.id));
                          
                          return (
                            <div
                              key={task.id}
                              className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-2xl p-4 transition-luxury flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                              <div className="space-y-2 max-w-xl">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="bg-red-500/10 border border-red-500/30 text-rose-300 font-bold px-2 py-0.5 rounded-full text-[10px]">
                                    {language === "ar" ? "✓ حـرجـة" : "CRITICAL"}
                                  </span>
                                  {task.physicalDemand ? (
                                    <span className="bg-orange-500/10 border border-orange-500/30 text-gold px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
                                      {language === "ar" ? "متطلب بدني (physical_demand)" : "PHYSICAL DEMAND"}
                                    </span>
                                  ) : (
                                    <span className="bg-slate-950 text-slate-500 px-2 py-0.5 rounded-full text-[10px]">
                                      {language === "ar" ? "ذهني / غير بدني" : "COGNITIVE / NON-PHYSICAL"}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-sm font-black text-white">{task.name}</h4>
                                
                                {/* Caps list */}
                                <div className="flex flex-wrap gap-1">
                                  {matchedCaps.map(c => (
                                    <span key={c.id} className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-850">
                                      {c.name}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteCritTask(task.id)}
                                className="text-rose-400 hover:text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl transition-colors self-end md:self-auto"
                                aria-label="Delete Task"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Dynamic Indicators / Live warnings */}
                  <div className="glass-card p-6 space-y-4">
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">
                      {language === "ar" ? "المؤشرات الإحصائية ومسارات الحوكمة الفورية" : "Job Physical Demand Statistical Ratios"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Progress ratios */}
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-slate-300">
                            <span>{language === "ar" ? "نسبة المهام الحرجة من الإجمالي:" : "Critical Tasks / Total Ratio:"}</span>
                            <span className={isHighCriticalRatio ? "text-amber-400 font-extrabold" : "text-emerald-400"}>
                              {totalTasksCount > 0 ? Math.round((criticalTasksCount / totalTasksCount) * 100) : 0}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${isHighCriticalRatio ? "bg-amber-500" : "bg-emerald-500"}`}
                              style={{ width: `${totalTasksCount > 0 ? (criticalTasksCount / totalTasksCount) * 100 : 0}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-slate-300">
                            <span>{language === "ar" ? "معدل المتطلبات البدنية للوظيفة:" : "Physical Demand / Total Ratio:"}</span>
                            <span className={isFraudCircumventionTriggered ? "text-red-400 font-extrabold" : "text-indigo-400"}>
                              {totalTasksCount > 0 ? Math.round((physicalDemandTasksCount / totalTasksCount) * 100) : 0}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${isFraudCircumventionTriggered ? "bg-red-500" : "bg-indigo-500"}`}
                              style={{ width: `${totalTasksCount > 0 ? (physicalDemandTasksCount / totalTasksCount) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Warnings Cards */}
                      <div className="space-y-3">
                        <AnimatePresence>
                          {isHighCriticalRatio && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-amber-950/25 border border-amber-900/50 p-3.5 rounded-xl text-xs space-y-1"
                            >
                              <div className="font-extrabold text-gold flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4 text-gold" />
                                <span>{language === "ar" ? "تحذير مالي تنظيمي (#1):" : "Regulatory Warning (#1):"}</span>
                              </div>
                              <p className="text-[11px] leading-relaxed text-slate-300">
                                {language === "ar" 
                                  ? "نسبة المهام الحرجة مرتفعة (> 75%). يرجى التأكد من أن التوصيف دقيق لتجنب زيادة مخاطر الإخفاق الهيكلي للموظف."
                                  : "High proportion of critical tasks detected. Consider moving optional tasks to the flexible builder."}
                              </p>
                            </motion.div>
                          )}

                          {isFraudCircumventionTriggered && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-red-950/25 border border-red-900/50 p-3.5 rounded-xl text-xs space-y-1"
                            >
                              <div className="font-extrabold text-rose-400 flex items-center gap-1.5 animate-pulse">
                                <AlertTriangle className="w-4 h-4 text-rose-400" />
                                <span>{language === "ar" ? "تنبيه التحايل الحاد (#2):" : "Exploit Lock Activated (#2):"}</span>
                              </div>
                              <p className="text-[11px] leading-relaxed text-rose-200 font-medium">
                                {language === "ar" 
                                  ? "قفل امتثال التعبئة نشط! لقد سجلت مهام حركية بدنية بنسبة تتجاوز 90% في سيناريو مصنف على أنه غير بدني. يرجى العودة للتحرير أو تم قفل زر إصدار التقرير قانونياً لمنع ثغرات الترخيص."
                                  : "Scenario mismatches detected: over 90% physical demand tasks in a non-physical role. Report compilation is locked."}
                              </p>
                            </motion.div>
                          )}

                          {!isHighCriticalRatio && !isFraudCircumventionTriggered && (
                            <div className="bg-emerald-950/20 border border-emerald-900/50 p-4 rounded-xl text-center text-xs text-emerald-400 space-y-1 flex flex-col items-center justify-center h-full">
                              <ShieldCheck className="w-8 h-8 text-emerald-400 mb-1" />
                              <span className="font-bold">{language === "ar" ? "توازن وامتثال سليم" : "Balance Ratio Compliant"}</span>
                              <span className="text-[10px] text-slate-400">{language === "ar" ? "لم ترصد الفحوصات التلقائية أي شذوذ في صياغة المهام بيئياً." : "No anomalies detected in the tasks structure."}</span>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Flexible Tasks Builder */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Builder for Flexible Tasks */}
                <div className="lg:col-span-1 glass-card p-6 space-y-4">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
                    <Plus className="w-5 h-5 text-primary" />
                    <span>{language === "ar" ? "باني المهام المرنة" : "Flexible Task Builder"}</span>
                  </h3>

                  <div className="space-y-3">
                    {/* Fixed presets list based on scenario */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black tracking-wide text-slate-400 block">
                        {language === "ar" ? "أو حدد من المقترحات التنظيمية للمرونة:" : "Or load role-tailored flexible presets:"}
                      </label>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {PRESET_FLEXIBLE_TASKS[scenario].map((preset, idx) => {
                          const name = language === "ar" ? preset.name_ar : preset.name_en;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setNewFlexName(name);
                                setNewFlexPhysical(preset.physical_demand);
                                setNewFlexCaps(preset.caps);
                                setNewFlexType(preset.flexibility_type);
                                setFlexFormError("");
                              }}
                              className="w-full text-right bg-slate-950 focus:bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 transition-colors flex items-start gap-1.5 font-sans"
                            >
                              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />
                              <div className="truncate text-right w-full">{name}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Task Title Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-black tracking-wide text-slate-300">
                        {language === "ar" ? "تعديل مسمى المهمة المرنة:" : "Edit Flexible Task Title:"}
                      </label>
                      <input
                        type="text"
                        placeholder={language === "ar" ? "اكتب مهمة مرنة هنا..." : "Type flexible task name..."}
                        value={newFlexName}
                        onChange={(e) => setNewFlexName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-primary outline-none"
                      />
                    </div>

                    {/* Flexibility Type Selector (Required) */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black tracking-wide text-slate-300 block">
                        {language === "ar" ? "طابع ونوع المرونة وبدائل الأنشطة:" : "Accommodating Flexibility Pattern:"}
                      </label>
                      <select
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-primary outline-none"
                        value={newFlexType}
                        onChange={(e) => setNewFlexType(e.target.value)}
                      >
                        <option value="full_delegation">{language === "ar" ? "تفويض كامل للزملاء بالمكتب" : "Full Delegation (Colleague assisted)"}</option>
                        <option value="partial_modification">{language === "ar" ? "تعديل جزئي للأزمنة والراحة" : "Partial Modification (Downtime cushion)"}</option>
                        <option value="technical_alternative">{language === "ar" ? "بديل تقني أو ذكاء اصطناعي" : "Technical Alternative (Digital shift)"}</option>
                        <option value="flexible_scheduling">{language === "ar" ? "جدولة مرنة وأوقات ذروة هادئة" : "Flexible Scheduling (Distributed shifts)"}</option>
                      </select>
                    </div>

                    {/* Physical demand toggle */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">
                          {language === "ar" ? "تتطلب جهداً حركياً" : "Requires motor exertion"}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {language === "ar" ? "لتتبع موازنة الامتثال" : "for fraud checks"}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={newFlexPhysical}
                        onChange={(e) => setNewFlexPhysical(e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary focus:ring-offset-slate-950 bg-slate-800 border-slate-705 cursor-pointer"
                      />
                    </div>

                    {/* Capabilities alignment */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-black tracking-wide text-slate-300">
                          {language === "ar" ? "اربط بالقدرات الـ15 (مؤشر واحد إلزامي):" : "Align 15 capabilities (Min 1):"}
                        </label>
                        <span className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.2 rounded">
                          {newFlexCaps.length} {language === "ar" ? "محددة" : "selected"}
                        </span>
                      </div>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto bg-slate-950/50 p-2 rounded-xl border border-slate-900 pr-1 select-none">
                        {CapList[language].map((cap) => {
                          const isChecked = newFlexCaps.includes(cap.id);
                          return (
                            <div 
                              key={cap.id}
                              onClick={() => {
                                if (isChecked) {
                                  setNewFlexCaps(newFlexCaps.filter(id => id !== cap.id));
                                } else {
                                  setNewFlexCaps([...newFlexCaps, cap.id]);
                                }
                              }}
                              className={`flex items-center gap-2 p-1.5 rounded-lg text-[11px] cursor-pointer transition-colors ${
                                isChecked ? "bg-primary/20 text-white border border-primary/45" : "hover:bg-slate-900 text-slate-400"
                              }`}
                            >
                              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${
                                isChecked ? "bg-primary border-primary text-white" : "border-slate-800"
                              }`}>
                                {isChecked && "✓"}
                              </div>
                              <span className="truncate">{cap.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {flexFormError && (
                      <p className="text-xs text-rose-400 font-bold bg-rose-500/10 p-2 rounded-lg border border-rose-500/30">
                        {flexFormError}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleAddFlexibleTask}
                      className="w-full py-2.5 bg-primary hover:bg-primary-h rounded-xl text-xs font-black text-white transition-luxury flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{language === "ar" ? "حفظ وإدراج المهمة المرنة" : "Add & Validate Flexible Task"}</span>
                    </button>
                  </div>
                </div>

                {/* Added Flexible Tasks Grid */}
                <div className="lg:col-span-2 glass-card p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-indigo-400" />
                      <span>{language === "ar" ? "قائمة المهام المرنة التيسيرية المعتمدة" : "Registered Flexible Accommodated Duties"}</span>
                    </h3>
                    <span className="bg-slate-900 text-indigo-400 px-3 py-1 rounded-xl text-xs font-bold font-mono">
                      {flexibleTasks.length} {language === "ar" ? "مهام" : "tasks"}
                    </span>
                  </div>

                  {flexibleTasks.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-sm">
                      {language === "ar" ? "لا توجد حالياً؛ أضف مهمة مرنة لتوسيع خيارات المرونة للكفاءة." : "No flexible tasks. Consider adding for partial or full delegation profiles."}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {flexibleTasks.map((task) => {
                        const matchedCaps = CapList[language].filter(c => task.capabilityIds.includes(c.id));
                        
                        return (
                          <div
                            key={task.id}
                            className="bg-slate-950/60 p-4 border border-slate-850/80 rounded-2xl flex flex-col justify-between gap-4 hover:border-slate-700 transition"
                          >
                            <div className="space-y-2">
                              <div className="flex gap-1.5 flex-wrap">
                                <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold px-2 py-0.5 rounded-full text-[9px]">
                                  {task.flexibilityType === "full_delegation" && (language === "ar" ? "تفويض كامل" : "FULL DELEGATION")}
                                  {task.flexibilityType === "partial_modification" && (language === "ar" ? "تعديل أزمنة" : "PARTIAL MOD")}
                                  {task.flexibilityType === "technical_alternative" && (language === "ar" ? "بديل تقني" : "TECH OUTLET")}
                                  {task.flexibilityType === "flexible_scheduling" && (language === "ar" ? "جدولة مرنة" : "FLEXIBLE SHIFT")}
                                </span>
                                {task.physicalDemand && (
                                  <span className="bg-orange-500/10 text-gold px-1.5 py-0.5 rounded text-[8px] font-bold">
                                    {language === "ar" ? "طبيعة حركية" : "PHYSICAL"}
                                  </span>
                                )}
                              </div>

                              <h4 className="text-xs font-extrabold text-white">{task.name}</h4>
                              
                              <div className="flex flex-wrap gap-1">
                                {matchedCaps.map(c => (
                                  <span key={c.id} className="text-[9px] bg-slate-900 border border-slate-850 text-slate-400 px-1.5 py-0.5 rounded">
                                    {c.name}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteFlexTask(task.id)}
                              className="text-rose-400 hover:text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl transition"
                              aria-label="Remove Flexible Task"
                            >
                              <Trash2 className="w-4 h-4 ml-auto" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Environment & Accommodations Cost Catalog */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-gold" />
                  <h2 className="text-xl font-bold text-white">
                    {language === "ar" 
                      ? "الخطوة ٤: مسح جاهزية البيئة الـ٨ الهندسية، وفحوص التكييف التيسيرية" 
                      : "Step 4: Spatial Readiness Checks & Accommodation Pricing Catalog"}
                  </h2>
                </div>
                <p className="text-xs text-slate-400 max-w-4xl leading-relaxed">
                  {language === "ar" 
                    ? "حدد الترتيبات التجهيزية المطلوبة لكل عنصر لتهيئة مقر المنشأة. تدرج التكاليف مابين أساسية (Low) ومتوسطة (Mid) وإنشائية (High) مع تحديد الجهة الممولة (المنشأة vs دعم صندوق هدف للحماية القانونية)."
                    : "Specify requested architectural modifications. Prices adjust automatically through low/mid/high tiers. Identify if subsidized by government (HADAF) or the employer."}
                </p>
              </div>

              {/* 8 Elements Catalog */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 8 Checkpoints Interactive Panel */}
                <div className="lg:col-span-2 space-y-4">
                  {SPATIAL_ELEMENTS[language].map((elem) => {
                    const currentTier = spatialAccommodations[elem.key] || 0;
                    const funder = funderMap[elem.key] || "employer";
                    const prices = ACCOMMODATION_CATALOG[elem.key] || { low: 0, mid: 0, high: 0 };
                    const isRiskItem = prices.high > HIGH_RISK_THRESHOLD_SAR && currentTier > 0;

                    return (
                      <div
                        key={elem.key}
                        className={`glass-card p-5 border transition-all duration-300 ${
                          currentTier > 0 
                            ? isRiskItem 
                              ? "border-rose-500/40 bg-rose-950/5 hover:border-rose-500/60" 
                              : "border-primary/40 bg-primary-bg/5 hover:border-primary/60"
                            : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          
                          {/* Element Names */}
                          <div className="space-y-1.5 max-w-lg">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-white">{elem.name}</h4>
                              
                              {/* Highlight as high-risk component if high cost > 20,000 SAR and current tier selected > 0 */}
                              {isRiskItem && (
                                <span className="bg-red-500/15 text-rose-300 border border-red-500/30 px-2 py-0.5 rounded-full text-[9px] font-extrabold animate-pulse">
                                  ⚠️ {language === "ar" ? "ترتيب عالي المصروفات والخطورة" : "High-Risk Cap Item (>20K)"}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400">{elem.desc}</p>

                            {elem.key === "ramp" && currentTier > 0 && (
                              <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-slate-950 border border-slate-800/80 w-fit mt-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${rampSlopeValue >= 12 ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                                <span className="text-[10px] text-slate-300 font-bold">
                                  {language === "ar" ? "نسبة الانحدار المتغيرة:" : "Custom Incline Slope:"}
                                </span>
                                <span className="text-[10px] font-mono font-extrabold text-indigo-400">
                                  1:{rampSlopeValue}
                                </span>
                                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${rampSlopeValue >= 12 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                                  {rampSlopeValue >= 12 ? (language === "ar" ? "متوافق مع كود البناء" : "SBC Compliant") : (language === "ar" ? "غير مطابق - حاد" : "Steep - Non-Compliant")}
                                </span>
                              </div>
                            )}

                            {/* Show Price ranges */}
                            <div className="text-[10px] text-slate-500 font-mono flex gap-3">
                              <span>Low: {prices.low} SAR |</span>
                              <span>Mid: {prices.mid} SAR |</span>
                              <span>High: {prices.high} SAR</span>
                            </div>
                          </div>

                          {/* Controls (Tier select + Funder select) */}
                          <div className="flex flex-col gap-2.5 flex-shrink-0 md:items-end">
                            
                            {/* Tier selection buttons */}
                            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80">
                              {[
                                { val: 0, nameAr: "لا يتطلب", nameEn: "None" },
                                { val: 1, nameAr: "أساسي", nameEn: "Low" },
                                { val: 2, nameAr: "متوسط", nameEn: "Mid" },
                                { val: 3, nameAr: "إنشائي", nameEn: "High" }
                              ].map((tier) => {
                                const selected = currentTier === tier.val;
                                return (
                                  <button
                                    key={tier.val}
                                    type="button"
                                    onClick={() => {
                                      setSpatialAccommodations({
                                        ...spatialAccommodations,
                                        [elem.key]: tier.val
                                      });
                                    }}
                                    className={`px-2 py-1 text-[10px] rounded-lg transition-luxury font-bold ${
                                      selected 
                                        ? "bg-primary text-white" 
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                                    }`}
                                  >
                                    {language === "ar" ? tier.nameAr : tier.nameEn}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Funder mapping toggle */}
                            {currentTier > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-400">
                                  {language === "ar" ? "الجهة المموّلة التمهيدية:" : "Funding Channel:"}
                                </span>
                                <div className="inline-flex bg-slate-950 p-0.5 rounded-lg border border-slate-850">
                                  <button
                                    type="button"
                                    onClick={() => setFunderMap({ ...funderMap, [elem.key]: "hadaf" })}
                                    className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${funder === "hadaf" ? "bg-emerald-500 text-bg" : "text-slate-400"}`}
                                  >
                                    {language === "ar" ? "دعم هدف" : "HADAF"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setFunderMap({ ...funderMap, [elem.key]: "employer" })}
                                    className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${funder === "employer" ? "bg-indigo-500 text-white" : "text-slate-400"}`}
                                  >
                                    {language === "ar" ? "المنشأة" : "Employer"}
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Live Cost Summation & Reporting Box */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="glass-card p-6 bg-gradient-to-b from-slate-900 to-slate-950 sticky top-4 border border-slate-800 space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
                        <DollarSign className="w-5 h-5 text-gold animate-bounce" />
                        <span>{language === "ar" ? "تقرير تكاليف الملاءمة والامتثال" : "Live Financial Compliance Report"}</span>
                      </h3>
                    </div>

                    {/* Cost ledger ranges */}
                    <div className="space-y-4 bg-slate-950/80 p-4 border border-slate-900 rounded-2xl">
                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-400 block">
                          {language === "ar" ? "نطاق التكلفة المالي الكلي المبدئي:" : "Aggregated cost spectrum range:"}
                        </span>
                        <div className="text-lg md:text-xl font-black text-emerald-400 tracking-tight font-mono">
                          {totalCostLowSum.toLocaleString()} - {totalCostHighSum.toLocaleString()} {language === "ar" ? "ريال" : "SAR"}
                        </div>
                      </div>

                      {/* Cumulative funder metrics */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] pt-3 border-t border-slate-800/80">
                        <div className="space-y-0.5">
                          <span className="text-slate-500 block">{language === "ar" ? "ممول من هدف (تيسيري):" : "HADAF Subsidized:"}</span>
                          <span className="font-bold text-emerald-400 font-mono">
                            {currentAccommodationsList
                              .filter(e => funderMap[e.key] === "hadaf" && e.level > 0)
                              .reduce((a, c) => a + c.costHigh, 0)
                              .toLocaleString()} {language === "ar" ? "ريال" : "SAR"}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-slate-500 block">{language === "ar" ? "ممول من المنشأة:" : "Facility Budgeted:"}</span>
                          <span className="font-bold text-slate-300 font-mono">
                            {currentAccommodationsList
                              .filter(e => funderMap[e.key] === "employer" && e.level > 0)
                              .reduce((a, c) => a + c.costHigh, 0)
                              .toLocaleString()} {language === "ar" ? "ريال" : "SAR"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* High Risk warning inside the checkout report panel */}
                    {containsHighRiskAccommodations && (
                      <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl space-y-1.5">
                        <div className="flex items-center gap-1.5 text-rose-300 font-black text-xs">
                          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                          <span>{language === "ar" ? "وجود ترتيب ذو مصروفات مرتفعة (> 20 ألف)" : "High Risk Expense Detected (>20K)"}</span>
                        </div>
                        <p className="text-[10px] leading-relaxed text-slate-300">
                          {language === "ar" 
                            ? "تم رصد عنصر تكييف تيسيري معقول بتكاليف إنشائية مرتفعة (دورة مياه مجهزة بالكامل). يتوجب على مدراء الموارد البشرية توثيق الحاجة الميدانية لرفع المطابقة للهيئة التنظيمية."
                            : "Restroom modifications represent structural adaptations exceeding 20,000 SAR. HR must document spatial floor justification."}
                        </p>
                      </div>
                    )}

                    {/* Status checks indicators */}
                    <div className="text-[10px] space-y-2 text-slate-400 border-t border-slate-800 pt-4">
                      <div className="flex justify-between">
                        <span>{language === "ar" ? "عتبة الخطورة المالية:" : "Financial High-Risk Code:"}</span>
                        <span className="font-bold text-slate-300 font-mono">{HIGH_RISK_THRESHOLD_SAR.toLocaleString()} SAR</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === "ar" ? "كود التوافق الهندسي:" : "Compliance Code:"}</span>
                        <span className="font-bold text-emerald-400 font-mono">SBC-201/102</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Collapsible 3D Interactive Environment Panel */}
              <ThreeDMap
                language={language}
                spatialAccommodations={spatialAccommodations}
                funderMap={funderMap}
                onRampSlopeChange={(val) => {
                  setRampSlopeValue(val);
                }}
                onAnnounce={triggerAnnouncement}
                keyboardFirstMode={keyboardFirstMode}
              />
            </motion.div>
          )}

          {/* STEP 5: Final Summary & Matching Score Output */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="glass-card p-6 md:p-8 space-y-8">
                
                {/* Header overview */}
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="w-12 h-12 bg-indigo-950/20 text-indigo-400 border border-indigo-500/40 rounded-2xl flex items-center justify-center mx-auto mb-2 font-black">
                    <FileCheck2 className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white">
                    {language === "ar" ? "الخطوة الأخيرة: مراجعة وإصدار تقرير المطابقة المشروط" : "Step 5: Final Review & Issue Advisory Report"}
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === "ar" 
                      ? "يرجى مراجعة ملخص المعطيات والترتيبات التيسيرية المحسوبة للمنشأة سلطان عبد العزيز ومقر الوظيفة قبل النقر المباشر لاعتماد التقرير وتدقيقه."
                      : "Confirm inputs, spatial requirements, and compliance variables. If fraud-free, authorize report compilation below."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Job Identity Card */}
                  <div className="bg-slate-900/60 p-5 border border-slate-800 rounded-2xl space-y-3.5">
                    <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      <span>{language === "ar" ? "١. الهوية التنظيمية للوظيفة" : "1. Job Credentials"}</span>
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-500 block">{language === "ar" ? "المسمى والمقر:" : "Title & Department:"}</span>
                        <span className="font-bold text-white block">{jobTitle}</span>
                        <span className="text-slate-400 block">{deptName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{language === "ar" ? "المنشأة ودرجتها:" : "Employer & Level:"}</span>
                        <span className="font-bold text-slate-200 block">{facilityName}</span>
                        <span className="text-slate-400 block">{facilityType === "private" ? "قطاع خاص" : "قطاع حكومي / منظم"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{language === "ar" ? "النمط المنهجي المختار:" : "Method Scenario:"}</span>
                        <span className="bg-primary/20 text-indigo-300 border border-primary/30 px-2 py-0.5 rounded text-[10px] inline-block mt-1 font-bold">
                          {getScenarioNameAr(scenario)} ({scenario})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tasks Summary */}
                  <div className="bg-slate-900/60 p-5 border border-slate-800 rounded-2xl space-y-3.5">
                    <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                      <Sliders className="w-4 h-4" />
                      <span>{language === "ar" ? "٢. ملخص المهام الموازنة" : "2. Duties Audit Ratio"}</span>
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-mono">
                        <div className="bg-slate-950 p-2 rounded-xl border border-slate-850">
                          <span className="text-slate-500 block">{language === "ar" ? "مهام حرجة" : "Critical"}</span>
                          <span className="font-black text-slate-200 text-sm block mt-1">{criticalTasks.length}</span>
                        </div>
                        <div className="bg-slate-950 p-2 rounded-xl border border-slate-850">
                          <span className="text-slate-500 block">{language === "ar" ? "مهام مرنة" : "Flexible"}</span>
                          <span className="font-black text-slate-200 text-sm block mt-1">{flexibleTasks.length}</span>
                        </div>
                      </div>

                      <div className="space-y-1 bg-slate-950/80 p-2.5 rounded-lg border border-slate-900">
                        <div className="flex justify-between">
                          <span className="text-[10px] text-slate-400">{language === "ar" ? "إجمالي المهام الحركية:" : "Physical Tasks count:"}</span>
                          <span className="font-bold text-slate-300 font-mono">{physicalDemandTasksCount} / {totalTasksCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[10px] text-slate-400">{language === "ar" ? "نسبة المتطلبات البدنية:" : "Physical Demand %:"}</span>
                          <span className={`font-bold font-mono ${isFraudCircumventionTriggered ? "text-rose-400 animate-pulse" : "text-slate-300"}`}>
                            {totalTasksCount > 0 ? Math.round((physicalDemandTasksCount / totalTasksCount) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Environment & Financial Report */}
                  <div className="bg-slate-900/60 p-5 border border-slate-800 rounded-2xl space-y-3.5">
                    <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{language === "ar" ? "٣. مسار التمويل والتكلفة" : "3. Costing Summary"}</span>
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-slate-500 block">{language === "ar" ? "إجمالي كلفة التعديلات الهندسية:" : "Total Accommodations Budget:"}</span>
                        <span className="font-black text-emerald-400 text-sm block font-mono mt-0.5">
                          {totalCostLowSum.toLocaleString()} - {totalCostHighSum.toLocaleString()} SAR
                        </span>
                      </div>
                      <div className="space-y-1.5 pt-1.5 border-t border-slate-800/80">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>{language === "ar" ? "ميزانية المنشأة:" : "Employer Cost:"}</span>
                          <span className="text-white font-bold">
                            {currentAccommodationsList
                              .filter(e => funderMap[e.key] === "employer" && e.level > 0)
                              .reduce((a, c) => a + c.costHigh, 0)
                              .toLocaleString()} SAR
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>{language === "ar" ? "حماية وتكفل هدف المبدئية:" : "HADAF Subsidy:"}</span>
                          <span className="text-emerald-400 font-bold">
                            {currentAccommodationsList
                              .filter(e => funderMap[e.key] === "hadaf" && e.level > 0)
                              .reduce((a, c) => a + c.costHigh, 0)
                              .toLocaleString()} SAR
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Lock explanation & Circumvention Warning Box */}
                {isFraudCircumventionTriggered && (
                  <div className="p-4 bg-red-950/25 border border-red-500/30 rounded-2xl text-xs space-y-2 max-w-2xl mx-auto">
                    <div className="flex items-center gap-1.5 text-rose-400 font-black">
                      <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                      <span>{language === "ar" ? "إغلاق الامتثال مفعل: لا تتوفر الصلاحيات لإصدار التقرير" : "Fraud Lock Active: Advisory Report Compilation Denied"}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-rose-200">
                      {language === "ar" 
                        ? "يكتشف نظام المراقبة حشد أكثر من 90% من المهام كمتطلبات حركية قاسية في وظيفة منصوص عليها على أنها غير بدنية (كالذهنية أو الهجينة). تم إيقاف زر إصدار التقرير مؤقتاً لتجسيد مكافحة الاحتيال بيئياً. كإجراء لحل الإشكال، يُرجى الرجوع للخطوات السابقة وتخفيف معدل الجهد البدني للمهمة أو تعديل المسمى ونوع السيناريو بما يطابق المحيط الطبوغرافي الفعلي للوظيفة."
                        : "Exploit block: you have declared over 90% manual physical tasks in an otherwise cognitive or hybrid workspace definition. Submit compilation denied to safeguard license security. To solve, reduce physical checkbox triggers in steps 2 or 3 or change scenario to physical."}
                    </p>
                  </div>
                )}

                {/* Action CTA Buttons */}
                <div className="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row justify-center items-center gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-full md:w-auto px-6 py-2.5 border border-slate-700 hover:border-slate-500 text-slate-300 rounded-xl text-xs font-bold transition-luxury"
                  >
                    {language === "ar" ? "رجع للخطوة السابقة" : "Previous Step"}
                  </button>

                  <button
                    type="button"
                    disabled={isFraudCircumventionTriggered}
                    onClick={handleIssueReport}
                    className={`w-full md:w-auto px-10 py-3.5 text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                      isFraudCircumventionTriggered 
                        ? "bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed opacity-50" 
                        : "bg-emerald-500 text-bg hover:bg-emerald-400 font-extrabold focus:ring-4 focus:ring-emerald-500/20 active:scale-95"
                    }`}
                  >
                    <CheckCircle2 className="w-4.5 h-4.5" />
                    <span>{language === "ar" ? "إصدار تقرير المطابقة والمراجعة" : "Compile & Issue Advisory Report"}</span>
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Footer for Quick Wizard Jumps */}
      {currentStep < 5 && (
        <div className="flex justify-between items-center bg-slate-950/70 p-4 border border-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-400 transition"
          >
            {language === "ar" ? "السابق" : "Prev"}
          </button>

          <span className="text-[11px] text-slate-500 font-mono">
            {language === "ar" ? `الخطوة ${currentStep} من ٥` : `Step ${currentStep} of 5`}
          </span>

          <button
            type="button"
            onClick={handleNextStep}
            className="px-5 py-2.5 bg-primary hover:bg-primary-h hover:text-white text-xs font-bold text-white rounded-xl transition-luxury"
          >
            {language === "ar" ? "التالي" : "Next"}
          </button>
        </div>
      )}

    </div>
  );
}

// 3D Environment Visualizer sub-component
interface ThreeDMapProps {
  language: "ar" | "en";
  spatialAccommodations: Record<string, number>;
  funderMap: Record<string, "hadaf" | "employer">;
  onRampSlopeChange?: (slope: number) => void;
  onAnnounce: (msg: string) => void;
  keyboardFirstMode?: boolean;
}

export function ThreeDMap({
  language,
  spatialAccommodations,
  funderMap,
  onRampSlopeChange,
  onAnnounce,
  keyboardFirstMode = false
}: ThreeDMapProps) {
  const [threeLoaded, setThreeLoaded] = useState(false);
  const [threeLoadFailed, setThreeLoadFailed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAsList, setShowAsList] = useState(keyboardFirstMode);
  const [rampSlope, setRampSlope] = useState(12);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const deskMeshRef = useRef<any>(null);
  const chairMeshRef = useRef<any>(null);
  const corridorMeshRef = useRef<any>(null);
  const floorMeshRef = useRef<any>(null);

  // Rotation & zoom spherical coords params
  const cameraParams = useRef({
    radius: 17,
    theta: 0.8, // yaw
    phi: 0.6,   // pitch
    target: { x: 0, y: 0.25, z: 0 }
  });

  // Load Three.js safely from CDN
  useEffect(() => {
    if ((window as any).THREE) {
      setThreeLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    script.onload = () => {
      if ((window as any).THREE) {
        setThreeLoaded(true);
      } else {
        setThreeLoadFailed(true);
      }
    };
    script.onerror = () => {
      setThreeLoadFailed(true);
    };
    document.body.appendChild(script);
  }, []);

  // Update cameras based on params
  const updateCamera = () => {
    if (!cameraRef.current) return;
    const p = cameraParams.current;
    cameraRef.current.position.x = p.target.x + p.radius * Math.sin(p.theta) * Math.cos(p.phi);
    cameraRef.current.position.y = p.target.y + p.radius * Math.sin(p.phi);
    cameraRef.current.position.z = p.target.z + p.radius * Math.cos(p.theta) * Math.cos(p.phi);
    cameraRef.current.lookAt(p.target.x, p.target.y, p.target.z);
  };

  // Turn Left/Right & Zoom In/Out via keyboard replacement buttons
  const handleRotate = (dir: "cw" | "ccw") => {
    cameraParams.current.theta += dir === "cw" ? 0.25 : -0.25;
    updateCamera();
  };

  const handleZoom = (type: "in" | "out") => {
    cameraParams.current.radius += type === "in" ? -1.5 : 1.5;
    cameraParams.current.radius = Math.max(6, Math.min(32, cameraParams.current.radius));
    updateCamera();
  };

  // Re-run WebGL pipeline cleanly
  useEffect(() => {
    if (!threeLoaded || isCollapsed || showAsList) return;

    const THREE = (window as any).THREE;
    if (!THREE || !containerRef.current) return;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // dark slate backing
    sceneRef.current = scene;

    // 2. Setup Camera
    const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
    cameraRef.current = camera;
    updateCamera();

    // 3. Setup Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // 4. Setup Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.72);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.45);
    dirLight.position.set(10, 18, 8);
    scene.add(dirLight);

    const accentLight = new THREE.DirectionalLight(0x6366f1, 0.4); // soft purple glow
    accentLight.position.set(-8, -4, -8);
    scene.add(accentLight);

    // 5. Elevated Floor Platform
    const floorElevation = 0.5;
    const floorGeom = new THREE.BoxGeometry(11.5, floorElevation, 11.5);
    const floorMat = new THREE.MeshLambertMaterial({ color: 0x1e293b }); // slate-800
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.position.set(0, floorElevation / 2, 0); // floor top at Y = 0.5
    scene.add(floor);
    floorMeshRef.current = floor;

    // Background low walls for room definition
    const wallMat = new THREE.MeshLambertMaterial({ color: 0x334155, transparent: true, opacity: 0.4 });
    
    // Left border wall
    const leftWallGeom = new THREE.BoxGeometry(0.12, 1.6, 11.5);
    const leftWall = new THREE.Mesh(leftWallGeom, wallMat);
    leftWall.position.set(-5.75, floorElevation + 0.8, 0);
    scene.add(leftWall);

    // Back border wall
    const backWallGeom = new THREE.BoxGeometry(11.5, 1.6, 0.12);
    const backWall = new THREE.Mesh(backWallGeom, wallMat);
    backWall.position.set(0, floorElevation + 0.8, -5.75);
    scene.add(backWall);

    // Corridor wide accessibility lane
    const showCorridor = spatialAccommodations.corridor > 0;
    const corridorMat = new THREE.MeshLambertMaterial({
      color: showCorridor ? 0x10b981 : 0xf59e0b, // green if wide corridor, yellow standard
      transparent: true,
      opacity: 0.35
    });
    const corridorGeom = new THREE.BoxGeometry(2.5, 0.02, 11.5);
    const corridor = new THREE.Mesh(corridorGeom, corridorMat);
    corridor.position.set(3.5, floorElevation + 0.01, 0);
    scene.add(corridor);
    corridorMeshRef.current = corridor;

    // 6. Desk Component Group
    const deskGroup = new THREE.Group();
    scene.add(deskGroup);

    const isDeskAdjustable = spatialAccommodations.desk_adjust > 0;
    const deskTopHeight = isDeskAdjustable ? 1.35 : 0.85;

    // Desk top panel
    const deskTopGeom = new THREE.BoxGeometry(2.8, 0.08, 1.6);
    const deskTopMat = new THREE.MeshLambertMaterial({ color: 0xb45309 }); // beautiful bronze wood
    const deskTop = new THREE.Mesh(deskTopGeom, deskTopMat);
    deskTop.position.y = deskTopHeight;
    deskGroup.add(deskTop);

    // Four Legs
    const legGeom = new THREE.CylinderGeometry(0.045, 0.045, deskTopHeight);
    const legMat = new THREE.MeshLambertMaterial({ color: isDeskAdjustable ? 0xeab308 : 0x64748b }); // Gold gears if adjustable
    const legOffsets = [
      { x: -1.2, z: -0.6 },
      { x: 1.2, z: -0.6 },
      { x: -1.2, z: 0.6 },
      { x: 1.2, z: 0.6 }
    ];
    legOffsets.forEach(offset => {
      const leg = new THREE.Mesh(legGeom, legMat);
      leg.position.set(offset.x, deskTopHeight / 2, offset.z);
      deskGroup.add(leg);
    });

    deskGroup.position.set(-2, floorElevation, -1.8);
    deskMeshRef.current = deskGroup;

    // 7. Ergonomic Office Chair
    const chairGroup = new THREE.Group();
    scene.add(chairGroup);

    const seatHeight = isDeskAdjustable ? 0.72 : 0.52;
    const seatGeom = new THREE.BoxGeometry(0.9, 0.08, 0.9);
    const seatMat = new THREE.MeshLambertMaterial({ color: 0x3b82f6 }); // blue-500
    const seat = new THREE.Mesh(seatGeom, seatMat);
    seat.position.y = seatHeight;
    chairGroup.add(seat);

    const backGeom = new THREE.BoxGeometry(0.9, 0.7, 0.08);
    const back = new THREE.Mesh(backGeom, seatMat);
    back.position.set(0, seatHeight + 0.35, -0.42);
    chairGroup.add(back);

    const chairLegGeom = new THREE.CylinderGeometry(0.03, 0.03, seatHeight);
    const chairLegMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const chairOffsets = [
      { x: -0.35, z: -0.35 },
      { x: 0.35, z: -0.35 },
      { x: -0.35, z: 0.35 },
      { x: 0.35, z: 0.35 }
    ];
    chairOffsets.forEach(offset => {
      const leg = new THREE.Mesh(chairLegGeom, chairLegMat);
      leg.position.set(offset.x, seatHeight / 2, offset.z);
      chairGroup.add(leg);
    });

    chairGroup.position.set(-2, floorElevation, -0.2);
    chairMeshRef.current = chairGroup;

    // 8. Visual ADA Parking marking if selected
    if (spatialAccommodations.parking_mark > 0) {
      const pGroup = new THREE.Group();
      scene.add(pGroup);

      const outlineMat = new THREE.MeshBasicMaterial({ color: 0xeab308 });
      const mainPlateGeom = new THREE.BoxGeometry(1.6, 0.01, 1.6);
      const mainPlateMat = new THREE.MeshBasicMaterial({ color: 0x2563eb }); // blue ADA fill

      const plate = new THREE.Mesh(mainPlateGeom, mainPlateMat);
      plate.position.y = 0.005;
      pGroup.add(plate);

      const stripGeom1 = new THREE.BoxGeometry(3.6, 0.01, 0.12);
      const s1 = new THREE.Mesh(stripGeom1, outlineMat);
      s1.position.set(0, 0.001, -2);
      pGroup.add(s1);

      const s2 = new THREE.Mesh(stripGeom1, outlineMat);
      s2.position.set(0, 0.001, 2);
      pGroup.add(s2);

      pGroup.position.set(8.5, 0.01, -2.5);
    }

    // 9. Interactive Entrance Ramp Group
    const rampGroup = new THREE.Group();
    scene.add(rampGroup);

    if (spatialAccommodations.ramp > 0) {
      const runLength = floorElevation * rampSlope; // stretch dynamically
      const rampLength = Math.sqrt(floorElevation * floorElevation + runLength * runLength);
      const angle = Math.atan(floorElevation / runLength);

      const rampGeom = new THREE.BoxGeometry(rampLength, 0.04, 1.8);
      
      const isCompliant = rampSlope >= 12;
      const rampColor = isCompliant ? 0x10b981 : 0xef4444; // compliant green, else red
      const rampMat = new THREE.MeshLambertMaterial({ color: rampColor });
      const rampMesh = new THREE.Mesh(rampGeom, rampMat);
      
      rampMesh.rotation.z = -angle;
      rampMesh.position.set(runLength / 2, floorElevation / 2 - 0.02, 0);
      rampGroup.add(rampMesh);

      // Rails/Guides on sides of ramp
      const railGeom = new THREE.BoxGeometry(rampLength, 0.1, 0.04);
      const railMat = new THREE.MeshLambertMaterial({ color: 0x475569 });
      
      const railLeft = new THREE.Mesh(railGeom, railMat);
      railLeft.rotation.z = -angle;
      railLeft.position.set(runLength / 2, floorElevation / 2 + 0.05, 0.9);
      rampGroup.add(railLeft);

      const railRight = new THREE.Mesh(railGeom, railMat);
      railRight.rotation.z = -angle;
      railRight.position.set(runLength / 2, floorElevation / 2 + 0.05, -0.9);
      rampGroup.add(railRight);
    }

    rampGroup.position.set(5.75, 0.01, 3); // starts perfectly from the exit doorway of platform

    // 10. Handle window resize nicely
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 11. Mouse Orbit Drag listeners
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;

      const p = cameraParams.current;
      p.theta -= dx * 0.0075;
      p.phi += dy * 0.0075;
      p.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.06, p.phi)); // polar clamping

      prevMouse = { x: e.clientX, y: e.clientY };
      updateCamera();
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Zoom via wheel
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const p = cameraParams.current;
      p.radius += e.deltaY * 0.015;
      p.radius = Math.max(6, Math.min(32, p.radius));
      updateCamera();
    };

    // Touch support (1 finger rotate, 2 fingers pinch)
    let touchDistStart = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        touchDistStart = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - prevMouse.x;
        const dy = e.touches[0].clientY - prevMouse.y;

        const p = cameraParams.current;
        p.theta -= dx * 0.0075;
        p.phi += dy * 0.0075;
        p.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.06, p.phi));

        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        updateCamera();
        if (e.cancelable) e.preventDefault();
      } else if (e.touches.length === 2 && touchDistStart > 0) {
        const curDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = curDist - touchDistStart;
        const p = cameraParams.current;
        p.radius -= diff * 0.055;
        p.radius = Math.max(6, Math.min(32, p.radius));
        touchDistStart = curDist;
        updateCamera();
        if (e.cancelable) e.preventDefault();
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
      touchDistStart = 0;
    };

    const div = containerRef.current;
    div.addEventListener("mousedown", onMouseDown);
    div.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    div.addEventListener("wheel", onWheel, { passive: false });

    div.addEventListener("touchstart", onTouchStart, { passive: true });
    div.addEventListener("touchmove", onTouchMove, { passive: false });
    div.addEventListener("touchend", onTouchEnd, { passive: true });

    // Loop
    let animationFrameId: number;
    const tick = () => {
      animationFrameId = requestAnimationFrame(tick);
      
      // Auto-rotation (Respect prefers-reduced-motion!)
      if (!isDragging && !prefersReducedMotion) {
        cameraParams.current.theta += 0.002;
        updateCamera();
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mouseup", onMouseUp);
      if (div) {
        div.removeEventListener("mousedown", onMouseDown);
        div.removeEventListener("mousemove", onMouseMove);
        div.removeEventListener("wheel", onWheel);
        div.removeEventListener("touchstart", onTouchStart);
        div.removeEventListener("touchmove", onTouchMove);
        div.removeEventListener("touchend", onTouchEnd);
      }
      if (rendererRef.current && div) {
        try {
          div.removeChild(rendererRef.current.domElement);
        } catch (err) {}
        rendererRef.current.dispose();
      }
    };
  }, [threeLoaded, isCollapsed, showAsList, spatialAccommodations, rampSlope]);

  const renderTextTable = () => {
    const items = [
      {
        key: "ramp",
        nameAr: "المنحدرات والمداخل الخارجية",
        nameEn: "Main Entrance & Ramp",
        descAr: `منحدر مائل يدوي بميلان قابل للضبط المباشر. النسبة الحالية: 1:${rampSlope}.`,
        descEn: `Structural entrance ramp with custom slope slider. Current relative multiplier: 1:${rampSlope}.`,
        valAr: spatialAccommodations.ramp > 0 ? (rampSlope >= 12 ? "متوافق مع كود البناء السعودي (ميل ≤ ١:١٢)" : "غير مطابق - الانحدار شديد جداً (> ١:١٢)") : "لا يتطلب تهيئة حالياً",
        valEn: spatialAccommodations.ramp > 0 ? (rampSlope >= 12 ? "SBC Compliant (Slope ≤ 1:12)" : "Non-Compliant - Too Steep (> 1:12)") : "No adaptation required",
        statusAr: spatialAccommodations.ramp > 0 ? (rampSlope >= 12 ? "✅ مطابق" : "❌ غير مطابق") : "—",
        statusEn: spatialAccommodations.ramp > 0 ? (rampSlope >= 12 ? "✅ Compliant" : "❌ Non-Compliant") : "—",
        fundAr: funderMap.ramp === "employer" ? "المنشأة" : "دعم هدف",
        fundEn: funderMap.ramp === "employer" ? "Employer" : "HADAF"
      },
      {
        key: "desk_adjust",
        nameAr: "المحطة والمكتب المخصص",
        nameEn: "Mechanical Height desk",
        descAr: `مكتب مفرغ بمحرك كهربائي لضبط الارتفاع وملاءمة الذراعين.`,
        descEn: `Under-desk clear space with mechanical height adaptation gears.`,
        valAr: spatialAccommodations.desk_adjust > 0 ? `خلوص ذراع مخصص: ${spatialAccommodations.desk_adjust === 3 ? "١٢٠ سم (شامل)" : spatialAccommodations.desk_adjust === 2 ? "٩٥ سم (متوسط)" : "٧٨ سم (أساسي)"}` : "استخدام مكتب ثابت معياري (٧٢ سم)",
        valEn: spatialAccommodations.desk_adjust > 0 ? `Adjusted arm clearance: ${spatialAccommodations.desk_adjust === 3 ? "120 cm (High)" : spatialAccommodations.desk_adjust === 2 ? "95 cm (Mid)" : "78 cm (Low)"}` : "Static corporate desk (72 cm)",
        statusAr: spatialAccommodations.desk_adjust > 0 ? "✅ مطابق للكود" : "⏳ غير مهيأ",
        statusEn: spatialAccommodations.desk_adjust > 0 ? "✅ SBC Compliant" : "⏳ Normal static",
        fundAr: funderMap.desk_adjust === "employer" ? "المنشأة" : "دعم هدف",
        fundEn: funderMap.desk_adjust === "employer" ? "Employer" : "HADAF"
      },
      {
        key: "corridor",
        nameAr: "الممرات والأبواب الداخلية",
        nameEn: "Interior Corridors & Turning Paths",
        descAr: "حيز التفاف الكرسي المتحرك ١٨٠ درجة بخلفية خلوص دوران واسعة.",
        descEn: "180 degree turning diameter clearance for wheelchair maneuvering.",
        valAr: spatialAccommodations.corridor > 0 ? "عرض تيسيري ١٥٠ سم متوافق" : "عرض ممر عادي",
        valEn: spatialAccommodations.corridor > 0 ? "Compliant 150cm turn clearance" : "Standard static corridor",
        statusAr: spatialAccommodations.corridor > 0 ? "✅ مطابق ومثالي" : "⏳ تدقيق وقائي",
        statusEn: spatialAccommodations.corridor > 0 ? "✅ SBC Compliant" : "⏳ Standard corridor",
        fundAr: funderMap.corridor === "employer" ? "المنشأة" : "دعم هدف",
        fundEn: funderMap.corridor === "employer" ? "Employer" : "HADAF"
      },
      {
        key: "parking_mark",
        nameAr: "أرصفة ومواقف ذوي الإعاقة",
        nameEn: "ADA Parking Slots & Signs",
        descAr: "مساحة وقوف مخططة وعريضة لضمان النزول السلس والآمن للكراسي.",
        descEn: "Accessible wider parking slot featuring blue paint and yellow lanes.",
        valAr: spatialAccommodations.parking_mark > 0 ? "موقف واسع مطلي ومعلّم" : "استخدام مواقف عامة عادية",
        valEn: spatialAccommodations.parking_mark > 0 ? "MAPPED ADA accessibility slot" : "Normal corporate space",
        statusAr: spatialAccommodations.parking_mark > 0 ? "✅ مطابق لكود بلدي" : "—",
        statusEn: spatialAccommodations.parking_mark > 0 ? "✅ SBC Compliant" : "—",
        fundAr: funderMap.parking_mark === "employer" ? "المنشأة" : "دعم هدف",
        fundEn: funderMap.parking_mark === "employer" ? "Employer" : "HADAF"
      }
    ];

    return (
      <div className="overflow-x-auto select-text">
        <table className="w-full text-xs text-slate-300 border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 font-black">
              <th className="p-3 text-right">{language === "ar" ? "عنصر التهيئة" : "Accessibility Item"}</th>
              <th className="p-3 text-right">{language === "ar" ? "المقاييس الفنية المدخلة" : "Spatial Metrics & Input"}</th>
              <th className="p-3 text-right">{language === "ar" ? "حالة كود البناء السعودي" : "Saudi Code Compliance"}</th>
              <th className="p-3 text-right">{language === "ar" ? "جهة التمويل" : "Funding Node"}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.key} className="border-b border-slate-900/80 hover:bg-slate-950/30 transition">
                <td className="p-3 text-right font-bold text-white">
                  <div>{language === "ar" ? item.nameAr : item.nameEn}</div>
                  <div className="text-[10px] text-slate-500 font-normal">{language === "ar" ? item.descAr : item.descEn}</div>
                </td>
                <td className="p-3 text-right font-mono text-slate-300">
                  {language === "ar" ? item.valAr : item.valEn}
                </td>
                <td className="p-3 text-right font-black">
                  <span className={item.valAr.includes("غير") || item.valEn.includes("Non-Compliant") ? "text-rose-400" : "text-emerald-400"}>
                    {language === "ar" ? item.statusAr : item.statusEn}
                  </span>
                </td>
                <td className="p-3 text-right text-slate-400">
                  {spatialAccommodations[item.key] > 0 ? (language === "ar" ? item.fundAr : item.fundEn) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="glass-card p-5 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">
              {language === "ar" 
                ? "مخطط البيئة والوصول التفاعلي ثلاثي الأبعاد" 
                : "3D Interactive Environmental Layout Visualizer"}
            </h3>
            <p className="text-[10px] text-slate-400">
              {language === "ar" 
                ? "تمثيل تخطيطي توضيحي للأبعاد المدخلة" 
                : "Schematic representation of inputted dimensions"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowAsList(!showAsList)}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-300 transition"
          >
            {showAsList 
              ? (language === "ar" ? "🔄 الانتقال للمشهد ثلاثي الأبعاد" : "🔄 View 3D Scene") 
              : (language === "ar" ? "📋 عرض تفاصيل كقائمة نصية" : "📋 View Details as List")}
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-300 transition"
          >
            {isCollapsed 
              ? (language === "ar" ? "توسيع الصفحة ➕" : "Expand ➕") 
              : (language === "ar" ? "طي الصفحة ➖" : "Collapse ➖")}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="space-y-4">
          
          {/* Main Visual Display */}
          {showAsList ? (
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-900">
              {renderTextTable()}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              {/* Box container for WebGL Canvas */}
              <div className="lg:col-span-2 relative">
                
                {/* 3D Canvas element */}
                <div 
                  ref={containerRef} 
                  className="w-full h-[320px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 cursor-grab active:cursor-grabbing shadow-inner flex items-center justify-center relative touch-none"
                >
                  {(threeLoadFailed || !threeLoaded) && (
                    <div className="p-6 text-center space-y-3">
                      <div className="text-rose-400 font-bold">
                        ⚠️ {language === "ar" ? "فشل تحميل مكتبة التحريك ثلاثي الأبعاد" : "3D graphics failed to load"}
                      </div>
                      <div className="text-xs text-slate-400 max-w-sm">
                        {language === "ar" 
                          ? "يرجى التحقق من اتصال الشبكة بالإنترنت أو الاعتماد على وضع العرض كقائمة بدلاً من ذلك." 
                          : "Please check your network settings. We have fell back dynamically to the text list view."}
                      </div>
                    </div>
                  )}
                </div>

                {/* Manual Rotation / Zoom buttons under the canvas for keyboard & accessibility */}
                {threeLoaded && !threeLoadFailed && (
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2">
                    {/* Rotate Controls */}
                    <div className="flex bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-800/80 pointer-events-auto gap-1">
                      <button
                        type="button"
                        onClick={() => handleRotate("ccw")}
                        className="p-1 px-2.5 rounded-lg text-[10px] text-slate-300 hover:text-white bg-slate-900 font-extrabold flex items-center gap-1 transition animate-bounce-slow"
                        title={language === "ar" ? "تدوير يسار" : "Rotate Left"}
                      >
                        <span>↺</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRotate("cw")}
                        className="p-1 px-2.5 rounded-lg text-[10px] text-slate-300 hover:text-white bg-slate-900 font-extrabold flex items-center gap-1 transition animate-bounce-slow"
                        title={language === "ar" ? "تدوير يمين" : "Rotate Right"}
                      >
                        <span>↻</span>
                      </button>
                    </div>

                    {/* Zoom Controls */}
                    <div className="flex bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-800/80 pointer-events-auto gap-1">
                      <button
                        type="button"
                        onClick={() => handleZoom("in")}
                        className="p-1 px-2.5 rounded-lg text-[10px] text-slate-300 hover:text-white bg-slate-900 font-extrabold flex items-center gap-1 transition animate-bounce-slow"
                        title={language === "ar" ? "تقريب" : "Zoom In"}
                      >
                        <span>+</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleZoom("out")}
                        className="p-1 px-2.5 rounded-lg text-[10px] text-slate-300 hover:text-white bg-slate-900 font-extrabold flex items-center gap-1 transition animate-bounce-slow"
                        title={language === "ar" ? "إبعاد" : "Zoom Out"}
                      >
                        <span>−</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Slider panel on the right side of canvas */}
              <div className="lg:col-span-1 space-y-4 flex flex-col justify-between">
                
                {/* Dynamic sliders & inputs */}
                <div className="space-y-4">
                  {spatialAccommodations.ramp > 0 ? (
                    <div className="space-y-2.5 bg-slate-950 p-4 border border-slate-900 rounded-2xl">
                      <label className="text-xs text-slate-300 font-bold flex justify-between pr-0.5">
                        <span>{language === "ar" ? "ميل انحدار المنحدر:" : "ADA Ramp Incline:"}</span>
                        <span className="font-mono text-indigo-400 font-black">1 : {rampSlope}</span>
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="20"
                        value={rampSlope}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setRampSlope(v);
                          if (onRampSlopeChange) onRampSlopeChange(v);
                          
                          const compStr = v >= 12 
                            ? (language === "ar" ? "متوافق مع كود البناء السعودي" : "SBC Compliant") 
                            : (language === "ar" ? "غير متوافق - الانحدار شديد" : "Non-compliant (Too Steep)");
                          onAnnounce(
                            language === "ar"
                              ? `تم تحديث ميل المنحدر إلى 1:${v}. حالة التوافق الهندسية: ${compStr}.`
                              : `Ramp slope adjusted to 1:${v}. Code compliance status: ${compStr}.`
                          );
                        }}
                        className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className={`w-2 h-2 rounded-full ${rampSlope >= 12 ? "bg-emerald-500 animate-pulse" : "bg-rose-500 animate-pulse"}`}></span>
                        <span className={`text-[10px] font-black uppercase ${rampSlope >= 12 ? "text-emerald-400" : "text-rose-400"}`}>
                          {rampSlope >= 12 
                            ? (language === "ar" ? "متوافق ومثالي (ميل ≤ ١:١٢)" : "SBC Compliant (Slope ≤ 1:12)")
                            : (language === "ar" ? "غير مطابق - حاد جداً (> ١:١٢)" : "Non-Compliant - Too Steep (> 1:12)")}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-900 text-center space-y-1">
                      <p className="text-xs text-slate-400 font-bold">
                        {language === "ar" ? "المنحدر الخارجي غير مفعّل" : "Entrance Ramp Disabled"}
                      </p>
                      <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                        {language === "ar" 
                          ? "قم بتفعيل خيار 'المنحدرات والمداخل الخارجية' من قائمة ترتيبات خطوة 4 أعلاه لإظهاره وتعديل ميله." 
                          : "Enable 'Main Entrance & Ramp' in step 4 check catalog above to preview and adjust its parameters."}
                      </p>
                    </div>
                  )}

                  {/* Desk adjust report widget */}
                  <div className="p-4 bg-slate-950 p-4 border border-slate-900 rounded-2xl text-xs space-y-1.5">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">
                      {language === "ar" ? "حالة محطة العمل (مكتب)" : "Workstation Height Status"}
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">
                        {spatialAccommodations.desk_adjust > 0 
                          ? (language === "ar" ? "معدل - خلوص هيدروليكي" : "Adjustable Hydraulic desk") 
                          : (language === "ar" ? "ثابت معياري" : "Standard static desk")}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black ${spatialAccommodations.desk_adjust > 0 ? "bg-cyan-500/10 text-cyan-400" : "bg-slate-800 text-slate-400"}`}>
                        {spatialAccommodations.desk_adjust > 0 
                          ? (language === "ar" ? `مستوى ${spatialAccommodations.desk_adjust}` : `Level ${spatialAccommodations.desk_adjust}`) 
                          : (language === "ar" ? "معياري" : "Standard")}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed md:pt-1">
                      {spatialAccommodations.desk_adjust > 0 
                        ? (language === "ar" ? "يظهر المكتب باللون الذهبي/البرونزي المرتفع لضمان ملاءمة مساند الكرسي التيسيري." : "Golden desk height clearance increased to allow smooth wheelchair armrest entry.")
                        : (language === "ar" ? "مستقر على ارتفاع افتراضي عادي (٧٢ سم) بلا ممرات مرور كهربائية." : "Stationed on standard default desktop layout (72cm height clearance).")}
                    </p>
                  </div>
                </div>

                {/* Decorative Compliance stamp */}
                <div className="p-3 bg-indigo-950/15 border border-indigo-950/40 rounded-xl flex items-center justify-between text-[10px] text-indigo-300">
                  <span>{language === "ar" ? "امتثال كود بلدي والمعيار:" : "Balady & SBC Verification:"}</span>
                  <span className="font-bold font-mono text-emerald-400">SBC-201-11</span>
                </div>

              </div>

            </div>
          )}

          {/* Subtitle label tag */}
          <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500">
            <span>{language === "ar" ? "* مخطط بيئي تشريحي هجين" : "* Hybrid structural spatial diagram"}</span>
            <span className="italic">{language === "ar" ? "تمثيل تخطيطي توضيحي للأبعاد المدخلة" : "Schematic representation of inputted dimensions"}</span>
          </div>

        </div>
      )}

    </div>
  );
}
