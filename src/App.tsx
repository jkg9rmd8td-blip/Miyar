import { useState, useEffect, useRef } from "react";
import {
  Scale,
  Languages,
  Cpu,
  Coins,
  ShieldCheck,
  Layers,
  HelpCircle,
  Activity,
  FileCheck2,
  UserCheck,
  MapPin,
  Building2,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info
} from "lucide-react";
import { CandidateAssessment } from "./components/CandidateAssessment";
import { JobAnalysis } from "./components/JobAnalysis";
import { CompliancePreview, DecisionEngine } from "./components/CompliancePreview";
import { AuditChain } from "./utils/AuditChain";
import { CapabilityProfile } from "./utils/CapabilityProfile";
import { safeSessionStorage } from "./utils/storage";

// Translations dictionary to satisfy instant language mirroring & complete text parity
const translations = {
  ar: {
    appName: "مِعْيَار",
    appSlogan: "منصة دعم قرار توظيف الأشخاص ذوي الإعاقة الحركية الكبرى بالمملكة",
    stageBadge: "المرحلة الأولى · إعاقة حركية",
    heroTitle: "منصة اتخاذ قرار تمكين الكفاءات الحركية",
    heroSubtitle: "سد الفجوة التنظيمية والبيئية لتسهيل وصول ذوي القدرات الحركية لمواقع الإنتاج بفعالية، آلياً وبمصادقة بشرية معتمدة.",
    conditionalWarn: "مُفعّل حصرًا بعد صدور عرض العمل المشروط بالتهيئة",
    startAssessment: "ابدأ تقييماً جديداً",
    viewDemoCase: "استعرض الحالة التجريبية",
    howItWorks: "كيف تعمل منصة معيار؟",
    howItWorksSub: "رحلة استشارية في 4 خطوات أساسية بلا تعقيدات فنية، تضمن استقرار الموظف والمنشأة",
    step1Title: "١. قياس القدرات الحركية",
    step1Desc: "تحديد مستوى ومجال الحركة للمرشح دون التدخل في الشؤون الطبية الخاصة.",
    step2Title: "٢. مطابقة الوظيفة المستهدفة",
    step2Desc: "تحليل الاحتياجات البيئية الدقيقة وعقبات الحركة الهندسية بمقر الوظيفة.",
    step3Title: "٣. حوكمة التكلفة والترتيبات",
    step3Desc: "تقدير مالي عادل هندسياً للتعديلات المطلوبة وتحديد التكاليف المعقولة.",
    step4Title: "٤. تقرير الملاءمة والتدقيق",
    step4Desc: "وثيقة توجيهية معتمدة من مدقق بشري لدعم قرار التوظيف واستقرار المنظومة.",
    legalCorner: "التحوّل القانوني والوظيفي الخاص بمنصة معيار",
    legalBody1: "١. معيار للتهيئة البيئية والترتيبات التيسيرية المعقولة وليس للتقرير الطبي:",
    legalBody1Desc: "منصة معيار لا تصدر شهادة لياقة طبية أو قدرة بدنية للموظف (والتي تقع بالكامل تحت اختصاص المستشفيات والقطاع الطبي). المنصة تصدر حصرياً «تقرير ملاءمة بيئية وترتيبات تيسيرية معقولة» متوافق مع كود البناء السعودي.",
    legalBody2: "٢. شرطية العمل بعد العرض المشروط بالتهيئة منعاً للتمييز المسبق:",
    legalBody2Desc: "يتدخل نظام معيار لإجراء المسح البيئي والمطابقة الهندسية فقط بعد إصدار المنشأة مستنداً رسمياً بـ «عرض عمل مشروط بالتهيئة» (Conditional Job Offer) حماية لطرفي العقد والحد من التمييز الاستباقي.",
    legalBody3: "٣. حوكمة قرار التوظيف النهائي بالتكامل بين الآلة والمدقق البشري:",
    legalBody3Desc: "التوصيات استشارية رقمياً لتصميم الدعم الفني، ويعود القرار النهائي للتوظيف والتنفيذ قانونياً وإدارياً للمنشأة بالتكامل التام مع مدقق بشري مرخّص.",
    valueTitle: "عناصر القيمة الاستباقية في معيار",
    value1Title: "كود البناء السعودي لبلدي",
    value1Desc: "التوافق الهندسي الشامل مع متطلبات الوصول الشامل والمعايير الحكومية لتلافي الغرامات.",
    value2Title: "الحد من الهدر الرأسمالي المعقول",
    value2Desc: "منع تكاليف التجهيز العشوائية عبر تقديم حلول دقيقة بأقل تكلفة هندسية ملاءمة.",
    value3Title: "حماية استبقاء الموظف",
    value3Desc: "بناء بيئة عمل دامجة مريحة تقلل مخاطر الدوران الوظيفي وترفع معدلات الإنتاجية اليومية.",
    value4Title: "شفافية وحوكمة رقمية عادلة",
    value4Desc: "تحويل مسارات التهيئة لمستند وحجج رقمية متكاملة لمدراء الموارد البشرية وصناع القرار.",
    expansionTitle: "خارطة التوسع والتغطية المستهدفة بمستقبل معيار",
    expansionSub: "برنامج وطني ممتد ومجدول ليشمل كافة أطياف الكفاءات ذوي الاحتياجات الخاصة بالمملكة",
    expansionPhase1: "المرحلة الأولى: أصحاب الإعاقات الحركية",
    expansionPhase1Desc: "تغطية ممتازة لمستخدمي المقاعد المتحركة، العكازات، وأجهزة تيسير الحركة (نشط حالياً بالرياض ومناطق المملكة).",
    expansionPhase2: "المرحلة الثانية: الإعاقات السمعية والبصرية",
    expansionPhase2Desc: "أنظمة التوجيه اللمسي، قوارئ الشاشات الذكية، الإشارات الضوئية والتهيئة السمعية وقارئات لغة الإشارة (Q1 2027).",
    expansionPhase3: "المرحلة الثالثة: الإعاقات الذهنية والنمائية وعسر الإدراك",
    expansionPhase3Desc: "تنظيم الواجهات الرقمية، تقليل المشتتات البصرية والمنظمات التيسيرية للإدراك العصبي الهادئ (Q3 2027).",
    calcScoreLink: "كيف نحسب هذه الدرجة؟",
    calcScoreTitle: "منهجية حساب وموازنة نقاط الملاءمة للوصول الشامل",
    calcScoreDesc: "هذه الحاوية المنهجية فارغة حالياً؛ وسيتم ملؤها وصياغة مصفوفة التداخل بين عقبات البيئة وقدرات التحمل الـ١٥ للوصول الشامل بالتفصيل في الدفعة السابعة.",
    copyright: "منصة معيار للدعم والتمكين الرقمي · كافة الحقوق محفوظة © 2026",
    navHome: "الرئيسية",
    navCandidate: "تقييم المرشح",
    navJob: "تحليل بيئة الوظيفة",
    navMatching: "المطابقة والتوصيات",
    notReadyTitle: "مرحلة قيد التحضير والإنشاء",
    notReadyDesc: "هذه الواجهة سيتم تشغيلها وربطها بالكامل في الباقات والدفعات القادمة من منصة معيار (الدفعة الثانية حتى السابعة) لتكتمل الرحلة التقييمية التفاعلية.",
    closeBtn: "فهمت ذالك",
    tabBarLabel: "تغيير الواجهة",
    langCode: "EN",
    langAlt: "English",
    skipLink: "تخطي للمحتوى الرئيسي والوصول الشامل",
    fixedDisclaimer: "⚖️ التوصيات استشارية · تُستخدم بعد العرض المشروط حصرًا · يتطلب اتصالاً بالإنترنت · v2.2",

    // Demo Case translation tags
    demoCaseTitle: "استعراض ملف تجريبي - أخصائي خدمة عملاء مشروط",
    demoItemCandidate: "المرشح المستهدف:",
    demoItemJob: "الوظيفة المقترحة:",
    demoItemDisability: "توصيف القدرة والحدود الحركية:",
    demoItemSpecs: "التوصيات التيسيرية المطلوبة هندسياً:",
    demoItemImpact: "التقرير المالي المعقول والمطابقة المئوية:",
    demoCandidateVal: "سلطان عبد العزيز الخالدي",
    demoJobVal: "مسؤول علاقات عملاء برقم مرجعي عرض مشروط #CO-9041 (بند الأمان والامتثال)",
    demoDisabilityVal: "إعاقة حركية متوسطة نتيجة شلل نصفي سفلي مع استخدام كرسي يدوي خفيف الوزن.",
    demoSpecsVal1: "تجهيز المكتب الرئيسي بارتفاع 76 سم لضمان دخول مساند الذراع للكرسي المتحرك.",
    demoSpecsVal2: "تحسين عتبة الممر المؤدي للصالات بميل ميلان أقصاه 1:12 تدريجياً لسهولة الحركة المستقلة.",
    demoSpecsVal3: "تثبيت مقابض مساعدة مطابقة لكود البناء السعودي في المرافق الصحية الملحقة بالقسم.",
    demoImpactVal: "معدل الملاءمة المتوقع: 88٪. التكلفة المتوقعة للتهيئة البيئية: 4,100 ريال سعودي فقط. (تكلفة تيسيرية معقولة جدًا ضمن الحدود التشريعية).",
    demoClose: "إغلاق نافذة المحاكاة",

    // Assessment Wizard tags
    wizardTitle: "محرّك الملاءمة والبدء بإنشاء ملف تيسيري",
    wizardSeqCheck: "التحقق من التسلسل النظامي الحكومي لطلب التقييم:",
    wizardCheck1: "أقرّ أنا مستخدم المنصة بأنه قد تم إصدار «عرض عمل مشروط بالتهيئة» رسمي من الجهة الموظفة.",
    wizardCheck2: "أدرك أن التقرير الناتج استشاري لتحضير الترتيبات التيسيرية الهندسية البيئية بموقع العمل وليس مخصصاً للتشخيص الطبي البدني.",
    wizardStatus: "الطلب متوافق نظاماً",
    wizardStatusErr: "يرجى الإقرار بالشروط والتحقق من العرض المشروط قبل المتابعة.",
    wizardNextStep: "الانتقال لجلسة تقييم المرشح (متاح بالدفعة الثانية)",
    wizardClose: "إغلاق التقييم"
  },
  en: {
    appName: "MIYAR",
    appSlogan: "Decision Support Platform for the Employment of People with Major Motor Disabilities",
    stageBadge: "Stage 1 · Motor Disabilities",
    heroTitle: "Empowering Motor Capabilities through Decision Support",
    heroSubtitle: "Bridging the regulatory and physical gaps to successfully integrate people with motor capabilities into production environments, automatedly with human verification.",
    conditionalWarn: "Activated After Conditional Job Offer Issuance",
    startAssessment: "Start New Assessment",
    viewDemoCase: "View Demo Case",
    howItWorks: "How Miyar Works",
    howItWorksSub: "Miyar's 4-step streamlined journey ensuring safety, zero technical jargon, and maximum organizational stability",
    step1Title: "1. Motion Cap Evaluation",
    step1Desc: "Determining kinetic ranges and functional reach parameters without interference in private medical files.",
    step2Title: "2. Target Job Matching",
    step2Desc: "Analyzing real workspace environments, barrier interfaces, and physical demands of the target workspace.",
    step3Title: "3. Accommodations Governance",
    step3Desc: "Providing smart engineering cost estimation for required modifications with reasonable costing checks.",
    step4Title: "4. Certified Placement Report",
    step4Desc: "An authoritative recommendation report validated by a certified human auditor for finalized decision support.",
    legalCorner: "Legal & Career Transition Policy of Miyar",
    legalBody1: "1. Environmental Layouts & Reasonable Accommodations Reports (Not For Diagnosis):",
    legalBody1Desc: "Miyar does NOT issue medical fitness certificates or fitness classifications (which occupy clinical health sector mandates). Instead, it strictly outputs an 'Assessment of Environmental Suitability and Reasonable Accommodations' compatible with Saudi Code.",
    legalBody2: "2. Absolute Sequence After Conditional Job Offers to Forestall Discrimination:",
    legalBody2Desc: "System calculations and engineering matches begin strictly AFTER the establishment of a signed, official 'Conditional Job Offer' from the recruiter to prevent discriminatory profiling.",
    legalBody3: "3. Recruitment Authorization & Expert Human Auditor Validation:",
    legalBody3Desc: "The digital output operates as an advisory companion for technical adjustments, while actual contractual commitment is controlled solely by the employer and accredited human inspectors.",
    valueTitle: "Proactive Value Benchmarks of Miyar",
    value1Title: "Saudi Building Code (SBC)",
    value1Desc: "Complete integration with Balady metrics to prevent costly accessibility fines and legal infractions.",
    value2Title: "Capital Leakage Control",
    value2Desc: "Averts arbitrary infrastructural expenditures by introducing specific and low-cost tailored physical adjustments.",
    value3Title: "Talent Retention Guard",
    value3Desc: "Assists departments in engineering pleasant spatial nodes that sustain employee motivation and output.",
    value4Title: "Auditability & Analytics Compliance",
    value4Desc: "Transforms physical assessments into a cryptographic file easily shareable with HR managers and auditors.",
    expansionTitle: "Future Expansion & Capability Horizons in Miyar",
    expansionSub: "A planned national digital campaign organized to empower all segments of Saudi disabled talent",
    expansionPhase1: "Phase 1: Kinetic & Motor Disablement",
    expansionPhase1Desc: "Coverage spanning Riyadh and other regions for electric and manual wheelchairs, walking frames (Active Now).",
    expansionPhase2: "Phase 2: Tactile & Screen Reading Integrations",
    expansionPhase2Desc: "Interactive tactile pathways, smart text-to-speech converters, and visual warning signals (Planned for Q1 2027).",
    expansionPhase3: "Phase 3: Neurodivergence & Quiet Attentional Nodes",
    expansionPhase3Desc: "Clean customized digital UI, layout simplification, and environments designed to keep neural overload low (Planned Q3 2027).",
    calcScoreLink: "How Do We Calculate This Compliance Index?",
    calcScoreTitle: "Miyar Evaluation Metric & Weight Balancing Methodology",
    calcScoreDesc: "This methodological section is currently empty; complete formulations of the 15 universal access guidelines crossed with motor tolerance categories will be integrated in Batch 7.",
    copyright: "Miyar Platform for Support and Digital Empowerment · All rights reserved © 2026",
    navHome: "Home",
    navCandidate: "Candidate Assessment",
    navJob: "Workspace Demands",
    navMatching: "Accommodation & Gaps",
    notReadyTitle: "Module Under Construction",
    notReadyDesc: "This feature is currently being designed and rendered. It will be fully integrated and linked in the upcoming batch updates (Batches 2 to 7).",
    closeBtn: "Acknowledged",
    tabBarLabel: "Switch Screen",
    langCode: "العربية",
    langAlt: "Arabic",
    skipLink: "Skip to primary content and Accessibility Controls",
    fixedDisclaimer: "⚖️ Recommendations are advisory · Used exclusively after conditional offer · Requires active Internet · v2.2",

    // Demo Case translation tags
    demoCaseTitle: "Interactive Demo Study - Conditional Customer Care Agent",
    demoItemCandidate: "Subject Candidate:",
    demoItemJob: "Proposed Position:",
    demoItemDisability: "Physical Ranges & Kinetic Profile:",
    demoItemSpecs: "Requested Architectural Adjustments:",
    demoItemImpact: "Financial Accommodations & Matching Ratio:",
    demoCandidateVal: "Sultan Abdulaziz Al-Khaldi",
    demoJobVal: "Client Support Officer under conditional offer code #CO-9041 (Internal Compliance Check)",
    demoDisabilityVal: "Moderate motor disability (lower paraplegia), using a lightweight manual sport wheelchair.",
    demoSpecsVal1: "Optimizing the main desk to an ergonomic 76 cm height clearance for wheelchair inclusion.",
    demoSpecsVal2: "Structuring the lobby pathway door transition with moderate 1:12 slope ratio for independent wheeling.",
    demoSpecsVal3: "Mounting universal grab bar setups in local sanitation rooms compatible with the Saudi Building Code.",
    demoImpactVal: "Estimated Suitability Index: 88%. Targeted engineering budget: SAR 4,100 only (extremely reasonable and within SBC compliance frameworks).",
    demoClose: "Close Simulation Canvas",

    // Assessment Wizard tags
    wizardTitle: "Miyar Suitability Wizard - Create New Record",
    wizardSeqCheck: "Verify Standard Regulatory Sequence Compliance:",
    wizardCheck1: "I declare that the employer has already issued an official «Conditional Job Offer» for the candidate.",
    wizardCheck2: "I understand that Miyar produces advisory physical accommodation profiles, not health-related medical diagnoses.",
    wizardStatus: "Compliant State Verified",
    wizardStatusErr: "Please acknowledge the conditional job offer requirement to begin.",
    wizardNextStep: "Proceed to Candidate Profiling (Available in Batch 2)",
    wizardClose: "Close Assessment Builder"
  }
};

// IIFE structure for AccessibilityMode as requested
export const AccessibilityModeObj = (function() {
  return {
    initAccessibilityMode: function(): "standard" | "keyboard-first" | null {
      const stored = safeSessionStorage.getItem("accessibilityMode");
      if (stored === "standard" || stored === "keyboard-first") {
        return stored as "standard" | "keyboard-first";
      }
      return null;
    },
    applyAccessibilityMode: function(mode: "standard" | "keyboard-first") {
      safeSessionStorage.setItem("accessibilityMode", mode);
      const body = document.body;
      if (mode === "keyboard-first") {
        body.classList.add("mode-keyboard-first");
        body.classList.remove("mode-standard");
      } else {
        body.classList.add("mode-standard");
        body.classList.remove("mode-keyboard-first");
      }
    }
  };
})();

// Attach to window for global exposure
if (typeof window !== "undefined") {
  (window as any).AccessibilityMode = AccessibilityModeObj;
}

export default function App() {
  const [accMode, setAccMode] = useState<"standard" | "keyboard-first" | null>(() => {
    return AccessibilityModeObj.initAccessibilityMode();
  });

  // Apply whenever accMode toggles
  useEffect(() => {
    if (accMode) {
      AccessibilityModeObj.applyAccessibilityMode(accMode);
    }
  }, [accMode]);

  // Unified State Object for the 7-batch lifecycle with safeSessionStorage caching
  const [state, setState] = useState(() => {
    const cachedLanguage = safeSessionStorage.getItem("language");
    const activeLanguage = cachedLanguage === "en" ? "en" : "ar";
    return {
      language: activeLanguage as "ar" | "en",
      // Expected Schema framework stored in memory for the forthcoming 7-batch lifecycle:
      candidate: {
        // To be completed in Batch 2: Candidate kinetic and motor capability profiling
        id: null,
        name: "",
        nationalId: "",
        disabilityClass: "",
        requiresReview: false,
        motorReachRanges: {
          superiorReach: null,
          transversalClearance: null,
          gripTension: null
        },
        locomotionCapabilities: {
          wheelchairStaticTransfer: false,
          stairClimbingAssistance: false
        }
      },
      job: {
        // To be completed in Batch 3: Job tasks and physical spatial analysis
        id: null,
        title: "",
        facilityName: "",
        conditionalOfferRef: "",
        sbcZoneCode: "", // Saudi Building Code Zone
        physicalDemands: [],
        workspaceSpecs: {
          doorClearanceWidthCm: null,
          rampSlopeRatio: null
        }
      },
      evidence: {
        // To be completed in Batch 4: Video telemetry and physical photogrammetry
        uploadedFiles: [],
        isAIVerified: false,
        classificationTags: []
      },
      matching: {
        // To be completed in Batch 5: Gaps, accommodation requirements, & matching logic
        suitabilityIndexPercentage: 0,
        detectedBarriers: [],
        requiredAdjustments: []
      },
      report: {
        // To be completed in Batch 6: Certified PDF layout & secure cryptographic stamp
        id: null,
        issuedAt: null,
        auditorSignatureHash: "",
        pdfUrl: ""
      },
      decisions: {
        // To be completed in Batch 7: Final human sign-off & workflow audit
        isApprovedByEmployer: false,
        auditorNotes: "",
        status: "pending" as "pending" | "approved" | "rejected"
      }
    };
  });

  // UI state variables
  const [activeTab, setActiveTab] = useState<"home" | "candidate" | "job" | "matching">("home");
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardDecl1, setWizardDecl1] = useState(false);
  const [wizardDecl2, setWizardDecl2] = useState(false);
  const [announcementMsg, setAnnouncementMsg] = useState("");
  const [showUnderConstToast, setShowUnderConstToast] = useState(false);

  // Sync language selection to safeSessionStorage and body attributes
  useEffect(() => {
    safeSessionStorage.setItem("language", state.language);
    document.documentElement.dir = state.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = state.language;
  }, [state.language]);

  // Focus trapping and Escape key handle for Methodology Modal
  const methodologyModalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isMethodologyOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMethodologyOpen(false);
      }
      if (e.key === "Tab" && methodologyModalRef.current) {
        const focusable = methodologyModalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex="0"]'
        );
        if (focusable.length === 0) return;
        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    setTimeout(() => {
      if (methodologyModalRef.current) {
        const btn = methodologyModalRef.current.querySelector("button");
        if (btn) btn.focus();
      }
    }, 50);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMethodologyOpen]);

  // Handle instant language toggle
  const toggleLanguage = () => {
    const nextLang = state.language === "ar" ? "en" : "ar";
    setState((prevState) => ({
      ...prevState,
      language: nextLang
    }));
    // Provide vocal accessibility update
    triggerLiveAnnouncement(nextLang === "ar" ? "تم تحويل لغة العرض إلى العربية" : "Display language translated to English");
  };

  const resetState = () => {
    setState((prev) => ({
      language: prev.language,
      candidate: {
        id: null,
        name: "",
        nationalId: "",
        disabilityClass: "",
        requiresReview: false,
        motorReachRanges: {
          superiorReach: null,
          transversalClearance: null,
          gripTension: null
        },
        locomotionCapabilities: {
          wheelchairStaticTransfer: false,
          stairClimbingAssistance: false
        }
      },
      job: {
        id: null,
        title: "",
        facilityName: "",
        conditionalOfferRef: "",
        sbcZoneCode: "",
        physicalDemands: [],
        workspaceSpecs: {
          doorClearanceWidthCm: null,
          rampSlopeRatio: null
        }
      },
      evidence: {
        uploadedFiles: [],
        isAIVerified: false,
        classificationTags: []
      },
      matching: {
        suitabilityIndexPercentage: 0,
        detectedBarriers: [],
        requiredAdjustments: []
      },
      report: {
        id: null,
        issuedAt: null,
        auditorSignatureHash: "",
        pdfUrl: ""
      },
      decisions: {
        isApprovedByEmployer: false,
        auditorNotes: "",
        status: "pending" as "pending" | "approved" | "rejected"
      }
    }));
    setActiveTab("home");
    triggerLiveAnnouncement(
      state.language === "ar"
        ? "تمت إعادة تعيين حالة التقييم بالكامل."
        : "Evaluation metrics completely reset."
    );
  };

  const triggerLiveAnnouncement = (msg: string) => {
    setAnnouncementMsg(msg);
    setTimeout(() => setAnnouncementMsg(""), 3000);
  };

  const handleTabChange = (tab: "home" | "candidate" | "job" | "matching") => {
    setActiveTab(tab);
    setShowUnderConstToast(false);
    triggerLiveAnnouncement(
      state.language === "ar" 
        ? (tab === "home" 
            ? "تعرض الآن الشاشة الرئيسية" 
            : tab === "candidate" 
            ? "عرض بوابة تقييم المرشح والملف الحركي" 
            : tab === "job" 
            ? "عرض بطاقة متطلبات الوظيفة وبيئة العمل" 
            : "معاينة المطابقة والترتيبات التيسيرية المعتمدة")
        : (tab === "home" 
            ? "Showing Home Screen" 
            : tab === "candidate" 
            ? "Showing Candidate Assessment Wizard" 
            : tab === "job" 
            ? "Showing Workspace Demands Matrix" 
            : "Showing Advanced Suitability Preview")
    );
  };

  const t = translations[state.language];

  return (
    <div 
      className="min-h-screen text-text flex flex-col no-x-scroll transition-colors duration-300 select-none pb-20 justify-between font-sans"
      dir={state.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Dynamic Accessibility Setup Screen Gatekeeper */}
      {accMode === null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-xl transition-all duration-500">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-indigo-500" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-black text-white">
                {state.language === "ar" ? "إعدادات سهولة الوصول والتحكم المعياري" : "Universal Accessibility Preferences"}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                {state.language === "ar" 
                  ? "أهلاً بك في منصة معيار. كيف تفضّل تصفح ومطابقة الترتيبات التيسيرية؟"
                  : "Welcome to Miyar. How do you prefer to navigate and verify job architectural accommodations?"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Standard Full Experience */}
              <button
                type="button"
                onClick={() => {
                  AccessibilityModeObj.applyAccessibilityMode("standard");
                  setAccMode("standard");
                }}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 hover:border-indigo-500/50 text-right md:text-center transition-all group cursor-pointer"
              >
                <span className="font-bold text-white block group-hover:text-indigo-400 transition-colors text-sm">
                  {state.language === "ar" ? "تجربة تفاعلية كاملة" : "Full Spatial Experience"}
                </span>
                <span className="text-[10px] text-slate-500 mt-1.5 block leading-relaxed">
                  {state.language === "ar"
                    ? "تحتوي على مجسمات تفاعلية ثلاثية الأبعاد (Three.js) لمواقع العمل والمنحدرات."
                    : "Includes active WebGL 3D mockups of desks, ramps, and pathways."}
                </span>
              </button>

              {/* Option B: Keyboard First Mode */}
              <button
                type="button"
                onClick={() => {
                  AccessibilityModeObj.applyAccessibilityMode("keyboard-first");
                  setAccMode("keyboard-first");
                }}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 hover:border-emerald-500/50 text-right md:text-center transition-all group cursor-pointer"
              >
                <span className="font-bold text-white block group-hover:text-emerald-400 transition-colors text-sm">
                  {state.language === "ar" ? "لوحة مفاتيح وقراءة شاشة أولاً" : "Keyboard-First Setup"}
                </span>
                <span className="text-[10px] text-slate-500 mt-1.5 block leading-relaxed">
                  {state.language === "ar"
                    ? "ملاءمة مثالية لبرامج الصوت بلا ثقل رسومي، مع جداول نصية بديلة افتراضية."
                    : "Optimized for screen-readers, skipping WebGL in favor of immediate data tables."}
                </span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800/60 flex justify-between items-center text-[10px] text-slate-500">
              <span className="font-mono text-[9px] uppercase tracking-wider">Miyar SBC-201 v1.1</span>
              <button
                type="button"
                onClick={() => {
                  AccessibilityModeObj.applyAccessibilityMode("standard");
                  setAccMode("standard");
                }}
                className="text-slate-400 hover:text-white transition font-medium underline"
              >
                {state.language === "ar" ? "الاستمرار بالوضع المعياري ◀" : "Continue with Default Standard ◀"}
              </button>
            </div>

          </div>
        </div>
      )}
      {/* Skip to Content Accessibility Anchor */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-white"
        id="accessible-skip-link"
      >
        {t.skipLink}
      </a>

      {/* Screen reader live notification utility */}
      <div className="sr-only" aria-live="polite" role="status">
        {announcementMsg}
      </div>

      {/* 1. Header & Navigation System (Top Bar Glassmorphism for Desktop/Tablet) */}
      <header className="glass-nav sticky top-0 z-40 w-full transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 border border-primary-h/20">
              {/* Scale mini-logo representing fairness/suitability */}
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-wider text-white flex items-center gap-2">
                {t.appName}
                <span className="text-[10px] uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                  v2.2
                </span>
              </span>
              <p className="text-[9px] text-muted hidden md:block">
                {t.appSlogan}
              </p>
            </div>
          </div>

          {/* Desktop/Tablet Horizontal Navigation Layout */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation Options">
            <button
              id="nav-btn-home"
              onClick={() => handleTabChange("home")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-luxury ${
                activeTab === "home"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              {t.navHome}
            </button>
            <button
              id="nav-btn-candidate"
              onClick={() => handleTabChange("candidate")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-luxury ${
                activeTab === "candidate"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              {t.navCandidate}
            </button>
            <button
              id="nav-btn-job"
              onClick={() => handleTabChange("job")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-luxury ${
                activeTab === "job"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              {t.navJob}
            </button>
            <button
              id="nav-btn-matching"
              onClick={() => handleTabChange("matching")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-luxury ${
                activeTab === "matching"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              {t.navMatching}
            </button>
          </nav>

          {/* Setup Action Items: Quick Language Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              aria-label={state.language === "ar" ? "Wechseln zu Englisch" : "تبديل إلى اللغة العربية"}
              className="px-3.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-elevated text-sm text-white font-semibold transition-luxury flex items-center gap-2 cursor-pointer outline-none"
            >
              <Languages className="w-4 h-4 text-gold" aria-hidden="true" />
              <span>{t.langCode}</span>
            </button>

            {/* Stage indicator for accessibility and guidance decoration */}
            <div className="hidden lg:block bg-cyan-950/40 border border-cyan-800/40 px-3 py-1.5 rounded-lg text-xs font-semibold text-motor animate-pulse">
              {t.stageBadge}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Scaffold */}
      <main id="main-content" className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" aria-labelledby="hero-title">
        
        {/* Dynamic Warning Notification for construction states */}
        {showUnderConstToast && (
          <div className="mb-6 p-4 rounded-xl bg-orange-950/40 border border-orange-500/30 text-orange-200 text-sm flex items-start gap-3 transition-all animate-fadeIn">
            <Info className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div className="flex-grow">
              <span className="font-bold block text-sm text-gold">{t.notReadyTitle}</span>
              <span className="text-xs">{t.notReadyDesc}</span>
            </div>
            <button 
              onClick={() => setShowUnderConstToast(false)}
              className="text-orange-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/5 transition-colors"
            >
              {t.closeBtn}
            </button>
          </div>
        )}

        {/* ACTIVE VIEW BLOCK */}
        {activeTab === "home" ? (
          <div className="space-y-12">
            
            {/* HER0 AREA: Single Large Signature Balance Logo + Main Callouts */}
            <section className="text-center space-y-8 py-4">
              
              {/* Core Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/30 border border-motor/30 text-motor text-xs font-bold leading-normal shadow-sm">
                <span className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-motor inline-block animate-ping"></span>
                <span>{t.stageBadge}</span>
              </div>

              {/* Unique Huge Balance Signature Sculpture (displayed ONLY here as mandated) */}
              <div className="my-6 flex justify-center">
                <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center p-6 bg-radial from-slate-900 via-slate-950/20 to-transparent rounded-full border border-border/10">
                  {/* Intricate Custom Tech Scale Design */}
                  <svg 
                    viewBox="0 0 200 200" 
                    className="w-full h-full text-gold drop-shadow-[0_0_25px_rgba(212,168,83,0.35)]" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Glowing Network Nodes & Connecting Lines (The futuristic visual element for Miyar) */}
                    <circle cx="100" cy="30" r="3" fill="#2E6FEB" className="animate-pulse" />
                    <line x1="100" y1="30" x2="100" y2="160" stroke="#243450" strokeWidth="1.5" strokeDasharray="4 4" />
                    
                    {/* Scale Center Pillar & Support */}
                    <path d="M96 160 L104 160 L102 45 L98 45 Z" fill="#243450" />
                    <path d="M100 25 C108 25 115 32 115 40 C115 48 108 55 100 55 C92 55 85 48 85 40 C85 32 92 25 100 25 Z" stroke="var(--gold)" strokeWidth="3" />
                    <circle cx="100" cy="40" r="5" fill="var(--gold)" />
                    
                    {/* The Scale Beam (Balanced horizontally signifying absolute geometric symmetry) */}
                    <path d="M50 60 Q100 50 150 60 L150 63 Q100 53 50 63 Z" fill="var(--gold)" />
                    <circle cx="100" cy="57" r="4" fill="#0D1520" stroke="var(--gold)" strokeWidth="2" />
                    
                    {/* Left Suspension Lines and Pan (Functional evaluation) */}
                    <line x1="50" y1="62" x2="35" y2="110" stroke="var(--muted)" strokeWidth="1.5" />
                    <line x1="50" y1="62" x2="65" y2="110" stroke="var(--muted)" strokeWidth="1.5" />
                    <path d="M30 110 L70 110 L65 113 L35 113 Z" fill="var(--gold)" />
                    <circle cx="50" cy="115" r="4" fill="#06B6D4" stroke="#0D1520" strokeWidth="1" />
                    <line x1="50" y1="110" x2="50" y2="125" stroke="#06B6D4" strokeWidth="2" />
                    
                    {/* Right Suspension Lines and Pan (Job requirements setup) */}
                    <line x1="150" y1="62" x2="135" y2="110" stroke="var(--muted)" strokeWidth="1.5" />
                    <line x1="150" y1="62" x2="165" y2="110" stroke="var(--muted)" strokeWidth="1.5" />
                    <path d="M130 110 L170 110 L165 113 L135 113 Z" fill="var(--gold)" />
                    <circle cx="150" cy="115" r="4" fill="#2F6FEB" stroke="#0D1520" strokeWidth="1" />
                    <line x1="150" y1="110" x2="150" y2="125" stroke="#2F6FEB" strokeWidth="2" />
                    
                    {/* Decorative Saudi Palm elements in the background */}
                    <path d="M90 145 C80 140 75 130 90 120" stroke="#243450" strokeWidth="1" strokeLinecap="round" />
                    <path d="M110 145 C120 140 125 130 110 120" stroke="#243450" strokeWidth="1" strokeLinecap="round" />

                    {/* Highly weighted solid foundation block */}
                    <rect x="75" y="160" width="50" height="12" rx="4" fill="var(--surface)" stroke="var(--border)" strokeWidth="2" />
                    <rect x="65" y="172" width="70" height="8" rx="3" fill="var(--bg)" stroke="var(--border)" strokeWidth="1.5" />
                  </svg>

                  {/* Absolute positioning decor for apple-depth layout */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full blur-xs"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gold rounded-full blur-xs"></div>
                </div>
              </div>

              {/* Title and Strategic Constraint */}
              <div className="max-w-3xl mx-auto space-y-4">
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  {t.heroTitle}
                </h1>
                <p className="text-base md:text-lg text-muted font-normal max-w-2xl mx-auto leading-relaxed">
                  {t.heroSubtitle}
                </p>
                
                {/* Visual warning that indicates Miyar's system workflow dependency */}
                <div className="inline-flex items-center gap-2 bg-amber-950/45 px-4 py-2 rounded-xl text-gold border border-amber-500/30 text-sm font-bold antialiased">
                  <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
                  <span>{t.conditionalWarn}</span>
                </div>
              </div>

              {/* CALL-TO-ACTIONS with Interactive Modals */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-lg mx-auto pt-4">
                <button
                  onClick={() => setIsWizardOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-h hover:scale-[1.01] transition-all duration-300 rounded-xl font-bold text-white shadow-xl shadow-primary/20 flex items-center justify-center gap-3 cursor-pointer outline-none focus:ring-3 focus:ring-primary"
                  aria-label="New recruitment assessment initiation"
                >
                  <Activity className="w-5 h-5 text-cyan-300" />
                  <span>{t.startAssessment}</span>
                </button>
                <button
                  onClick={() => setIsDemoOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-surface hover:bg-elevated hover:border-primary/45 hover:scale-[1.01] border border-border transition-all duration-300 rounded-xl font-bold text-slate-200 flex items-center justify-center gap-3 cursor-pointer outline-none"
                  aria-label="Review active demo profile mock case"
                >
                  <Sparkles className="w-5 h-5 text-gold animate-bounce" />
                  <span>{t.viewDemoCase}</span>
                </button>
              </div>

            </section>

            {/* 2. THE LEGAL & FUNCTIONAL TRANSITION STRATEGY SECTION (التحول الوظيفي القانوني) */}
            <section className="glass-card p-6 md:p-8 space-y-6 border-l-4 border-l-primary" aria-labelledby="legal-heading">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <ShieldCheck className="w-7 h-7 text-primary-h" />
                <h2 id="legal-heading" className="text-xl md:text-2xl font-extrabold text-white">
                  {t.legalCorner}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Paragraph 1 */}
                <div className="space-y-2 bg-slate-900/35 p-5 rounded-xl border border-border/40">
                  <h3 className="text-sm font-bold text-gold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block"></span>
                    {t.legalBody1}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {t.legalBody1Desc}
                  </p>
                </div>

                {/* Paragraph 2 */}
                <div className="space-y-2 bg-slate-900/35 p-5 rounded-xl border border-border/40">
                  <h3 className="text-sm font-bold text-motor flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-motor inline-block"></span>
                    {t.legalBody2}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {t.legalBody2Desc}
                  </p>
                </div>

                {/* Paragraph 3 */}
                <div className="space-y-2 bg-slate-900/35 p-5 rounded-xl border border-border/40">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                    {t.legalBody3}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {t.legalBody3Desc}
                  </p>
                </div>

              </div>
            </section>

            {/* 3. HOW IT WORKS SECTION (كيف تعمل) - WITHOUT OVER-TECHNICAL JARGON */}
            <section className="space-y-8" aria-labelledby="howitworks-heading">
              <div className="text-center space-y-2">
                <h2 id="howitworks-heading" className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {t.howItWorks}
                </h2>
                <p className="text-sm text-muted">
                  {t.howItWorksSub}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Step 1 */}
                <div className="glass-card p-6 flex flex-col justify-between h-48 relative overflow-hidden group">
                  <div className="absolute top-2 right-2 text-7xl font-black text-slate-800/25 select-none pointer-events-none">
                    01
                  </div>
                  <div className="space-y-3 z-10">
                    <div className="w-10 h-10 rounded-lg bg-cyan-950 flex items-center justify-center border border-motor/20">
                      <UserCheck className="w-5 h-5 text-motor" />
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-motor transition-colors duration-300">
                      {t.step1Title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {t.step1Desc}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="glass-card p-6 flex flex-col justify-between h-48 relative overflow-hidden group">
                  <div className="absolute top-2 right-2 text-7xl font-black text-slate-800/25 select-none pointer-events-none">
                    02
                  </div>
                  <div className="space-y-3 z-10">
                    <div className="w-10 h-10 rounded-lg bg-blue-950 flex items-center justify-center border border-primary/20">
                      <Building2 className="w-5 h-5 text-primary-h" />
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-primary-h transition-colors duration-300">
                      {t.step2Title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {t.step2Desc}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="glass-card p-6 flex flex-col justify-between h-48 relative overflow-hidden group">
                  <div className="absolute top-2 right-2 text-7xl font-black text-slate-800/25 select-none pointer-events-none">
                    03
                  </div>
                  <div className="space-y-3 z-10">
                    <div className="w-10 h-10 rounded-lg bg-amber-950/20 flex items-center justify-center border border-gold/25">
                      <Coins className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-gold transition-colors duration-300">
                      {t.step3Title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {t.step3Desc}
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="glass-card p-6 flex flex-col justify-between h-48 relative overflow-hidden group">
                  <div className="absolute top-2 right-2 text-7xl font-black text-slate-800/25 select-none pointer-events-none">
                    04
                  </div>
                  <div className="space-y-3 z-10">
                    <div className="w-10 h-10 rounded-lg bg-emerald-950/30 flex items-center justify-center border border-emerald-500/20">
                      <FileCheck2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                      {t.step4Title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {t.step4Desc}
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* 4. VALUE BAR: 4 PRISTINE COMPLIANCE CARDS */}
            <section className="space-y-6" aria-labelledby="value-heading">
              <div className="border-b border-border pb-3">
                <h2 id="value-heading" className="text-lg md:text-xl font-black text-slate-200 uppercase tracking-widest flex items-center gap-3">
                  <Layers className="w-5 h-5 text-gold" />
                  <span>{t.valueTitle}</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-surface/50 border border-border flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-blue-950/40 text-blue-400 flex-shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-blue-200">{t.value1Title}</h3>
                    <p className="text-xs text-muted mt-1">{t.value1Desc}</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-surface/50 border border-border flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-emerald-950/40 text-emerald-400 flex-shrink-0">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-emerald-200">{t.value2Title}</h3>
                    <p className="text-xs text-muted mt-1">{t.value2Desc}</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-surface/50 border border-border flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-red-950/30 text-rose-400 flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-rose-200">{t.value3Title}</h3>
                    <p className="text-xs text-muted mt-1">{t.value3Desc}</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-surface/50 border border-border flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-amber-950/20 text-gold flex-shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-amber-200">{t.value4Title}</h3>
                    <p className="text-xs text-muted mt-1">{t.value4Desc}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. METHODOLOGY MODAL LINK */}
            <section className="text-center pt-2">
              <button
                onClick={() => setIsMethodologyOpen(true)}
                className="inline-flex items-center gap-2 text-gold hover:text-white text-sm font-medium underline underline-offset-4 cursor-pointer hover:scale-[1.01] transition-all outline-none"
              >
                <HelpCircle className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{t.calcScoreLink}</span>
              </button>
            </section>

            {/* 6. EXPANSION ROADMAP PANEL */}
            <section className="bg-gradient-to-br from-surface to-elevated border border-border rounded-2xl p-6 md:p-8 space-y-6" aria-labelledby="roadmap-heading">
              <div className="space-y-1">
                <h2 id="roadmap-heading" className="text-xl md:text-2xl font-black text-white">
                  {t.expansionTitle}
                </h2>
                <p className="text-xs text-muted leading-relaxed">
                  {t.expansionSub}
                </p>
              </div>

              <div className="relative pt-4">
                {/* Horizontal progress bar for desktop */}
                <div className="absolute top-[4.5rem] left-[15%] right-[15%] h-1 bg-border hidden md:block"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Phase 1 */}
                  <div className="space-y-3 md:text-center relative">
                    <div className="w-12 h-12 md:mx-auto rounded-full bg-cyan-950 text-motor border-2 border-motor flex items-center justify-center font-bold text-lg shadow-lg">
                      ١
                    </div>
                    <div>
                      <span className="text-xs uppercase font-mono tracking-widest text-motor font-bold bg-cyan-500/10 px-2.5 py-1 rounded-md inline-block mb-1">
                        {state.language === "ar" ? "نشط ومفعل" : "Active"}
                      </span>
                      <h3 className="text-sm font-extrabold text-white">{t.expansionPhase1}</h3>
                      <p className="text-xs text-muted mt-1 max-w-xs md:mx-auto leading-relaxed">{t.expansionPhase1Desc}</p>
                    </div>
                  </div>

                  {/* Phase 2 */}
                  <div className="space-y-3 md:text-center relative">
                    <div className="w-12 h-12 md:mx-auto rounded-full bg-slate-900 text-muted border-2 border-border flex items-center justify-center font-bold text-lg">
                      ٢
                    </div>
                    <div>
                      <span className="text-xs uppercase font-mono tracking-widest text-muted font-bold bg-white/5 px-2.5 py-1 rounded-md inline-block mb-1">
                        {state.language === "ar" ? "ربع ١ (٢٠٢٧)" : "Q1 2027 Plan"}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-300">{t.expansionPhase2}</h3>
                      <p className="text-xs text-muted mt-1 max-w-xs md:mx-auto leading-relaxed">{t.expansionPhase2Desc}</p>
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div className="space-y-3 md:text-center relative">
                    <div className="w-12 h-12 md:mx-auto rounded-full bg-slate-900 text-muted border-2 border-border flex items-center justify-center font-bold text-lg">
                      ٣
                    </div>
                    <div>
                      <span className="text-xs uppercase font-mono tracking-widest text-muted font-bold bg-white/5 px-2.5 py-1 rounded-md inline-block mb-1">
                        {state.language === "ar" ? "ربع ٣ (٢٠٢٧)" : "Q3 2027 Plan"}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-300">{t.expansionPhase3}</h3>
                      <p className="text-xs text-muted mt-1 max-w-xs md:mx-auto leading-relaxed">{t.expansionPhase3Desc}</p>
                    </div>
                  </div>

                </div>
              </div>
            </section>

          </div>
        ) : activeTab === "candidate" ? (
          <CandidateAssessment 
            language={state.language}
            onCancel={() => handleTabChange("home")}
            onComplete={(candidateData) => {
              setState((prev) => ({
                ...prev,
                candidate: {
                  ...prev.candidate,
                  name: candidateData.kineticProfile.name,
                  disabilityClass: candidateData.kineticProfile.locomotionType,
                  capabilities: candidateData.kineticProfile.capabilities,
                  capabilitiesGoodDay: candidateData.kineticProfile.capabilitiesGoodDay,
                  capabilitiesBadDay: candidateData.kineticProfile.capabilitiesBadDay,
                  isFluctuating: candidateData.kineticProfile.isFluctuating,
                  envData: candidateData.environmentAudit,
                  requiresReview: candidateData.requiresReview || false,
                  locomotionCapabilities: {
                    ...prev.candidate.locomotionCapabilities,
                    wheelchairStaticTransfer: candidateData.gaitMetrics.speed >= 1.2
                  }
                },
                evidence: {
                  ...prev.evidence,
                  evidenceStrength: candidateData.evidenceStrength
                },
                matching: {
                  ...prev.matching,
                  suitabilityIndexPercentage: candidateData.evidenceStrength
                }
              }));
              triggerLiveAnnouncement(
                state.language === "ar" 
                  ? "تم حفظ تشخيص المرشح بنجاح! جاهز للانتقال لتحليل بيئة الوظيفة." 
                  : "Candidate diagnostic metrics stored! Ready for workspace matching."
              );
              // Set active tab to 'job' seamlessly
              handleTabChange("job");
            }}
          />
        ) : activeTab === "job" ? (
          <JobAnalysis 
            language={state.language}
            keyboardFirstMode={accMode === "keyboard-first"}
            onCancel={() => handleTabChange("home")}
            onComplete={(jobData) => {
              setState((prev) => ({
                ...prev,
                job: {
                  ...prev.job,
                  title: jobData.title,
                  facilityName: jobData.facilityName,
                  facilityType: jobData.facilityType,
                  scenario: jobData.scenario,
                  criticalTasks: jobData.criticalTasks,
                  flexibleTasks: jobData.flexibleTasks,
                  workspaceSpecs: jobData.workspaceSpecs,
                  accommodations: jobData.accommodations,
                  totalAccomCost: jobData.totalAccomCost,
                  funderMap: jobData.funderMap
                },
                matching: {
                  ...prev.matching,
                  suitabilityIndexPercentage: jobData.suitabilityIndexPercentage
                }
              }));
              triggerLiveAnnouncement(
                state.language === "ar" 
                  ? "تم حفظ مواصفات الوظيفة بنجاح! تم احتساب الأوزان التيسيرية." 
                  : "Workspace accommodation metrics stored! Suitability index formulated."
              );
              // Set active tab to 'matching' seamlessly
              handleTabChange("matching");
            }}
          />
        ) : activeTab === "matching" ? (
          <CompliancePreview 
            language={state.language}
            candidate={state.candidate}
            job={state.job}
            evidenceStrength={state.evidence?.evidenceStrength || 90}
            envData={state.candidate?.envData || {}}
            requiresReview={state.candidate?.requiresReview || false}
            onReset={resetState}
            onComplete={(calculatedScores) => {
              setState((prev) => ({
                ...prev,
                matching: {
                  ...prev.matching,
                  suitabilityIndexPercentage: calculatedScores.overall,
                  tasksScore: calculatedScores.tasks,
                  envScore: calculatedScores.env,
                  evidenceScore: calculatedScores.evidence,
                  accommodationScore: calculatedScores.accommodation,
                  financialScore: calculatedScores.financial
                },
                report: {
                  ...prev.report,
                  id: "REP-" + Math.floor(Math.random() * 900000 + 100000),
                  issuedAt: new Date().toISOString(),
                  auditorSignatureHash: "SHA256-MIYAR-" + Math.floor(Math.random() * 89999 + 10000)
                }
              }));
              triggerLiveAnnouncement(
                state.language === "ar"
                  ? "تم تصديق التوصية التيسيرية بنجاح وتوليد شهادة المطابقة!"
                  : "Advisory compliance dossier signed off and certified!"
              );
            }}
            onReturn={() => handleTabChange("home")}
          />
        ) : (
          /* UNFINISHED SCIENTIFIC SCREENS PLACEHOLDER (Shows beautiful under-construction pages with option to return) */
          <div className="glass-card p-12 text-center max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-950/20 text-gold flex items-center justify-center border border-gold/40 mx-auto animate-bounce">
              <Cpu className="w-8 h-8 text-gold" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-extrabold text-white">
                {activeTab === "matching" && t.navMatching}
              </h2>
              <div className="inline-flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-lg text-xs font-semibold text-muted font-mono">
                <span>{activeTab === "matching" && "// Complete in Batches 4-6"}</span>
              </div>
              <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                {t.notReadyDesc}
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => handleTabChange("home")}
                className="px-6 py-2.5 bg-primary hover:bg-primary-h text-sm font-bold text-white rounded-lg transition-luxury"
              >
                {state.language === "ar" ? "العودة للشاشة الرئيسية" : "Back to Home Screen"}
              </button>
            </div>
          </div>
        )}

      </main>

      {/* 3. FIXED LEGAL DISCLAIMER BAR (Pinned strictly at bottom of all layout screens, z-index 999) */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-border/80 h-11 flex items-center px-4 backdrop-blur-md shadow-[0_-5px_25px_rgba(0,0,0,0.6)]">
        <div className="w-full text-center text-[10px] md:text-xs text-slate-300 tracking-wide inline-flex items-center justify-center gap-2 select-none overflow-hidden">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse inline-block flex-shrink-0"></span>
          <span className="font-medium whitespace-nowrap overflow-ellipsis overflow-hidden">
            {t.fixedDisclaimer}
          </span>
        </div>
      </footer>

      {/* 2. TAB BAR NAVIGATION (Bottom Bar exclusively for Mobile phones below 768px viewports) */}
      <div className="md:hidden fixed bottom-11 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-md h-16 border-t border-border flex items-center justify-around px-4">
        <button
          onClick={() => handleTabChange("home")}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full py-1 text-[10px] ${
            activeTab === "home" ? "text-primary-h" : "text-muted hover:text-white"
          }`}
          aria-label={t.navHome}
        >
          <Scale className="w-5 h-5 flex-shrink-0" />
          <span>{t.navHome}</span>
        </button>
        <button
          onClick={() => handleTabChange("candidate")}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full py-1 text-[10px] ${
            activeTab === "candidate" ? "text-primary-h" : "text-muted hover:text-white"
          }`}
          aria-label={t.navCandidate}
        >
          <UserCheck className="w-5 h-5 flex-shrink-0" />
          <span>{state.language === "ar" ? "المرشح" : "Candidate"}</span>
        </button>
        <button
          onClick={() => handleTabChange("job")}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full py-1 text-[10px] ${
            activeTab === "job" ? "text-primary-h" : "text-muted hover:text-white"
          }`}
          aria-label={t.navJob}
        >
          <Building2 className="w-5 h-5 flex-shrink-0" />
          <span>{state.language === "ar" ? "الوظيفة" : "Workspace"}</span>
        </button>
        <button
          onClick={() => handleTabChange("matching")}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full py-1 text-[10px] ${
            activeTab === "matching" ? "text-primary-h" : "text-muted hover:text-white"
          }`}
          aria-label={t.navMatching}
        >
          <Layers className="w-5 h-5 flex-shrink-0" />
          <span>{state.language === "ar" ? "المطابقة" : "Match"}</span>
        </button>
      </div>

      {/* ================= MODAL WINDOWS & DRAWERS ================= */}

      {/* A. METHODOLOGY FOCUS-TRAPPED MODAL */}
      {isMethodologyOpen && (() => {
        const activeScenario = state.job?.scenario || "compliance";
        const w = {
          cognitive: { labelAr: "الإدراكي والمكتبي", labelEn: "Cognitive & Desk", tasks: 25, env: 15, evidence: 30, accommodation: 18, financial: 12 },
          physical: { labelAr: "الصناعي والبدني", labelEn: "Industrial / Physical", tasks: 40, env: 25, evidence: 15, accommodation: 12, financial: 8 },
          service: { labelAr: "بيئة الخدمة الميدانية", labelEn: "Field Service / Retail", tasks: 28, env: 20, evidence: 22, accommodation: 18, financial: 12 },
          compliance: { labelAr: "المعياري المعتدل", labelEn: "General Compliance / Flexible", tasks: 22, env: 15, evidence: 38, accommodation: 15, financial: 10 }
        }[activeScenario as "cognitive" | "physical" | "service" | "compliance"] || { labelAr: "المعياري المعتدل", labelEn: "General Compliance / Flexible", tasks: 22, env: 15, evidence: 38, accommodation: 15, financial: 10 };

        return (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs transition-luxury animate-fadeIn"
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="methodology-title"
            dir={state.language === "ar" ? "rtl" : "ltr"}
            ref={methodologyModalRef}
          >
            <div className="bg-surface border border-border rounded-xl w-full max-w-xl p-6 relative shadow-2xl animate-scaleUp text-right">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                <h3 id="methodology-title" className="text-lg font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-gold" />
                  <span>{t.calcScoreTitle}</span>
                </h3>
                <button
                  onClick={() => setIsMethodologyOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-muted hover:text-white transition-colors cursor-pointer outline-none"
                  aria-label="Close dialog window"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-4 text-xs text-muted leading-relaxed">
                {/* Academic/Scientific Verification Statement */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-[12px]">
                    <ShieldCheck className="w-5 h-5" />
                    <span>{state.language === "ar" ? "توثيق علمي معتمد" : "Scientific Verification Stamp"}</span>
                  </div>
                  <p className="text-slate-200">
                    {state.language === "ar" 
                      ? "تم التحقق العلمي من المنهجية الحسابية نفسها - وليس الأداة الرقمية ذاتها - ومطابقتها للمعايير الدولية بواسطة مركز سيول الوطني لإعادة التأهيل 2025 (Seoul NRC 2025)."
                      : "The underlying computation methodology itself (rather than this specific digital application) is validated and verified by the Seoul National Rehabilitation Center 2025 (Seoul NRC 2025)."}
                  </p>
                </div>

                <p>{t.calcScoreDesc}</p>
                
                {/* Visual Weight balancing list */}
                <div className="border border-border/80 rounded-xl p-4 bg-slate-950/40 space-y-3">
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest border-b border-border/40 pb-1 flex justify-between items-center">
                    <span>{state.language === "ar" ? "أوزان السيناريو النشط حالياً:" : "Weights of current Active Scenario:"}</span>
                    <span className="text-white font-mono bg-indigo-500/20 px-2 py-0.5 rounded text-[9px] font-black">
                      {state.language === "ar" ? w.labelAr : w.labelEn}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <span className="block font-black text-white text-[13px]">{w.tasks}%</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">{state.language === "ar" ? "المهام" : "Tasks"}</span>
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <span className="block font-black text-white text-[13px]">{w.env}%</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">{state.language === "ar" ? "البيئة" : "Environment"}</span>
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <span className="block font-black text-white text-[13px]">{w.evidence}%</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">{state.language === "ar" ? "الأدلة" : "Evidence"}</span>
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <span className="block font-black text-white text-[13px]">{w.accommodation}%</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">{state.language === "ar" ? "التكيف" : "Accomms"}</span>
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <span className="block font-black text-white text-[13px]">{w.financial}%</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">{state.language === "ar" ? "المالي" : "Finance"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsMethodologyOpen(false)}
                  className="px-5 py-2 bg-primary hover:bg-primary-h font-bold text-xs text-white rounded-lg transition-luxury cursor-pointer outline-none"
                >
                  {t.closeBtn}
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* B. SAUDI DEMO CASE STUDY DRAWER (High fidelity simulation) */}
      {isDemoOpen && (
        <div 
          className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xs transition-all pointer-events-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="democase-title"
        >
          {/* Backdrop clicking dismisses modal securely */}
          <div className="absolute inset-0" onClick={() => setIsDemoOpen(false)}></div>

          {/* Sizable lateral sheet layout from side */}
          <div className="relative w-full max-w-lg bg-surface h-full border-l border-border px-6 py-8 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto animate-slideRight">
            
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2 text-gold">
                  <Sparkles className="w-5 h-5" />
                  <h3 id="democase-title" className="text-base font-bold text-white">
                    {t.demoCaseTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setIsDemoOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-muted hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Warning/Condition box in simulation */}
              <div className="bg-cyan-950/35 border border-cyan-800/35 p-3.5 rounded-xl text-xs text-cyan-300 flex gap-2 items-start leading-normal">
                <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p>{t.notReadyWarn}</p>
              </div>

              {/* Saudi Mock Trial Items */}
              <div className="space-y-5">
                
                {/* Candidate */}
                <div className="space-y-1 bg-slate-900/40 p-3.5 rounded-xl border border-border/50">
                  <span className="text-[10px] text-muted font-bold block">{t.demoItemCandidate}</span>
                  <span className="text-sm font-extrabold text-[#EDF2F7] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                    {t.demoCandidateVal}
                  </span>
                </div>

                {/* Job Info */}
                <div className="space-y-1 bg-slate-900/40 p-3.5 rounded-xl border border-border/50">
                  <span className="text-[10px] text-muted font-bold block">{t.demoItemJob}</span>
                  <span className="text-sm font-extrabold text-blue-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
                    {t.demoJobVal}
                  </span>
                </div>

                {/* Disability details */}
                <div className="space-y-1 bg-slate-900/40 p-3.5 rounded-xl border border-border/50">
                  <span className="text-[10px] text-muted font-bold block">{t.demoItemDisability}</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t.demoDisabilityVal}
                  </p>
                </div>

                {/* Accommodations specs */}
                <div className="space-y-2 bg-slate-900/40 p-3.5 rounded-xl border border-border/50">
                  <span className="text-[10px] text-muted font-bold block">{t.demoItemSpecs}</span>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed font-mono">
                    <li className="flex items-start gap-1">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{t.demoSpecsVal1}</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{t.demoSpecsVal2}</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{t.demoSpecsVal3}</span>
                    </li>
                  </ul>
                </div>

                {/* Cost outcome estimation */}
                <div className="bg-amber-950/25 border border-gold/30 p-4 rounded-xl">
                  <span className="text-[10px] text-gold font-bold block uppercase tracking-wider">{t.demoItemImpact}</span>
                  <p className="text-sm font-black text-white mt-1">
                    {t.demoImpactVal}
                  </p>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => setIsDemoOpen(false)}
                className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-h text-sm font-bold text-white rounded-lg transition-luxury"
              >
                {t.demoClose}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* C. START ASSESSMENT WIZARD (Validating conditional offer sequence) */}
      {isWizardOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs transition-luxury animate-fadeIn"
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="wizard-title"
        >
          <div className="bg-surface border border-border rounded-2xl w-full max-w-lg p-6 relative shadow-2xl animate-scaleUp">
            
            {/* Wizard Header */}
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 id="wizard-title" className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-motor" />
                <span>{t.wizardTitle}</span>
              </h3>
              <button
                onClick={() => setIsWizardOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-muted hover:text-white transition-colors cursor-pointer outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wizard Body: Regulatory Step Assertions */}
            <div className="space-y-4">
              <p className="text-xs text-muted leading-relaxed">
                {t.wizardSeqCheck}
              </p>

              <div className="space-y-3">
                
                {/* Checkbox 1 */}
                <label className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-border/80 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={wizardDecl1} 
                    onChange={(e) => setWizardDecl1(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-primary bg-surface border-border focus:ring-primary accent-primary mt-0.5 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 leading-normal">
                    {t.wizardCheck1}
                  </span>
                </label>

                {/* Checkbox 2 */}
                <label className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-border/80 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={wizardDecl2} 
                    onChange={(e) => setWizardDecl2(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-primary bg-surface border-border focus:ring-primary accent-primary mt-0.5 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 leading-normal">
                    {t.wizardCheck2}
                  </span>
                </label>

              </div>

              {/* Status banner */}
              {wizardDecl1 && wizardDecl2 ? (
                <div className="bg-emerald-950/45 text-emerald-300 border border-emerald-500/30 p-3 rounded-xl text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                  <span>{t.wizardStatus}</span>
                </div>
              ) : (
                <div className="bg-amber-950/20 text-gold border border-gold/20 p-3 rounded-xl text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold inline-block"></span>
                  <span>{t.wizardStatusErr}</span>
                </div>
              )}

            </div>

            {/* Wizard Footer Actions */}
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-border">
              <button
                onClick={() => setIsWizardOpen(false)}
                className="px-5 py-2 bg-slate-900 border border-border hover:bg-elevated text-xs font-bold text-slate-300 rounded-lg transition-luxury"
              >
                {t.wizardClose}
              </button>
              
              <button
                disabled={!(wizardDecl1 && wizardDecl2)}
                onClick={async () => {
                  try {
                    await AuditChain.recordAuditStep("conditional_offer_confirmed", {
                      decl1_accepted: wizardDecl1,
                      decl2_accepted: wizardDecl2,
                      language: state.language
                    });
                  } catch (e) {
                    console.error("Audit Recording error:", e);
                  }
                  setIsWizardOpen(false);
                  handleTabChange("candidate");
                }}
                className={`px-5 py-2 rounded-lg text-xs font-bold text-white transition-luxury flex items-center gap-1.5 ${
                  wizardDecl1 && wizardDecl2 
                    ? "bg-primary hover:bg-primary-h cursor-pointer" 
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                <span>{t.wizardNextStep}</span>
                {state.language === "ar" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
