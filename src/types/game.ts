export type ModerationAction = "approve" | "reject";
export type GameStage = "menu" | "prologue" | "playing" | "shift_report";

export interface UserHistoryReport {
  accountAge: string;
  trustScore: number;
  previousStrikes: number;
  realIdentityStatus: string;
  backgroundNotes: string;
  recentFlags: string[];
}

export interface TicketConsequence {
  newsHeadline: string;
  mentalHealthImpact: number;
  societalImpactDesc: string;
}

export interface TicketPolicyRule {
  id: string;
  category: string;
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
  imageUrl: string;
  visualCue: string;
  timestamp: string;
  rule: TicketPolicyRule;
  contextHint: string;
  corporateDirectiveOverride?: ModerationAction;
  userHistory: UserHistoryReport;
  consequences: {
    onApprove: TicketConsequence;
    onReject: TicketConsequence;
  };
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
