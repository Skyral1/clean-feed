export type ModerationAction = "approve" | "reject";
export type GameStage = "menu" | "prologue" | "playing" | "shift_report" | "hacker_terminal";

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: "ddos" | "audit" | "leak" | "bonus";
  choices: {
    label: string;
    action: () => void;
  }[];
}

export interface PostComment {
  id: string;
  authorHandle: string;
  authorName: string;
  content: string;
  timestamp: string;
  isOfficial?: boolean;
}

export interface IntranetRecord {
  title: string;
  category: string;
  summary: string;
  riskRating: "Faible" | "Modéré" | "Élevé" | "Menace Actionnariat";
  corporateActionDirective: string;
}

export interface DarknetLeak {
  title: string;
  source: string;
  rawEvidence: string;
  unfilteredTruth: string;
}

export interface TicketPolicyRule {
  id: string;
  category: string;
  companyStandard: ModerationAction;
  ethicalStandard: ModerationAction;
  directiveSummary: string;
}

export interface TicketConsequence {
  newsHeadline: string;
  mentalHealthImpact: number;
  societalImpactDesc: string;
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
  comments: PostComment[];
  rule: TicketPolicyRule;
  contextHint: string;
  corporateDirectiveOverride?: ModerationAction;
  intranetRecord: IntranetRecord;
  darknetLeak: DarknetLeak;
  consequences: {
    onApprove: TicketConsequence;
    onReject: TicketConsequence;
  };
}

export interface WindowState {
  id: "moderation" | "search" | "darknet" | "handbook" | "status";
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LoggedDecision {
  ticketId: string;
  actionTaken: ModerationAction;
  author: string;
  rewardEarned: number;
  headlineGenerated: string;
  wasCompliant: boolean;
  wasEthical: boolean;
  usedDarknet: boolean;
}

export interface PlayerStats {
  funds: number;
  mentalHealth: number;
  hrStrikes: number;
  day: number;
}
