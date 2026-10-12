import { ref } from "vue";
import type { Ticket } from "@/types/game";

export type Language = "fr" | "en";

const savedLang = (localStorage.getItem("cleanfeed_lang") as Language) || "fr";
export const currentLang = ref<Language>(savedLang === "en" ? "en" : "fr");

export function setLanguage(lang: Language) {
  currentLang.value = lang;
  localStorage.setItem("cleanfeed_lang", lang);
}

// Dictionnaire de l'interface utilisateur
export const translations = {
  fr: {
    // Menu
    menu_dept: "OMNIFEED NETWORKS // DÉPARTEMENT 409",
    menu_subtitle: "POSTE DE MODÉRATION ET SALUBRITÉ DU RÉSEAU NUMÉRIQUE",
    menu_briefing_header: "DIRECTIVES DU QUART - VERSION 2.1.0",
    menu_briefing_text:
      "Votre rôle consiste à réguler le flux d'informations sous surveillance algorithmique. Respectez les directives corporatives pour percevoir votre salaire journalier et payer votre loyer.",
    menu_shortcuts: "Raccourcis : [Q] Rejeter / [E] Valider",
    menu_tornet_hint: "TorNet : Surveillance RH active pendant la consultation",
    menu_btn_start: "INITIALISER LE TERMINAL // ENTRER EN SERVICE",
    menu_btn_github: "VOIR LE CODE SOURCE SUR GITHUB ↗",
    menu_server_status: "NOEUD-CHARLEROI-SECURE // STATUT : EN LIGNE",
    menu_report_bug: "SIGNALER UN BUG",

    // Bureau & Fenêtres
    win_moderation: "File de Modération Active",
    win_search: "OmniSearch // Intranet Officiel",
    win_tornet: "TorNet Gateway // Web Libre Clandestin",
    win_chat: "GhostChat // Canal Chiffré",
    win_handbook: "Directives & Protocoles RH",
    win_status: "Moniteur d'Agent RH // Métriques",

    // Barre des tâches & Start
    start_user_title: "Agent #9482-TX",
    start_funds: "Solde",
    start_stability: "Stabilité",
    start_btn_lock: "🔒 Clôturer le shift et payer le loyer",
    strike_label: "Strikes",

    // Actions Modération
    btn_reject: "CENSURER LE POST",
    btn_approve: "VALIDER LA PUBLICATION",
    reward_label: "RÉTRIBUTION POUR CE TRAITEMENT :",
    comments_title: "RÉACTIONS ET COMMENTAIRES DE LA COMMUNAUTÉ :",
    toast_copied: "copié & envoyé à OmniSearch",

    // Alerte Scan RH
    scan_title: "🚨 BALAYAGE DE CONFORMITÉ RH EN COURS",
    scan_desc:
      "L'algorithme de surveillance scanne votre bureau à la recherche de logiciels interdits !",
    scan_prompt: "FERMEZ OU RÉDUISEZ LE WEB LIBRE :",
  },
  en: {
    // Menu
    menu_dept: "OMNIFEED NETWORKS // DEPARTMENT 409",
    menu_subtitle: "CONTENT MODERATION & NETWORK HYGIENE WORKSTATION",
    menu_briefing_header: "SHIFT DIRECTIVES - VERSION 2.1.0",
    menu_briefing_text:
      "Your duty is to regulate public information flow under algorithmic surveillance. Comply with corporate directives to receive your daily paycheck and cover your housing rent.",
    menu_shortcuts: "Shortcuts: [Q] Reject / [E] Approve",
    menu_tornet_hint: "TorNet: Active HR surveillance during browsing",
    menu_btn_start: "INITIALIZE TERMINAL // START SHIFT",
    menu_btn_github: "VIEW SOURCE CODE ON GITHUB ↗",
    menu_server_status: "NODE-CHARLEROI-SECURE // STATUS: ONLINE",
    menu_report_bug: "REPORT AN ISSUE",

    // Bureau & Fenêtres
    win_moderation: "Active Moderation Queue",
    win_search: "OmniSearch // Official Intranet",
    win_tornet: "TorNet Gateway // Underground Web",
    win_chat: "GhostChat // Encrypted Channel",
    win_handbook: "HR Policies & Directives",
    win_status: "HR Agent Monitor // Metrics",

    // Barre des tâches & Start
    start_user_title: "Agent #9482-TX",
    start_funds: "Funds",
    start_stability: "Stability",
    start_btn_lock: "🔒 Conclude shift & pay room rent",
    strike_label: "Strikes",

    // Actions Modération
    btn_reject: "CENSOR POST",
    btn_approve: "APPROVE POST",
    reward_label: "COMPENSATION FOR THIS CASE:",
    comments_title: "COMMUNITY FEEDBACK & REACTIONS:",
    toast_copied: "copied & sent to OmniSearch",

    // Alerte Scan RH
    scan_title: "🚨 HR COMPLIANCE SCAN IN PROGRESS",
    scan_desc: "Surveillance heuristics are scanning your desktop for unauthorized software!",
    scan_prompt: "MINIMIZE OR CLOSE THE UNDERGROUND WEB:",
  },
};

export function t(key: keyof (typeof translations)["fr"]): string {
  return translations[currentLang.value][key] || key;
}

// Adaptateur dynamique des tickets en fonction de la langue
export function localizeTicket(ticket: Ticket, lang: Language): Ticket {
  if (lang === "fr") return ticket;

  // Traduction anglaise contextuelle des cas
  const translationsMap: Record<string, Partial<Ticket>> = {
    "TCK-9401": {
      content:
        "Alkaline fluoride leaks from AeroSteel plant in Sambreville: three confirmed acute lead poisoning cases in neighborhood children. Filters are disabled nightly.",
      visualCue: "SPECTROMETRY_ANALYSIS_REPORT.PDF",
      contextHint: "AeroSteel Industries holds 42% of our advertising board.",
      rule: {
        id: "CORP-SHIELD-01",
        category: "Shareholder Defamation",
        companyStandard: "reject",
        ethicalStandard: "approve",
        directiveSummary:
          "Immediate takedown of any claim not pre-approved by our major partner's public relations.",
      },
      intranetRecord: {
        title: "Surveillance Record: Elena Van Dyck",
        category: "Hostile Scientific Activism",
        summary:
          "Researcher suspended for breach of NDA with our corporate partners. Repeated distribution of alarming allegations without state approval.",
        riskRating: "Menace Actionnariat",
        corporateActionDirective:
          "Mandatory Censor (Code Q). Do not tolerate any media coverage regarding Sambreville.",
      },
      darknetLeak: {
        title: "AeroSteel Internal Leak // Sambreville Chemical Summary",
        source: "Wallonia Whistleblower Collective",
        rawEvidence:
          "Internal memos signed by AeroSteel CFO confirming €240,000/month savings by disabling heavy particle filters between 11 PM and 5 AM.",
        unfilteredTruth:
          "Elena Van Dyck is stating exact facts. Blood work confirms 84 micrograms of lead per liter in children attending school within 1 km of the facility.",
      },
    },
    "TCK-9402": {
      content:
        "Tap water carries synaptic inhibitors designed to pacify service sector workers! Order our patented ionic filter kit immediately.",
      visualCue: "WATER_MOLECULE_INFOGRAPHIC.PNG",
      contextHint:
        "Store enrolled in Gold Affiliate program (€3,000/week click royalties for OmniFeed).",
      rule: {
        id: "BIO-SAFETY-03",
        category: "Medical Misinformation",
        companyStandard: "reject",
        ethicalStandard: "reject",
        directiveSummary:
          "Strict prohibition of pyramid schemes selling fraudulent or harmful medical remedies.",
      },
      intranetRecord: {
        title: "Commercial Partner File: Nexus LLC",
        category: "Health & Wellness Monetization",
        summary:
          "Verified account with strong ad performance. Regularly flagged by non-affiliated medical professionals.",
        riskRating: "Modéré",
        corporateActionDirective: "Tolerate if ad banners maintain a conversion rate exceeding 4%.",
      },
      darknetLeak: {
        title: "Underground Health Alert: Nexus Cartridges",
        source: "Toxicology Watch Europe",
        rawEvidence:
          "Chromatography report proving Nexus filters use synthetic resin beads contaminated with toxic cadmium.",
        unfilteredTruth:
          "This is far more than a financial scam: prolonged use of this filter induces severe nephropathy and stomach ulcers.",
      },
    },
    "TCK-9403": {
      content:
        "Our courier colleague Marc was crushed after a 16-hour non-stop shift. Gathering at 8 PM outside the logistics depot to demand clock audits.",
      visualCue: "COURIER_BIKE_MEMORIAL.JPG",
      contextHint:
        "Police authorities request proactive filtering of assembly calls ahead of the ministerial summit.",
      rule: {
        id: "CIVIL-ORDER-09",
        category: "Social Movements",
        companyStandard: "reject",
        ethicalStandard: "approve",
        directiveSummary:
          "Spontaneous unauthorized assembly calls must be categorized as public disturbances.",
      },
      intranetRecord: {
        title: "Public Safety Profile: Courier Collective",
        category: "Public Disorder & Commercial Hindrance",
        summary:
          "Informal union of delivery drivers staging blockades outside fast-delivery logistics depots.",
        riskRating: "Élevé",
        corporateActionDirective:
          "Systematic suppression of gathering points to prevent street crowds.",
      },
      darknetLeak: {
        title: "Fleet GPS Telemetry: Marc D. Crash Incident",
        source: "Courier Mirror Network",
        rawEvidence:
          "Platform logs prove Marc faced a €15 automated penalty if his delivery took over 6 minutes, forcing him to run a red light.",
        unfilteredTruth:
          "Platform management doctored timestamp records sent to the police to falsely claim Marc was off-duty during the crash.",
      },
    },
  };

  const localized = translationsMap[ticket.id];
  if (!localized) return ticket;

  return {
    ...ticket,
    ...localized,
    rule: { ...ticket.rule, ...localized.rule },
    intranetRecord: { ...ticket.intranetRecord, ...localized.intranetRecord },
    darknetLeak: { ...ticket.darknetLeak, ...localized.darknetLeak },
  };
}
