export const SEVERITY: Record<string, number> = {
  "cannot": 2,
  "لا يستطيع": 2,
  "accom": 1,
  "بتكييف": 1,
  "can": 0,
  "يستطيع": 0
};

export function worseOf(a: string, b: string): string {
  const sevA = SEVERITY[a] !== undefined ? SEVERITY[a] : 0;
  const sevB = SEVERITY[b] !== undefined ? SEVERITY[b] : 0;
  return sevA >= sevB ? a : b;
}

export const CapabilityProfile = (() => {
  let activeProfile: any = null;

  return {
    setCapabilityProfile(profile: any) {
      activeProfile = profile;
    },

    computeGuaranteedCapability(): Record<string, string> {
      if (!activeProfile) {
        return {};
      }

      const isFluctuating = activeProfile.isFluctuating || false;
      const capabilities = activeProfile.capabilities || {};
      const goodDay = activeProfile.capabilitiesGoodDay || capabilities || {};
      const badDay = activeProfile.capabilitiesBadDay || capabilities || {};

      if (!isFluctuating) {
        // If !isFluctuating returns goodDay (which matches the regular capabilities list if goodDay is absent)
        return { ...goodDay };
      }

      // If fluctuating, returns the worse of both for each capability between good day and bad day
      const guaranteed: Record<string, string> = {};
      const allKeys = new Set([...Object.keys(goodDay), ...Object.keys(badDay)]);

      allKeys.forEach(cid => {
        const valGood = goodDay[cid] || "can";
        const valBad = badDay[cid] || "can";
        guaranteed[cid] = worseOf(valGood, valBad);
      });

      return guaranteed;
    }
  };
})();

if (typeof window !== "undefined") {
  (window as any).CapabilityProfile = CapabilityProfile;
}
