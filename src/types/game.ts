export type ModerationAction = "approve" | "reject";
export type GameStage = "menu" | "prologue" | "playing" | "shift_report";

export interface PostComment {
  id: string;
  authorHandle: string;
  authorName: string;
  content: string;
  timestamp: string;
  isOfficial?: boolean;
}

export interface UserHistoryReport {
  accountAge: string;
  trustScore: number;
  previousStrikes: number;
  realIdentityStatus: string;
  backgroundNotes: string;
  recentFlags: string[];
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
  userHistory: UserHistoryReport;
  consequences: {
    onApprove: TicketConsequence;
    onReject: TicketConsequence;
  };
}

export interface WindowState {
  id: "moderation" | "search" | "handbook";
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
  timeSpentSeconds: number;
  rewardEarned: number;
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
