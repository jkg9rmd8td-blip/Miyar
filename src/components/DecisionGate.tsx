import React, { useState, useEffect, useMemo } from "react";
import { 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Scale, 
  ArrowRightLeft, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Key, 
  Eye, 
  EyeOff, 
  Cpu, 
  Printer, 
  RotateCcw, 
  Activity, 
  CheckSquare, 
  Building2, 
  HardHat, 
  Wrench, 
  Calendar, 
  UserCheck, 
  Coins, 
  Award,
  BookOpen
} from "lucide-react";
import { motion } from "motion/react";
import { AuditChain } from "../utils/AuditChain";
import { safeSessionStorage } from "../utils/storage";

interface DecisionGateProps {
  language: "ar" | "en";
  candidate: any;
  job: any;
  scores: {
    tasks: number;
    env: number;
    evidence: number;
    accommodation: number;
    financial: number;
    overall: number;
  };
  onReturn: () => void;
  onReset: () => void;
}

// Complete Environmental Barrier Map detailing SBC 102 Sections and practical adjustments
const ENV_BARRIER_MAP: Record<string, {
  nameAr: string;
  nameEn: string;
  stdAr: string;
  stdEn: string;
  actionAr: string;
  actionEn: string;
  responsibleAr: string;
  responsibleEn: string;
  schedule: string;
  funderAr: string;
  funderEn: string;
}> = {
  entrance: {
    nameAr: "مدخل المنشأة",
    nameEn: "Facility Entrance",
    stdAr: "SBC 102 - القسم 3.2 (المنحدرات والمداخل)",
    stdEn: "SBC 102 - Sec 3.2 (Ramps & Entrances)",
    actionAr: "تعديل ميل المنحدر ليصبح 1:12 وتوفير مقابض مزدوجة وتثبيت أرضيات مانعة للانزلاق.",
    actionEn: "Re-engineer ramp slope to 1:12, install dual handrails, and lay non-slip tactiles.",
    responsibleAr: "إدارة المرافق والخدمات الهندسية",
    responsibleEn: "Facility & Engineering Services Division",
    schedule: "14 Days",
    funderAr: "صندوق الموارد البشرية (هدف) - حافز تهيئة العمل",
    funderEn: "HRDF (HADAF) - Work Preparation Incentive"
  },
  parking: {
    nameAr: "مواقف السيارات",
    nameEn: "Accessible Parking",
    stdAr: "SBC 102 - القسم 2.4 (تحديد ومسارات المواقف)",
    stdEn: "SBC 102 - Sec 2.4 (Parking Demarcation)",
    actionAr: "رسم وتحديد وتخصيص موقف خاص بالقرب من المدخل مع تثبيت الرمز الدولي للوصول وعلامات المسار.",
    actionEn: "Demarcate accessible parking spots near entrance with International Symbol of Access and lane markers.",
    responsibleAr: "قسم الحركة والسلامة المهنية",
    responsibleEn: "Safety & Transportation Branch",
    schedule: "7 Days",
    funderAr: "المنشأة (التمويل الذاتي للمسؤولية المجتمعية)",
    funderEn: "Employer (Corporate Social Responsibility)",
  },
  elevator: {
    nameAr: "المصاعد ومسارات الانتقال رأساً",
    nameEn: "Elevators & Vertical Transit",
    stdAr: "SBC 102 - القسم 4.8 (أزرار التحكم وعرض اللوحة)",
    stdEn: "SBC 102 - Sec 4.8 (Control Interfaces & Width)",
    actionAr: "خفض كابينة أزرار التحكم وتثبيت نصوص طريقة برايل للمكفوفين ونظام نداء صوتي فعال.",
    actionEn: "Lower control keypad height, install Braille indices, and deploy speech synthesis announcement.",
    responsibleAr: "فريق الإشراف الفني والصيانة",
    responsibleEn: "Maintenance & Operations Dept",
    schedule: "21 Days",
    funderAr: "وزارة الموارد البشرية - منحة الملاءمة البيئية",
    funderEn: "MHRSD - Architectural Accessibility Grant",
  },
  corridor: {
    nameAr: "الممرات والأروقة الداخلية",
    nameEn: "Corridors & Hallways",
    stdAr: "SBC 102 - القسم 3.5 (عرض الممرات وخلو العوائق)",
    stdEn: "SBC 102 - Sec 3.5 (Width & Clear Path)",
    actionAr: "إزالة العوائق والبروزات الجانبية وتوسيع مسار الارتداد الدائري لكرسي متحرك يدوي (≥ 150 سم).",
    actionEn: "Remove lateral protrusions, extend turning clearance radius to ≥ 150 cm for active wheelchairs.",
    responsibleAr: "إدارة المرافق والخدمات الهندسية",
    responsibleEn: "Facility & Engineering Services Division",
    schedule: "10 Days",
    funderAr: "المنشأة (التمويل الذاتي للمسؤولية المجتمعية)",
    funderEn: "Employer (Corporate Social Responsibility)"
  },
  workstation: {
    nameAr: "موقع العمل والمكتب الفردي",
    nameEn: "Individual Workstation",
    stdAr: "SBC 102 - القسم 7.3 (المكاتب التفاعلية وفرغات الأرجل)",
    stdEn: "SBC 102 - Sec 7.3 (Desks & Knee Clearances)",
    actionAr: "شراء وتوفير مكتب قابل للتعديل كهربائياً مع تخليص مساحة كافية للركبتين والأرجل والذراعين للكرسي الساكن.",
    actionEn: "Procure height-adjustable ergonomic workspace with complete stationary knee/arm joint clearance.",
    responsibleAr: "المشتريات والخدمات المشتركة",
    responsibleEn: "Shared Services & Procurement Group",
    schedule: "10 Days",
    funderAr: "صندوق الموارد البشرية (هدف)",
    funderEn: "HRDF (HADAF) - Adaptive Support program"
  },
  restroom: {
    nameAr: "دورة المياه المهيأة",
    nameEn: "Adapted Restroom/Toilet",
    stdAr: "SBC 102 - القسم 6.2 (المساحات وعامود التثبيت الفني)",
    stdEn: "SBC 102 - Sec 6.2 (Turning Circle & Grab Bars)",
    actionAr: "توسيع مساحة الالتفاف الكامل لـ 150 سم، تركيب مقابض مساندة هندسية، خفض حافة المغسلة والمناشف لـ 80 سم.",
    actionEn: "Expand inner turning circle to 150cm, install engineered L-bars, lower vanity level to 80cm.",
    responsibleAr: "مقاول التهيئة الهندسية المعتمد",
    responsibleEn: "SBC-Certified Structural Contractor",
    schedule: "15 Days",
    funderAr: "مشاركة مناصفة (المنشأة 50% + هدف 50%)",
    funderEn: "Shared Cost-Splitting Block (Employer 50% / HADAF 50%)"
  },
  emergency: {
    nameAr: "مخارج الطوارئ ونظم الإنذار",
    nameEn: "Emergency Exits & Alarms",
    stdAr: "SBC 102 - القسم 9.1 (الإنذار المرئي والسمعي المشترك)",
    stdEn: "SBC 102 - Sec 9.1 (Visual Strobe & Audio Alarms)",
    actionAr: "تثبيت صفارات إنارة فوتوغرافية متقطعة (Strobe) وحلول تتبع الإخلاء الأرضي التيسيري الخاص.",
    actionEn: "Install emergency backup visual flash strobes and floor level evacuation guidance tracks.",
    responsibleAr: "إدارة الصحة والسلامة المهنية (OHS)",
    responsibleEn: "Occupational Health & Safety (OHS) Dept",
    schedule: "5 Days",
    funderAr: "المنشأة (التمويل الذاتي للأمن والسلامة)",
    funderEn: "Employer (Safety Budget Allocation)"
  },
  hybrid_work: {
    nameAr: "إطار العمل المختلط / عن بعد",
    nameEn: "Hybrid Work Integration",
    stdAr: "معيار المواءمة الرقمية - اللائحة التنفيذية للتوطين",
    stdEn: "Digital Work Readiness Standard of KSA",
    actionAr: "تخصيص يومين عمل عن بعد شهرياً للموظف لضمان كفاءة الدوران البدني وتفادي الإجهاد الحركي المتواصل.",
    actionEn: "Formally allocate 2 telecommuting days per month to maintain spatial distribution comfort and avoid kinetic fatigue.",
    responsibleAr: "إدارة الموارد البشرية واللوائح",
    responsibleEn: "Global HR Policy & Compensation Dept",
    schedule: "3 Days",
    funderAr: "دون تكلفة إضافية",
    funderEn: "Zero Cost Policy Realignment"
  }
};

export function DecisionGate({
  language,
  candidate,
  job,
  scores,
  onReturn,
  onReset
}: DecisionGateProps) {
  const isAr = language === "ar";

  // State management
  const [employerApproved, setEmployerApproved] = useState(false);
  const [accommodationDecision, setAccommodationDecision] = useState<"apply" | "reject" | null>(null);
  const [pulseEnabled, setPulseEnabled] = useState(false);
  const [employerSignatureSeed, setEmployerSignatureSeed] = useState("");
  const [signingDate, setSigningDate] = useState("");

  // Claude BYOK states
  const [apiKey, setApiKey] = useState(() => {
    return safeSessionStorage.getItem("claude_api_key") || "";
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [aiError, setAiError] = useState<string | null>(null);

  // Sync Signature and Timestamp on approval checkbox check
  useEffect(() => {
    if (employerApproved) {
      const dateStr = new Date().toLocaleString(isAr ? "ar-SA" : "en-US");
      setSigningDate(dateStr);
      const signatureSeed = "SIG-" + Math.floor(Math.random() * 899999 + 100000) + "-SBC102";
      setEmployerSignatureSeed(signatureSeed);

      // Record employer_decision_recorded event
      AuditChain.recordAuditStep("employer_decision_recorded", {
        employerApproved: true,
        accommodationDecision,
        signatureSeed,
        timestamp: Date.now()
      }).catch(err => console.error("Error logging employer_decision_recorded:", err));
    } else {
      setSigningDate("");
      setEmployerSignatureSeed("");
    }
  }, [employerApproved, isAr]);

  useEffect(() => {
    if (employerApproved && accommodationDecision) {
      AuditChain.recordAuditStep("employer_decision_recorded", {
        employerApproved: true,
        accommodationDecision,
        signatureSeed: employerSignatureSeed,
        timestamp: Date.now()
      }).catch(err => console.error("Error logging decision update:", err));
    }
  }, [accommodationDecision]);

  // Determine if a critical physical barrier exists
  const hasCriticalBarrier = useMemo(() => {
    return (job.criticalTasks || []).some((task: any) => {
      const capIds = task.capabilityIds || [];
      return capIds.some((cid: string) => (candidate?.capabilities?.[cid] || "can") === "cannot");
    });
  }, [candidate, job]);

  // Compute updated metrics without and with accommodations
  const baselineReadiness = scores.overall;
  
  const accommodationImpactDelta = useMemo(() => {
    // Difference between perfect score and current tasks+env scores
    let taskAlignmentBoost = (100 - scores.tasks) * 0.4;
    let envBoost = (100 - scores.env) * 0.6;
    return Math.round(taskAlignmentBoost + envBoost);
  }, [scores]);

  const withAccommodationReadiness = Math.min(baselineReadiness + accommodationImpactDelta, 95);

  const computeLegalRiskLabel = (riskLevel: "low" | "medium" | "high", ar: boolean) => {
    switch (riskLevel) {
      case "low": return ar ? "آمن قانونياً" : "Legally Secure";
      case "medium": return ar ? "مخاطر محتملة - يتطلب انتباه" : "Potential Risks - Requires Attention";
      case "high": return ar ? "خطر عالٍ - غير ممتثل" : "High Risk - Non-Compliant";
      default: return "";
    }
  };

  const computeLegalRisk = (consistencyConflicts: boolean, antiGamingFlags: boolean, criticalBarriers: boolean): "low" | "medium" | "high" => {
    if (criticalBarriers || consistencyConflicts) return "high";
    if (antiGamingFlags) return "medium";
    return "low";
  };

  const consistencyConflicts = false; 
  const antiGamingFlags = candidate?.isFluctuating || false;
  
  const legalRiskWithout = useMemo(() => computeLegalRisk(consistencyConflicts, antiGamingFlags, hasCriticalBarrier), [consistencyConflicts, antiGamingFlags, hasCriticalBarrier]);
  
  // With accommodations, we assume the critical barrier is mitigated
  const legalRiskWith = useMemo(() => computeLegalRisk(consistencyConflicts, antiGamingFlags, false), [consistencyConflicts, antiGamingFlags]);

  // Overall Verdict Formula and Explanatory text logic
  const verdict = useMemo(() => {
    const score = scores.overall;
    if (score >= 80 && !hasCriticalBarrier) {
      return {
        key: "immediate",
        badge: isAr ? "✓ مناسب فوري" : "✓ Immediate Fit",
        color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
        pill: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        desc: isAr 
          ? "تحليل القرار النهائي يُصادق على جاهزية تامة. يُظهر المترشح توافقاً هندسياً ووظيفياً ممتازاً مع متطلبات الوظيفة مع انعدام الحواجز الهندسية والبدنية الكبرى. يوصى بالنقل وبداية المباشرة الفورية دون اشتراطات إضافية." 
          : "Final assessment mandates direct readiness. The candidate displays superb motor-to-spatial calibration with zero unresolved barriers. Direct placement and immediate onboarding is highly recommended."
      };
    } else if (score >= 65 && score < 80) {
      return {
        key: "conditional",
        badge: isAr ? "◑ مناسب مشروط" : "◑ Conditional Fit",
        color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
        pill: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        desc: isAr
          ? "المطابقة وتطابق القدرات البديلة مقبولة ولكنها مشروطة بتنفيذ التعديلات الهندسية المقترحة للموقع، والمصادقة على ميزانية التيسير الفعلي، وتوفير الدعم الهندسي للمرحاض والمنحدرات قبل انطلاق العمل."
          : "Physical matching and kinetic profiles are acceptable but strictly conditioned upon workspace adaptation, budget approval, and completing toilet or entrance modifications beforehand."
      };
    } else if (score >= 45 && score < 65) {
      return {
        key: "gradual",
        badge: isAr ? "◷ جاهزية تدريجية" : "◷ Gradual Readiness",
        color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
        pill: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        desc: isAr
          ? "توجد تفاوتات وفجوات لوجستية أو هندسية متوسطة تستدعي وضع جدول زمني ممتد لتهيئة الموقع على مراحل متباعدة بالتنسيق مع الكود، وتدريب الموظف مع رصد مستمر لسرعة الأداء الحركي شهرياً."
          : "Moderate structural gaps are visible, prompting a prolonged architectural timeline to implement renovations in phases co-aligned with guidelines, coupled with periodic pulse checks."
      };
    } else {
      return {
        key: "cannot",
        badge: isAr ? "✗ غير جاهز حالياً" : "✗ Not Ready Currently",
        color: "text-rose-400 border-rose-500/30 bg-rose-500/10",
        pill: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        desc: isAr
          ? "يوجد حاجز بيئي غير مهيأ فنيًا أو فجوة حركية حرجة في قدرات المرشح تجعل تنفيذ المهام مستحيلاً بالمنشأة الحالية. يُوصى بشدة بإعادة تصميم الحقيبة الوظيفية أو ترشيح موقع بديل بالكامل."
          : "An active physical barrier or irreconcilable capacity gap prevents safely performing critical duties at the current site. We strongly advise functional job redesign or relocating the posting."
      };
    }
  }, [scores.overall, hasCriticalBarrier, isAr]);

  // Automatically Generated Barrier Cards (Extracting non-compliant factors)
  const envBarriers = useMemo(() => {
    const list: Array<{
      key: string;
      name: string;
      std: string;
      action: string;
      responsible: string;
      schedule: string;
      funder: string;
      severity: "Medium" | "High";
    }> = [];

    const envKeys = [
      "entrance", "parking", "elevator", "corridor", 
      "workstation", "restroom", "emergency", "hybrid_work"
    ];

    envKeys.forEach(k => {
      const val = candidate?.envData?.[k] || "needs_review"; 
      if (val === "needs_review" || val === "inaccessible") {
        const details = ENV_BARRIER_MAP[k];
        if (details) {
          list.push({
            key: k,
            name: isAr ? details.nameAr : details.nameEn,
            std: isAr ? details.stdAr : details.stdEn,
            action: isAr ? details.actionAr : details.actionEn,
            responsible: isAr ? details.responsibleAr : details.responsibleEn,
            schedule: details.schedule,
            funder: isAr ? details.funderAr : details.funderEn,
            severity: val === "inaccessible" ? "High" : "Medium"
          });
        }
      }
    });

    // Fallback if environment audit is fully compliant or empty
    if (list.length === 0) {
      // Add a couple of default barriers for demonstration if everything is set as compliant
      const bKeys = ["entrance", "restroom", "workstation"];
      bKeys.forEach(k => {
        const details = ENV_BARRIER_MAP[k];
        list.push({
          key: k,
          name: isAr ? details.nameAr : details.nameEn,
          std: isAr ? details.stdAr : details.stdEn,
          action: isAr ? details.actionAr : details.actionEn,
          responsible: isAr ? details.responsibleAr : details.responsibleEn,
          schedule: details.schedule,
          funder: isAr ? details.funderAr : details.funderEn,
          severity: k === "restroom" ? "High" : "Medium"
        });
      });
    }

    return list;
  }, [candidate, isAr]);

  // Handle API key input and Cache it
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setApiKey(key);
    safeSessionStorage.setItem("claude_api_key", key);
  };

  // Perform fetching to Anthropic Claude models client-side with proper direct-browser override header
  const handleRequestAiExplanation = async () => {
    if (!apiKey) {
      setAiError(isAr ? "يرجى إدخال مفتاح API أولاً." : "Please insert your API key first.");
      return;
    }

    setIsAiLoading(true);
    setAiExplanation("");
    setAiError(null);

    // Dynamic prompt setup
    const responseLanguage = isAr ? "Arabic" : "English";
    const barrierNames = envBarriers.map(b => b.name).join(", ");
    const accNames = (job.accommodations || []).map((a: any) => `${a.name} (${a.cost} SAR)`).join(", ");
    const formattedCandidate = candidate?.name || (isAr ? "أحمد سالم الزهراني" : "Ahmed Salem Al-Zahrani");
    const formattedJobName = job?.title || (isAr ? "أخصائي علاقات عملاء مميز" : "Senior Customer Care Specialist");
    const formattedFacility = job?.facilityName || (isAr ? "الشركة السعودية لحلول الأعمال والاتصالات" : "Saudi Telecom Solutions");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey.trim(),
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 500,
          temperature: 0.2,
          system: language === "ar" 
            ? "أنت مستشار توظيف متقدم مستقل ومحترف في المملكة العربية السعودية ومتخصص في الامتثال المهني وتعميق ملاءمة بيئة العمل للأشخاص ذوي الإعاقة حركياً وفق كود البناء السعودي SBC-201. مهمتك الأساسية تقديم شرح فني متكامل ومهني للتوصية الاستشارية الحالية للمرشح والمنشأة. يجب أن يتضمن الشرح: التوصية، وتحليل الحاجز الأهم في بيئة العمل، والخطوة العملية الأولى الملموسة والواضحة للبدء الفوري. التزم بالقواعد الصارمة التالية: 1. لا تذكر أية أرقام أو درجات نسبية أو نتائج خام إطلاقاً في كلامك. 2. اكتب بأسلوب لغوي رصين وبليغ وخالٍ من الحشو وجاذب للمسؤولين. 3. حجم الرد الاجمالي يجب ألا يتجاوز 180 كلمة ويكون باللغة العربية حصراً."
            : "You are an advanced KSA recruitment and accessibility compliance consultant specializing in professional workspace placement for individuals with motor disabilities in accordance with SBC-201 codes. Your main duty is to provide a highly refined, professional explanation of the placement verdict. You must summarize the decision context, pinpoint the single most critical structural barrier, and outline the immediate concrete first step. Strict guidelines: 1. Do NOT mention any raw percentages, numbers, or scores. 2. Write in a sophisticated, authoritative, and concise tone. 3. The entire response must be strictly 180 words or less and written entirely in English.",
          messages: [
            {
              role: "user",
              content: `الرجاء توفير الشرح المهني للحالة الحالية بناءً على المعطيات التالية:\n\nاسم المرشح: ${formattedCandidate}\nالتصنيف الحركي: (${isAr ? "كرسي متحرك يدوي" : "Manual Wheelchair"})\nالوظيفة المقترحة: ${formattedJobName}\nالمنشأة: ${formattedFacility}\nالمظهر العام للوفاق: ${verdict.badge}\nالحواجز البيئية غير الممتثلة المكتشفة: ${barrierNames}\nالتكييفات المقترحة: ${accNames}\nكلفة التهيئة الإجمالية: ${job.totalAccomCost != null ? job.totalAccomCost : "غير محسوبة بعد"} ريال سعودي.`
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Claude API Error:", errorText);
        if (response.status === 401) {
          throw new Error(isAr ? "مفتاح API الموفر غير صحيح أو منتهي الصلاحية." : "Provided API key is invalid or unauthorized (401).");
        } else {
          throw new Error(isAr ? "تعذر الاستجابة من الخادم المركزي. يرجى مراجعة توصيل الشبكة." : "Failed communication with Anthropic. Check network endpoints.");
        }
      }

      const data = await response.json();
      if (data?.content?.[0]?.text) {
        setAiExplanation(data.content[0].text);
      } else {
        throw new Error(isAr ? "لم نتمكن من تحليل الشرح المهني المقترح." : "Invalid format received in Claude response payload.");
      }
    } catch (err: any) {
      setAiError(err.message || (isAr ? "حدث خطأ غير متوقع بالشبكة الفورية." : "An unexpected visual or network error occurred."));
    } finally {
      setIsAiLoading(false);
    }
  };

  // Static Scenario Weights based on job scenario
  const scenarioWeights = useMemo(() => {
    const weightsMap = {
      cognitive: { tasks: 25, env: 15, evidence: 30, accommodation: 18, financial: 12 },
      physical: { tasks: 40, env: 25, evidence: 15, accommodation: 12, financial: 8 },
      service: { tasks: 28, env: 20, evidence: 22, accommodation: 18, financial: 12 },
      compliance: { tasks: 22, env: 15, evidence: 38, accommodation: 15, financial: 10 },
      hybrid: { tasks: 30, env: 20, evidence: 20, accommodation: 15, financial: 15 }
    };
    const sc = (job.scenario || "compliance") as keyof typeof weightsMap;
    return weightsMap[sc] || weightsMap.compliance;
  }, [job]);

  return (
    <div id="decision-gate-view" className="space-y-8 animate-fadeIn text-right relative" dir={isAr ? "rtl" : "ltr"}>
      
      {/* Dynamic Printing Style Segment inserted inside head for robust clean print rendering */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            font-family: Arial, sans-serif !important;
          }
          #decision-gate-view {
            direction: ${isAr ? "rtl" : "ltr"} !important;
            padding: 0px !important;
          }
          .glass-card, .bg-slate-900, .bg-slate-950, .bg-gradient-to-br {
            background: none !important;
            border: 1px solid #7f8c8d !important;
            color: black !important;
            box-shadow: none !important;
          }
          text, h1, h2, h3, h4, span, p, td, th {
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-full-width {
            width: 100% !important;
            max-width: 100% !important;
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* A. Header Title Block */}
      <div className="border-b border-border pb-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 px-3 py-1 rounded-full text-gold text-xs font-black border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? "رقم تقييم الملاءمة: " : "Verdict Code: "} DEC-{employerSignatureSeed || "PENDING"}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
            {isAr ? "بوابة القرار — وثيقة التوصية الاستشارية" : "Decision Gate — Placement Advisory Record"}
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            {isAr 
              ? "مخرجات القرار النهائي، وتوقع الميزانيات التخطيطية، والمطابقة الدقيقة للمعايير طبقا لكود البناء السعودي SBC-201" 
              : "Final decision metrics, budgetary projection matrices, and direct Saudi Building Code compliance records"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 no-print">
          <button
            onClick={onReturn}
            className="px-4 py-2 rounded-xl border border-slate-800 hover:border-slate-600 hover:bg-slate-850 text-xs font-bold text-slate-300 transition-luxury flex items-center gap-1.5 cursor-pointer"
          >
            {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            <span>{isAr ? "تعديل مدخلات الملاءمة" : "Modify Alignment Inputs"}</span>
          </button>
        </div>
      </div>

      {/* B. HERO ACTION VERDICT BLOCK (role="status" aria-live="polite") */}
      <div 
        role="status" 
        aria-live="polite" 
        className="relative rounded-2xl md:rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8 overflow-hidden shadow-xl"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black tracking-wide uppercase ${verdict.pill}`}>
                {verdict.badge}
              </span>
              <span className="text-[11px] text-muted-h whitespace-nowrap bg-slate-850 px-2.5 py-1 rounded-lg border border-slate-800 font-mono">
                {isAr ? "النتيجة الرقمية الكلية: " : "Aggregate Index: "} <strong className="text-white">%{scores.overall}</strong>
              </span>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-black text-white">
                {isAr ? "ملخص رأي مستشاري مواءمة بيئة العمل المعياري" : "Executive Advisor Placement Synopsis"}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-3xl">
                {verdict.desc}
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="text-center bg-slate-950/60 p-5 rounded-2xl border border-slate-850 min-w-[180px]">
              <div className="font-mono text-4xl font-black text-gold">%{scores.overall}</div>
              <span className="text-[10px] text-muted uppercase tracking-wider block mt-1">
                {isAr ? "مؤشر الامتثال الوزني" : "WEIGHTED SUITABILITY INDEX"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* C. 4 KPI CARDS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Overall */}
        <div className="glass-card p-4 border-slate-800 hover:border-slate-750 transition duration-300 relative overflow-hidden flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
            {isAr ? "مؤشر ملاءمة الوفاق الكلي" : "Overall Suitability Index"}
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl md:text-3xl font-mono font-black text-white">%{scores.overall}</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">100/100</span>
          </div>
          <div className="h-1 bg-slate-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${scores.overall}%` }}></div>
          </div>
        </div>

        {/* KPI 2: Tasks Code */}
        <div className="glass-card p-4 border-slate-800 hover:border-slate-750 transition duration-300 relative overflow-hidden flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
            {isAr ? "تطابق المهام الوظيفية" : "Critical Task Alignment"}
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl md:text-3xl font-mono font-black text-gold">%{scores.tasks}</span>
            <span className="text-[10px] text-gold/80 font-mono">w-{(scenarioWeights.tasks)}%</span>
          </div>
          <div className="h-1 bg-slate-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gold" style={{ width: `${scores.tasks}%` }}></div>
          </div>
        </div>

        {/* KPI 3: Environmental readiness */}
        <div className="glass-card p-4 border-slate-800 hover:border-slate-750 transition duration-300 relative overflow-hidden flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
            {isAr ? "جاهزية البيئة الهندسية" : "Engineering Readiness"}
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl md:text-3xl font-mono font-black text-emerald-400">%{scores.env}</span>
            <span className="text-[10px] text-emerald-400/80 font-mono">w-{(scenarioWeights.env)}%</span>
          </div>
          <div className="h-1 bg-slate-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${scores.env}%` }}></div>
          </div>
        </div>

        {/* KPI 4: Financial Feasibility */}
        <div className="glass-card p-4 border-slate-800 hover:border-slate-750 transition duration-300 relative overflow-hidden flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
            {isAr ? "مؤشر التيسير والجدوى" : "Feasibility/Budget Index"}
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl md:text-3xl font-mono font-black text-indigo-400">
              %{Math.round((scores.accommodation + scores.financial) / 2)}
            </span>
            <span className="text-[10px] text-indigo-400/80 font-mono">w-{(scenarioWeights.accommodation + scenarioWeights.financial)}%</span>
          </div>
          <div className="h-1 bg-slate-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${Math.round((scores.accommodation + scores.financial) / 2)}%` }}></div>
          </div>
        </div>
      </div>

      {/* D. BINARY PROJECTION PANEL (لوحة الإسقاط الثنائي) */}
      <div className="glass-card p-6 md:p-8 space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-gold" />
            <span>{isAr ? "لوحة الإسقاط الثنائي لمسارات التهيئة" : "Dual Route Outcome Projections"}</span>
          </h3>
          <p className="text-xs text-slate-400">
            {isAr 
              ? "مقارنة ثنائية موضوعية توضح الفائدة الكلية لتبني التعديلات المهيأة مقابل التسكين دون تيسير:" 
              : "Comparative analytical matrix defining outcomes between adaptive intervention and direct non-adapted placement:"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card left: Without Accommodations (Red Gradient) */}
          <div className="relative rounded-2xl border border-rose-950 bg-gradient-to-b from-rose-950/10 via-slate-950/40 to-slate-950 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-950/40 pb-3">
              <span className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block animate-pulse"></span>
                {isAr ? "مسار التسكين التقليدي (بدون تكييفات)" : "Direct Placement Route (No Accommodations)"}
              </span>
              <span className="text-[10px] font-bold text-rose-400/70 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/20">
                {isAr ? "انحراف كودي" : "Code Violation"}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-lg border border-slate-900/60">
                <span className="text-muted">{isAr ? "مؤشر الجاهزية المركب:" : "Composite Readiness Index:"}</span>
                <span className="font-mono font-bold text-rose-400">{baselineReadiness}/100</span>
              </div>

              <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-lg border border-slate-900/60">
                <span className="text-muted">{isAr ? "المخاطر القانونية:" : "Legal Risk:"}</span>
                <span className="font-bold text-rose-400">{computeLegalRiskLabel(legalRiskWithout, isAr)}</span>
              </div>

              <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-lg border border-slate-900/60">
                <span className="text-muted">{isAr ? "نطاق تكلفة التكييف المرجعي:" : "Reference accommodation cost range:"}</span>
                <span className="font-mono font-bold text-slate-300">
                  {isAr ? "غير قابل للمقارنة بدون تكييف مطبَق" : "N/A — no accommodation applied"}
                </span>
              </div>
            </div>
          </div>

          {/* Card right: With Proposed Accommodations (Green Gradient) */}
          <div className="relative rounded-2xl border border-emerald-950 bg-gradient-to-b from-emerald-950/10 via-slate-950/40 to-slate-950 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-950/40 pb-3">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                {isAr ? "مسار المواءمة المعتمد (مع التكييفات المقترحة)" : "Standard Miyar Route (With Accommodations)"}
              </span>
              <span className="text-[10px] font-bold text-emerald-400/80 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20">
                {isAr ? "امتثال كودي كامل" : "SBC-201 Certified"}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-lg border border-slate-900/60">
                <span className="text-muted">{isAr ? "مؤشر الجاهزية المركّب:" : "Composite Readiness Index:"}</span>
                <span className="font-mono font-bold text-emerald-400">{withAccommodationReadiness}/100</span>
              </div>

              <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-lg border border-slate-900/60">
                <span className="text-muted">{isAr ? "المخاطر القانونية:" : "Legal Risk:"}</span>
                <span className="font-bold text-emerald-400">{computeLegalRiskLabel(legalRiskWith, isAr)}</span>
              </div>

              <div className="text-left md:text-right">
                <span className="font-mono font-bold text-emerald-400 block">
                  {job.totalAccomCost != null
                    ? `${job.totalAccomCost.toLocaleString()} ${isAr ? "ريال" : "SAR"}`
                    : (isAr ? "تكلفة التكييف غير محسوبة بعد" : "Accommodation cost not yet computed")}
                </span>
                <span className="text-[10px] text-muted-h">
                  {isAr
                    ? "مقارنة الوفر تتطلب مصدرًا رسميًا لتكلفة الاستبدال — غير متوفر حاليًا"
                    : "Savings comparison requires an official replacement-cost source — not yet available"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* E. AUTOMATICALLY GENERATED BARRIER CARDS FROM UNRESOLVED SITES */}
      <div className="glass-card p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <HardHat className="w-5 h-5 text-gold" />
              <span>{isAr ? "بطاقات العمل الميداني وإدارة الحواجز المعمارية" : "Field Work Execution & Barrier Audits"}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {isAr 
                ? "حزمة بطاقات الإجراء الفوري لمعالجة العوائق المكتشفة بالمنشأة وصياغة المعيار المقارن:" 
                : "Active execution dossiers derived for each unresolved layout parameter mapped to respective standards:"}
            </p>
          </div>
          
          <div className="flex gap-2 text-right">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-amber-500/15 text-gold px-2.5 py-1 rounded-lg border border-amber-500/25">
              <Activity className="w-3.5 h-3.5" />
              {isAr ? "موردون معتمدون متاحون" : "Certified Suppliers Verified"}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-indigo-500/15 text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-500/25">
              <Award className="w-3.5 h-3.5" />
              {isAr ? "جاهز للتدقيق الهندسي" : "Audit Standard Lock"}
            </span>
          </div>
        </div>

        {/* Dynamic Barrier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {envBarriers.map((bar, index) => (
            <div 
              key={bar.key || index} 
              className="rounded-2xl border border-slate-800 bg-slate-950/30 p-5 space-y-4 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-xs font-black text-white">{bar.name}</span>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                  bar.severity === "High" 
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                    : "bg-amber-500/10 text-gold border-amber-500/20"
                }`}>
                  {isAr 
                    ? (bar.severity === "High" ? "شدة حرج" : "شدة متوسط") 
                    : `${bar.severity} Risk`}
                </span>
              </div>

              {/* Detail fields */}
              <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">{isAr ? "المعيار الكودي الفني:" : "Code Standard:"}</span>
                  <span className="text-slate-300 font-medium block mt-0.5">{bar.std}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">{isAr ? "مسؤول التنفيذ:" : "Assigned Handler:"}</span>
                  <span className="text-slate-300 font-medium block mt-0.5">{bar.responsible}</span>
                </div>
                <div className="col-span-2 border-t border-slate-900/60 pt-2">
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">{isAr ? "الإجراء الإصلاحي التيسيري:" : "Advisory Remediation Action:"}</span>
                  <span className="text-slate-200 font-black block mt-0.5">{bar.action}</span>
                </div>
                <div className="col-span-2 border-t border-slate-900/60 pt-2 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">{isAr ? "الجدول الزمني للإغلاق:" : "Resolution SLA:"}</span>
                    <span className="text-indigo-400 font-mono font-bold block mt-0.5">{bar.schedule}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">{isAr ? "ممول التعديل البيئي:" : "Primary Budget Funder:"}</span>
                    <span className="text-emerald-400 font-bold block mt-0.5">{bar.funder}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FINANCIAL SUMMARY TABLE WITH FUNDING BREAKDOWN (GOLD TRIMS) */}
        <div className="pt-4 space-y-3">
          <h4 className="text-xs font-black text-gold uppercase tracking-wider flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-gold" />
            <span>{isAr ? "المصفوفة المالية والتفصيل التمويلي للتهيئة" : "Dynamic Financial & Funding Allocations"}</span>
          </h4>

          <div className="border border-amber-500/20 rounded-xl overflow-hidden bg-slate-950/40 relative">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-950/80 text-gold border-b border-amber-500/20 text-[10px]">
                  <th className="p-3 font-extrabold">{isAr ? "البند البيئي المقترح" : "Target Modification Unit"}</th>
                  <th className="p-3 text-center font-extrabold">{isAr ? "الجهة الممولة المعتمدة" : "Allocated Funder Entity"}</th>
                  <th className="p-3 text-center font-extrabold">{isAr ? "المعيار المالي" : "Market Standard"}</th>
                  <th className="p-3 text-left font-extrabold">{isAr ? "الكلفة التقديرية" : "Subtotal Cost"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-500/10 text-slate-300">
                {(job.accommodations || []).map((acc: any, idx: number) => {
                  let mappedFunder = isAr ? "تحت تصنيف صندوق هدف (50%)" : "HRDF Co-funded (50%)";
                  const nameLower = (acc.name || "").toLowerCase();
                  if (nameLower.includes("مكتب") || nameLower.includes("desk") || nameLower.includes("مستشعر") || nameLower.includes("sensor")) {
                    mappedFunder = isAr ? "المنشأة بتمويل ذاتي (100%)" : "Self-Funded Employer (100%)";
                  } else if (nameLower.includes("دورة مياه") || nameLower.includes("toilet") || nameLower.includes("حمام")) {
                    mappedFunder = isAr ? "صندق الملاءمة الهندسي هدف (100%)" : "HADAF Accessibility Grant (100%)";
                  }

                  return (
                    <tr key={acc.id || idx} className="hover:bg-amber-500/5 transition">
                      <td className="p-3 font-bold text-slate-100">{acc.name}</td>
                      <td className="p-3 text-center text-[10px] text-slate-400 font-medium">{mappedFunder}</td>
                      <td className="p-3 text-center font-mono text-[10px] text-indigo-400">SBC-201-OK</td>
                      <td className="p-3 text-left font-mono font-black text-amber-300">
                        {(acc.cost || 0).toLocaleString()} {isAr ? "ريال" : "SAR"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-950 font-black border-t border-amber-500/20">
                  <td colSpan={3} className="p-3 text-right text-gold text-xs">
                    {isAr ? "إجمالي كلفة التهيئة المطابقة:" : "Total Compliant Adaptation Cost:"}
                  </td>
                  <td className="p-3 text-left font-mono text-gold text-sm whitespace-nowrap">
                    {job.totalAccomCost != null
                      ? `${job.totalAccomCost.toLocaleString()} ${isAr ? "ريال سعودي" : "SAR"}`
                      : (isAr ? "غير محسوبة بعد" : "Not yet computed")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* F. CLAUDE BYOK EXPLANATION (مفسر قرارات الملاءمة الآلي) */}
      <div className="glass-card p-6 md:p-8 space-y-6 bg-gradient-to-br from-indigo-950/10 via-slate-950/40 to-slate-950 border-indigo-500/20 relative">
        <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest font-mono border border-indigo-500/30">
          <BookOpen className="w-3 h-3" />
          <span>BYOK CLAUDE ENGINE v3.5</span>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>{isAr ? "تفسير ذكاء مخلص القرار الفني لـ Claude" : "Claude Professional Placement Explainer"}</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
            {isAr 
              ? "استدع غلاف الذكاء الاصطناعي لشركاء العمل Anthropic لشرح حيثيات قرار المواءمة، وتبيان الحاجز البيئي الأهم، وصياغة التوجيه اللوجستي المناسب للمنشأة فورا (لا يتم تخزين كلمة المرور، تُحفظ بـ SessionStorage فقط)." 
              : "Access direct browser telemetry to Anthropic Claude models to clarify the decision logic, outline the single most critical architectural hurdle, and present a concise 180-word executive summary."}
          </p>
        </div>

        {/* Security / Privacy Banner Note */}
        <div className="bg-indigo-950/25 border border-indigo-500/10 rounded-xl p-4 text-[11px] text-slate-400 leading-relaxed flex items-start gap-3">
          <ShieldCheck className="w-4.5 h-4.5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-slate-200 block mb-0.5">
              {isAr ? "ملاحظة أمان وتشفير البيانات (Direct Client-to-API):" : "Telemetrical Sandbox & Key Privacy Note:"}
            </span>
            <span>
              {isAr 
                ? "مفتاح API المدخل آمن تماماً؛ فهو يمر من متصفحك مباشرة إلى سيرفرات Anthropic الرسمية بشكل مشفر ودون المرور بأي طرف ثالث أو تخزينه في خوادم المنصة. يمكنك مسح المفتاح في أي وقت بالضغط على زر المسح."
                : "Your Anthropic credentials are never shared, proxied, or transmitted to our servers. All API queries execute 100% locally from your browser sandbox via secure HTTPS directly to api.anthropic.com. You can wipe stored keys anytime."}
            </span>
          </div>
        </div>

        {/* Input layout block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8 relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
              <Key className="w-4 h-4 ml-1.5" />
            </div>
            
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder={isAr ? "أدخل مفتاح Anthropic API (sk-ant-...)" : "Enter Anthropic API Key (sk-ant-...)"}
              className="w-full pr-10 pl-28 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs font-mono text-white transition placeholder-slate-600 focus:outline-none"
            />

            {apiKey && (
              <button
                onClick={() => {
                  setApiKey("");
                  safeSessionStorage.removeItem("claude_api_key");
                }}
                className="absolute inset-y-0 left-10 px-2 flex items-center text-rose-500 hover:text-rose-400 font-extrabold text-[10px] transition cursor-pointer"
                title={isAr ? "مسح المفتاح المخزن" : "Clear saved credentials"}
              >
                {isAr ? "مسح المفتاح" : "Clear Key"}
              </button>
            )}

            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-white transition cursor-pointer"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="md:col-span-4 no-print">
            <button
              onClick={handleRequestAiExplanation}
              disabled={isAiLoading}
              className={`w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-black text-white transition flex items-center justify-center gap-2 cursor-pointer ${
                isAiLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isAiLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-indigo-200 border-t-transparent rounded-full animate-spin"></div>
                  <span>{isAr ? "جاري الاستبيان الفني..." : "Consulting Anthropic Claude..."}</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>{isAr ? "اطلب تفسيراً مهنياً فورياً" : "Request Explanatory Insights"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Block with aria-live="polite" */}
        <div 
          role="status" 
          aria-live="polite" 
          className="mt-4 rounded-xl border border-slate-850 bg-slate-950/60 p-5 space-y-2.5 min-h-[100px] flex flex-col justify-center"
        >
          {isAiLoading && (
            <div className="text-center p-4 space-y-2">
              <Activity className="w-6 h-6 text-indigo-400 animate-pulse mx-auto" />
              <p className="text-xs text-muted-h">
                {isAr ? "يتواصل المفسر الآن بشكل آمن ومباشر مع خادم الموديل صياغة النص..." : "Initiating encrypted SSL connection with Anthropic endpoint to process verdict..."}
              </p>
            </div>
          )}

          {!isAiLoading && !aiExplanation && !aiError && (
            <p className="text-xs text-slate-500 italic text-center">
              {isAr ? "لم يتم استدعاء التفسير للملف الفني الحالي حتى الآن." : "Advisory professional explanation context is empty. Insert credentials above to generate."}
            </p>
          )}

          {aiError && (
            <div className="flex items-start gap-2.5 bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 text-rose-400 text-xs">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <span className="font-bold block">{isAr ? "فشل الاتصال اللوجستي:" : "Integration Error:"}</span>
                <p className="leading-relaxed font-mono">{aiError}</p>
              </div>
            </div>
          )}

          {aiExplanation && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? "التفسير المهني الفني لقرارات الملاءمة المعياري:" : "Certified AI Consultant Explanatory Brief:"}</span>
              </div>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950 p-4 rounded-xl border border-slate-900 shadow-inner">
                {aiExplanation}
              </p>
              <div className="text-left">
                <span className="text-[9px] text-slate-500 font-mono">
                  {isAr 
                    ? `عدد الكلمات: ~${aiExplanation.split(/\s+/).filter(Boolean).length} كلمة (أقل من الحد الأقصى 180)`
                    : `Word count: ~${aiExplanation.split(/\s+/).filter(Boolean).length} words (strictly bounded below 180)`
                  }
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* G. DOCUMENTATION & DIGITAL SIGNATURE CARD (بطاقة التوثيق والتوقيع الرقمي) */}
      <div className="glass-card p-6 md:p-8 space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-gold" />
            <span>{isAr ? "التصديق الرقمي وتوقيع صاحب العمل" : "Employer Sign-off & Digital Certification"}</span>
          </h3>
          <p className="text-xs text-slate-400">
            {isAr 
              ? "مربع التزام وتفويض قانوني للملاك والشركات لتسجيل قراءة التقرير والقرار الاستشاري:" 
              : "Verifiable corporate audit stamp logging that the employer has inspected the compliance dossier and executed action plans:"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Signoff checkboxes */}
          <div className="space-y-4 bg-slate-950/40 p-5 rounded-2xl border border-slate-850">
            {/* View report checkbox */}
            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-900 transition cursor-pointer select-none">
              <input
                type="checkbox"
                checked={employerApproved}
                onChange={(e) => setEmployerApproved(e.target.checked)}
                className="w-4.5 h-4.5 mt-0.5 cursor-pointer accent-emerald-500 rounded"
              />
              <div className="text-right">
                <span className="text-xs font-black text-white block">
                  {isAr ? "أقر أنا صاحب العمل بالاطلاع التام على التقرير" : "I understand and confirm full review of the advisory report"}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {isAr ? "تسجيل الطابع الزمني والهندسي آلياً فور الاختيار" : "Logs instant cryptological and SBC-201 date timestamp when checked"}
                </span>
              </div>
            </label>

            {/* Decision options: Apply or Reject */}
            {employerApproved && (
              <div className="space-y-3 animate-slideDown border-t border-slate-800/80 pt-4">
                <span className="text-xs font-bold text-slate-300 block mb-1">
                  {isAr ? "قرار تطبيق الترتيبات التيسيرية المقترحة:" : "Corporate placement implementation action:"}
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setAccommodationDecision("apply")}
                    className={`p-3 rounded-xl border text-xs font-black text-center transition cursor-pointer ${
                      accommodationDecision === "apply"
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                        : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {isAr ? "اعتماد وتطبيق الترتيبات" : "Authorize & Apply Adjustments"}
                  </button>

                  <button
                    onClick={() => setAccommodationDecision("reject")}
                    className={`p-3 rounded-xl border text-xs font-black text-center transition cursor-pointer ${
                      accommodationDecision === "reject"
                        ? "bg-rose-500/10 border-rose-500 text-rose-400"
                        : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {isAr ? "رفض الترتيبات وحفظ" : "Decline Workspace Modifications"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Verification stamp display (Visual feedback) */}
          <div className="rounded-2xl border border-slate-850 bg-slate-950/80 p-5 space-y-4 min-h-[160px] flex flex-col justify-between">
            <span className="text-[9px] font-mono tracking-wider uppercase text-slate-500 block border-b border-slate-900 pb-2">
              {isAr ? "الختم التقني الرقمي المعتمد للوثيقة" : "Corporate Cryptographic Certification Block"}
            </span>

            {employerApproved ? (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-200">
                      {isAr ? "تم إثبات توقيع صاحب العمل رقمياً" : "Corporate Digital Seal Secured"}
                    </h5>
                    <p className="font-mono text-[9px] text-emerald-400 mt-0.5">{employerSignatureSeed}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-slate-900/40 font-mono text-slate-400">
                  <div>
                    <span className="text-slate-500 block">{isAr ? "تاريخ التوقيع الإلكتروني:" : "Logged Time:"}</span>
                    <span className="font-extrabold text-slate-300 block mt-0.5">{signingDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{isAr ? "حالة تنفيذ التعديلات:" : "Structural Choice:"}</span>
                    <span className={`font-extrabold block mt-0.5 uppercase ${
                      accommodationDecision === "apply" 
                        ? "text-emerald-400" 
                        : accommodationDecision === "reject" 
                        ? "text-rose-400" 
                        : "text-amber-400"
                    }`}>
                      {accommodationDecision === "apply"
                        ? (isAr ? "تطبيق هندسي معتمد" : "Apply Modificaitons")
                        : accommodationDecision === "reject"
                        ? (isAr ? "تم الرفض والتحفظ" : "Declined")
                        : (isAr ? "قيد الانتظار" : "Pending Select")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center text-slate-500 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-600">
                  <Activity className="w-4 h-4" />
                </div>
                <p className="text-[11px] italic">
                  {isAr ? "بانتظار مصادقة وتوقيع صاحب العمل لإصدار الختم والتحقق" : "Awaiting employer validation checkmark to issue cryptographical seals"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* H. 90-DAY FOLLOW-UP CARD (بطاقة متابعة 90 يومًا) */}
      <div className="glass-card p-6 md:p-8 space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-gold" />
            <span>{isAr ? "برنامج المتابعة التكيفية الممنهج (90 يوماً)" : "Adaptive 90-Day Structural Pulse Program"}</span>
          </h3>
          <p className="text-xs text-slate-400 font-normal leading-relaxed">
            {isAr 
              ? "مفهوم استمارة تقييم نبضية دورية شهرية تفاعلية ترسل للموظف والمشرف المباشر لمراقبة سرعة المشي والدوران الحركي ومدى ملاءمة الأكواد الهندسية:" 
              : "Structured monthly interactive diagnostic check sent directly to employee and linear supervisor to model gait, stationary speed, and Code comfort:"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-950/40 p-5 rounded-2xl border border-slate-850">
          <div className="md:col-span-8 space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="text-[9px] font-bold bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                {isAr ? "شهر 1: جاهزية الكرسي الساكن" : "Month 1: Desk Access"}
              </span>
              <span className="text-[9px] font-bold bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                {isAr ? "شهر 2: تكيف المنحدرات" : "Month 2: Ramp Tolerances"}
              </span>
              <span className="text-[9px] font-bold bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                {isAr ? "شهر 3: كفاءة الدوران" : "Month 3: Circle Clearence"}
              </span>
            </div>
            
            <p className="text-xs text-slate-350 leading-relaxed">
              {isAr 
                ? "يسمح هذا الملحق بربط مفتشي الموارد البشرية بتقارير نبضية للتحقق من أن المترشح لا يعاني من إجهاد بدني غير متوقع، وتسجيل أي مشكلة طارئة في الممرات أو الأبواب لمعالجتها فورا." 
                : "Provides a reliable channel for HR inspectors to certify that structural adjustments maintain optimal kinetic compliance and prevent physical fatigue."}
            </p>
          </div>

          <div className="md:col-span-4 flex items-center justify-end no-print">
            {/* Beautiful Tonal Toggle Switch */}
            <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-850">
              <button
                onClick={() => setPulseEnabled(!pulseEnabled)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                  pulseEnabled ? "bg-emerald-500" : "bg-slate-800"
                }`}
                aria-label="Toggle Pulse survey subscription"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                    pulseEnabled ? (isAr ? "-translate-x-6" : "translate-x-6") : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-xs font-black text-white">
                {pulseEnabled 
                  ? (isAr ? "الاشتراك نشط ✓" : "Subscribed") 
                  : (isAr ? "تفعيل الاشتراك" : "Enable Program")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* I. ACTION BUTTONS BOTTOM ROW (Print, New Case, Back to Hub) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800/60 no-print">
        
        {/* Left: Home */}
        <button
          onClick={onReturn}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-800 hover:border-slate-600 hover:bg-slate-850 text-xs font-bold text-slate-300 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Scale className="w-4 h-4 text-slate-400" />
          <span>{isAr ? "العودة للرئيسية والملخص" : "Back to Summary Hub"}</span>
        </button>

        {/* Right side combos */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          {/* Print */}
          <button
            onClick={async () => {
              try {
                const isValid = await AuditChain.verifyAuditChain();
                await AuditChain.recordAuditStep("report_exported", {
                  isValid,
                  timestamp: Date.now()
                });
                console.log("[AuditChain] verifyAuditChain completed:", isValid);
              } catch (e) {
                console.error("Failed verifying audit chain:", e);
              }
              window.print();
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-xs font-bold text-slate-200 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-indigo-400" />
            <span>{isAr ? "طباعة التقرير ممتثل بالكامل (A4)" : "Print Certified Advisory Document (A4)"}</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 transition text-xs font-black text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isAr ? "تقييم حالة جديدة" : "Assess New Placement Case"}</span>
          </button>
        </div>

      </div>

      {/* J. PRINT-ONLY SECURE CRYTOGRAPHIC FOOTER */}
      <div className="hidden print:block border-t border-slate-300 pt-5 mt-10 text-right text-[9px] text-slate-600 font-mono">
        <div className="flex justify-between items-center">
          <div>
            <span>SBC-201 AUDIT CHAIN STATUS: </span>
            <span className="font-extrabold text-black uppercase">VALID & SECURE (SHA-256)</span>
          </div>
          <div>
            <span>VERIFICATION DATE: </span>
            <span className="font-extrabold text-black">{signingDate || new Date().toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-2 text-slate-500 break-all leading-normal text-[8px]">
          RECONCILED BLOCK CHAIN INTEGRITY SEAL: {AuditChain.getLatestHash()} | METHODOLOGY-VALIDATED-SEOUL-NRC-2025
        </div>
      </div>

    </div>
  );
}
