export interface AuditStep {
  eventType: string;
  snapshot: any;
  timestamp: number;
  prevHash: string;
  hash: string;
}

export const AuditChain = (() => {
  let chain: AuditStep[] = [];

  // Initialize from sessionStorage if exists
  try {
    const saved = typeof window !== "undefined" && window.sessionStorage.getItem("miyar_audit_chain");
    if (saved) {
      chain = JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load audit chain from storage", e);
  }

  async function sha256(message: string): Promise<string> {
    try {
      if (typeof crypto !== "undefined" && crypto.subtle) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      }
    } catch (e) {
      console.warn("Crypto subtle not available, falling back to basic hash", e);
    }
    // Fallback simple hash for non-secure contexts
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
        const char = message.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(64, "0");
  }

  return {
    async recordAuditStep(eventType: string, snapshot: any): Promise<string> {
      const timestamp = Date.now();
      const prevHash = chain.length > 0 
        ? chain[chain.length - 1].hash 
        : "0000000000000000000000000000000000000000000000000000000000000000";
      
      // Compute hash block based on exact prompt request structure:
      // JSON.stringify(snapshot)+prevHash+timestamp
      const payload = JSON.stringify(snapshot) + prevHash + timestamp;
      const hash = await sha256(payload);

      const step: AuditStep = {
        eventType,
        snapshot,
        timestamp,
        prevHash,
        hash
      };

      chain.push(step);

      try {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("miyar_audit_chain", JSON.stringify(chain));
        }
      } catch (e) {
        console.error("Failed to persist audit chain step", e);
      }

      console.log(`[AuditChain] eventType recorded: ${eventType}, Hash: ${hash}`);
      return hash;
    },

    async verifyAuditChain(): Promise<boolean> {
      let currentPrevHash = "0000000000000000000000000000000000000000000000000000000000000000";
      for (const step of chain) {
        if (step.prevHash !== currentPrevHash) {
          console.error(`[AuditChain] Verification mismatch. Expected prevHash: ${currentPrevHash}, but step had: ${step.prevHash}`);
          return false;
        }
        const payload = JSON.stringify(step.snapshot) + step.prevHash + step.timestamp;
        const recalculatedHash = await sha256(payload);
        if (recalculatedHash !== step.hash) {
          console.error(`[AuditChain] Verification mismatch. Recalculated hash: ${recalculatedHash}, step had: ${step.hash}`);
          return false;
        }
        currentPrevHash = step.hash;
      }
      return true;
    },

    exportAuditTrail(): AuditStep[] {
      return [...chain];
    },

    getLatestHash(): string {
      return chain.length > 0 ? chain[chain.length - 1].hash : "0000000000000000000000000000000000000000000000000000000000000000";
    },

    clearChain(): void {
      chain = [];
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("miyar_audit_chain");
      }
    }
  };
})();

if (typeof window !== "undefined") {
  (window as any).AuditChain = AuditChain;
}
