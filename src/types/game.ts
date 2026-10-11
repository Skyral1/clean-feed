export type ModerationAction = "approve" | "reject";

export interface TicketPolicyRule {
  id: string;
  category: "hate_speech" | "misinformation" | "corporate_criticism" | "copyright";
  companyStandard: ModerationAction;
  ethicalStandard: ModerationAction;
  severity: number;
}

export interface Ticket {
  id: string;
  authorHandle: string;
  authorVerified: boolean;
  reachMultiplier: number;
  content: string;
  visualCue: string;
  timestamp: string;
  rule: TicketPolicyRule;
  contextHint: string;
  corporateDirectiveOverride?: ModerationAction;
}

export interface PlayerStats {
  funds: number;
  mentalHealth: number;
  hrStrikes: number;
  day: number;
}
