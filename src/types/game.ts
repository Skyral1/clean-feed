export type ModerationAction = "approve" | "reject";

export interface UserHistoryReport {
  accountAge: string;
  trustScore: number; // 0 à 100
  previousStrikes: number;
  realIdentityStatus:
    | "Vérifiée (Biométrie)"
    | "Anonyme (VPN)"
    | "Sous mandat judiciaire"
    | "Monétisé certifié";
  backgroundNotes: string;
  recentFlags: string[];
}

export interface TicketNarrativeConsequences {
  onApprove: {
    newsHeadline: string;
    mentalHealthImpact: number;
    societalImpactDesc: string;
  };
  onReject: {
    newsHeadline: string;
    mentalHealthImpact: number;
    societalImpactDesc: string;
  };
}

export interface TicketPolicyRule {
  id: string;
  category:
    | "Sécurité d'État"
    | "Atteinte à l'actionnariat"
    | "Désinformation médicale"
    | "Mouvement social";
  companyStandard: ModerationAction;
  ethicalStandard: ModerationAction;
  directiveSummary: string;
}

export interface Ticket {
  id: string;
  authorHandle: string;
  authorName: string;
  authorVerified: boolean;
  reachMultiplier: number;
  content: string;
  visualCue: string;
  timestamp: string;
  rule: TicketPolicyRule;
  contextHint: string;
  corporateDirectiveOverride?: ModerationAction;
  userHistory: UserHistoryReport;
  consequences: TicketNarrativeConsequences;
}

export interface LoggedDecision {
  ticketId: string;
  actionTaken: ModerationAction;
  author: string;
  headlineGenerated: string;
  wasCompliant: boolean;
  wasEthical: boolean;
}

export interface PlayerStats {
  funds: number;
  mentalHealth: number;
  hrStrikes: number;
  day: number;
}
