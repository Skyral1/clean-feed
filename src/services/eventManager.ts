import type { PlayerStats, Ticket, GameEvent } from "@/types/game";
import { currentLang } from "@/services/i18n";

export interface EventTriggerCondition {
  minDay: number;
  minSecondsElapsed: number;
  check: (stats: PlayerStats, currentTicketIndex: number) => boolean;
}

export interface TriggeredEventDefinition {
  id: string;
  trigger: EventTriggerCondition;
  title: { fr: string; en: string };
  type: "ddos" | "audit" | "leak" | "bonus";
  description: { fr: string; en: string };
  choices: {
    label: { fr: string; en: string };
    apply: (stats: PlayerStats) => void;
  }[];
}

export const GAME_EVENTS: TriggeredEventDefinition[] = [
  // Événement 1 : Jour 2, Ghost teste sa passerelle après l'installation de TorNet
  {
    id: "ghost_first_ping",
    trigger: {
      minDay: 2,
      minSecondsElapsed: 25,
      check: () => true,
    },
    title: {
      fr: "Signal Clandestin // Ghost",
      en: "Underground Ping // Ghost",
    },
    type: "leak",
    description: {
      fr: "Ghost utilise votre proxy TorNet fraîchement installé : « Je t'envoie un jeton anonyme pour compenser ton loyer. Fais circuler la vérité. »",
      en: "Ghost tests your freshly installed TorNet gateway: 'Sending an anonymous token to subsidize your rent. Keep the truth flowing.'",
    },
    choices: [
      {
        label: {
          fr: "Accepter le subside (+15.0 €)",
          en: "Accept underground stipend (+€15.00)",
        },
        apply: (stats) => {
          stats.funds += 15.0;
        },
      },
      {
        label: {
          fr: "Refuser pour ne laisser aucune trace (Prudence)",
          en: "Refuse to avoid logging traces (Cautious)",
        },
        apply: () => {},
      },
    ],
  },

  // Événement 2 : Déclenché si le joueur est proche du renvoi (2 strikes RH)
  {
    id: "hr_final_warning",
    trigger: {
      minDay: 2,
      minSecondsElapsed: 15,
      check: (stats) => stats.hrStrikes >= 2,
    },
    title: {
      fr: "Avertissement Solennel du DRH",
      en: "HR Final Warning Letter",
    },
    type: "audit",
    description: {
      fr: "Vos écarts de conduite ont déclenché une revue hiérarchique. Un inspecteur RH propose d'effacer une faute contre des frais de mise en conformité.",
      en: "Your compliance history flagged an executive review. An HR officer offers to purge one infraction in exchange for processing fees.",
    },
    choices: [
      {
        label: {
          fr: "Régler l'amende de complaisance (-20.0 €, retire 1 strike)",
          en: "Pay compliance fee (-€20.00, removes 1 strike)",
        },
        apply: (stats) => {
          stats.funds = Math.max(0, stats.funds - 20.0);
          stats.hrStrikes = Math.max(0, stats.hrStrikes - 1);
        },
      },
      {
        label: {
          fr: "Refuser la transaction (Risque de renvoi maintenu)",
          en: "Dismiss transaction (Keep termination risk)",
        },
        apply: (stats) => {
          stats.mentalHealth = Math.max(0, stats.mentalHealth - 10);
        },
      },
    ],
  },

  // Événement 3 : Déclenché si la stabilité mentale est critique
  {
    id: "mental_strain_crisis",
    trigger: {
      minDay: 2,
      minSecondsElapsed: 20,
      check: (stats) => stats.mentalHealth <= 40,
    },
    title: {
      fr: "Crise de Décompensation Psychologique",
      en: "Psychological Breakdown Alert",
    },
    type: "bonus",
    description: {
      fr: "La saturation de contenus haineux et toxiques provoque des céphalées aiguës. Le distributeur médical du dortoir propose un sédatif.",
      en: "Severe exposure to toxic posts causes acute sensory overload. The dormitory medical dispenser offers a neural sedative.",
    },
    choices: [
      {
        label: {
          fr: "Acheter un stimulant neural (-12.0 €, +35% Santé)",
          en: "Buy neural stimulant (-€12.00, +35% Health)",
        },
        apply: (stats) => {
          stats.funds = Math.max(0, stats.funds - 12.0);
          stats.mentalHealth = Math.min(100, stats.mentalHealth + 35);
        },
      },
      {
        label: {
          fr: "Endurer la douleur pour préserver vos crédits",
          en: "Endure strain to preserve funds",
        },
        apply: () => {},
      },
    ],
  },

  // Événement 4 : Cyberattaque DDoS au Jour 3 (au milieu du shift)
  {
    id: "ddos_surge_day3",
    trigger: {
      minDay: 3,
      minSecondsElapsed: 30,
      check: (_, ticketIndex) => ticketIndex >= 1,
    },
    title: {
      fr: "Offensive Coordonnée DDoS",
      en: "Coordinated DDoS Attack",
    },
    type: "ddos",
    description: {
      fr: "Des hacktivistes saturent la passerelle OmniFeed. Vos terminaux ralentissent et la latence boursière menace vos primes de rapidité.",
      en: "Hacktivists are flooding OmniFeed gateway. Terminals are throttling and latency threatens speed bonuses.",
    },
    choices: [
      {
        label: {
          fr: "Dérouter les flux sur le cache local (-15.0 €)",
          en: "Reroute traffic to local cache (-€15.00)",
        },
        apply: (stats) => {
          stats.funds = Math.max(0, stats.funds - 15.0);
        },
      },
      {
        label: {
          fr: "Laisser saturer les serveurs (-15% Stabilité)",
          en: "Endure server lag (-15% Stability)",
        },
        apply: (stats) => {
          stats.mentalHealth = Math.max(0, stats.mentalHealth - 15);
        },
      },
    ],
  },
];

export function buildEventInstance(
  def: TriggeredEventDefinition,
  stats: PlayerStats,
  onResolved: () => void,
): GameEvent {
  const lang = currentLang.value;
  return {
    id: def.id,
    title: def.title[lang],
    type: def.type,
    description: def.description[lang],
    choices: def.choices.map((c) => ({
      label: c.label[lang],
      action: () => {
        c.apply(stats);
        onResolved();
      },
    })),
  };
}
