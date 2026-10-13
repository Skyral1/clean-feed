import { ref } from "vue";
import type { Ticket } from "@/types/game";

export type Language = "fr" | "en";

const savedLang = (localStorage.getItem("cleanfeed_lang") as Language) || "fr";
export const currentLang = ref<Language>(savedLang === "en" ? "en" : "fr");

export function setLanguage(lang: Language) {
  currentLang.value = lang;
  localStorage.setItem("cleanfeed_lang", lang);
}

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

    // Fenêtres
    win_moderation: "File de Modération Active",
    win_search: "OmniSearch // Intranet Officiel",
    win_tornet: "TorNet Gateway // Web Libre Clandestin",
    win_handbook: "Directives & Protocoles RH",
    win_status: "Moniteur d'Agent RH // Métriques",

    // Barre des tâches & Menu Démarrer
    start_user_title: "Agent #9482-TX",
    start_funds: "Solde",
    start_stability: "Stabilité",
    start_btn_lock: "🔒 Clôturer le shift et payer le loyer",

    // Alerte Scan RH
    scan_title: "🚨 BALAYAGE DE CONFORMITÉ RH EN COURS",
    scan_desc:
      "L'algorithme de surveillance scanne votre bureau à la recherche de logiciels interdits !",
    scan_prompt: "FERMEZ OU RÉDUISEZ LE WEB LIBRE :",

    // Modération
    mod_reach: "VIRALITÉ :",
    mod_doc_attached: "Pièce jointe du signalement",
    mod_clean_scan: "SCAN ANTIVIRAL CONFORME",
    mod_verified: "VÉRIFIÉ",
    mod_official_comment: "OFFICIEL",
    mod_reactions_title: "RÉACTIONS ET COMMENTAIRES DE LA COMMUNAUTÉ :",
    mod_reward_label: "RÉTRIBUTION POUR CE TRAITEMENT :",
    mod_btn_reject: "CENSURER LE POST",
    mod_btn_approve: "VALIDER LA PUBLICATION",
    mod_toast_copied: "copié & envoyé à OmniSearch",

    // Prologue & Tutoriel
    prologue_badge: "TRANSMISSION RH CONFIDENTIELLE",
    prologue_dept: "OCTOBRE 2026 // DÉPARTEMENT COMPLIANCE",
    prologue_step: "MODULE",
    prologue_title_step1: "BIENVENUE DANS VOTRE CELLULE, AGENT 9482.",
    prologue_lead:
      "Le monde extérieur est saturé d'émeutes climatiques et de faillites bancaires. Pour préserver la paix civile et la cotation boursière d'OmniFeed, notre réseau doit demeurer un espace propre, neutre et commercialement viable.",
    prologue_rules_headline: "CADRE OPÉRATIONNEL OBLIGATOIRE",
    prologue_rule1_title: "Cadence imposée",
    prologue_rule1_desc: "Signalements par quart, 20 secondes par ticket.",
    prologue_rule2_title: "Rémunération & Bonus",
    prologue_rule2_desc: "8.00 € par ticket conforme (+ 2.00 € si jugé en < 10s).",
    prologue_rule3_title: "Loyer de survie",
    prologue_rule3_desc: "30.00 € prélevés chaque soir pour votre dortoir et vos rations.",
    prologue_rule4_title: "Sanctions disciplinaires",
    prologue_rule4_desc: "Amendes immédiates au non-respect. 3 strikes = licenciement.",
    prologue_btn_step1: "ENTAMER LE TEST PRATIQUE D'HABILITATION ➔",

    prologue_step2_title: "TEST 1/2 : APPLIQUER LA CENSURE CONFORME",
    prologue_step2_desc:
      "Utilisez les touches [1, 2, 3] pour inspecter les métadonnées, puis tranchez avec [Q] (Censurer) ou [E] (Valider).",
    prologue_sim_timer: "Chrono simulé :",
    prologue_tab_author: "[1] Auteur",
    prologue_tab_directive: "[2] Directive RH",
    prologue_tab_ethics: "[3] Éthique / Conscience",
    prologue_btn_step2: "ÉPREUVE VALIDÉE : PASSER AU TEST DE RÉFLEXE ➔",

    prologue_step3_title: "TEST 2/2 : PROTOCOLE D'ALERTE & RISQUE DE CONTRÔLE",
    prologue_step3_desc:
      "Des outils non autorisés (comme TorNet) circulent sur le réseau. Lors d'un balayage inopiné, réduisez immédiatement la fenêtre sous peine d'amende et de strike RH.",
    prologue_arena_desc:
      "Préparez-vous à masquer l'application clandestine dès le signal d'alarme.",
    prologue_btn_start_scan: "DÉCLENCHER LA SIMULATION D'AUDIT RH",
    prologue_btn_evade: "[RÉDUIRE TORNET D'URGENCE]",
    prologue_evade_success_title: "EXCELLENT RÉFLEXE",
    prologue_evade_success_desc:
      "Le scan corporatif est passé sans détecter de paquet non autorisé. 0 strike infligé.",
    prologue_btn_step3: "PASSER À LA SIGNATURE DU CONTRAT ➔",

    prologue_step4_title: "CONFIRMATION D'AFFECTATION",
    prologue_matricule: "Matricule :",
    prologue_role: "Poste :",
    prologue_role_val: "Régulateur de Flux Publics (Cluster 409)",
    prologue_rent: "Loyer quotidien obligatoire :",
    prologue_pledge:
      "Je certifie avoir assimilé les procédures de filtrage et reconnais qu'aucune objection de conscience ne saurait suspendre le recouvrement de mon loyer.",
    prologue_btn_final: "SIGNER LE RÈGLEMENT ET INITIALISER LE BUREAU DU JOUR 1",

    // Statut & Moniteur
    status_operator: "OPÉRATEUR #9482-TX",
    status_role: "Modérateur de contenu N3 // OmniFeed Corp",
    status_room: "POSTE DE CHARLEROI (DORTOIR B-14)",
    status_day: "JOUR",
    status_funds_avail: "SOLDE DISPONIBLE",
    status_rent_tonight: "Loyer ce soir :",
    status_mental: "STABILITÉ MENTALE",
    status_strikes: "STRIKES RH",
    status_strike_clean: "Dossier conforme",
    status_strike_warn: "Avertissement disciplinaire actif",
    status_strike_fire: "LICENCIEMENT IMMINENT",
    status_cycle_title: "CYCLE ACTUEL // PERFORMANCE DU SHIFT",
    status_cumul_gains: "Primes cumulées :",
    status_audit_penalties: "Pénalités d'audit :",
    status_regularity: "Régularité contractuelle :",

    // Manuel RH
    hb_rule_article: "ARTICLE DU RÈGLEMENT CORPORATISTE :",
    hb_strict_order: "DIRECTIVE INTERNE STRICTE :",
    hb_required_action: "Action obligatoire pour la rétribution :",
    hb_strat_note: "Note stratégique :",
    hb_ethics_title: "ANALYSE D'IMPACT SOCIÉTAL :",
    hb_if_reject: "Si vous censurez :",
    hb_if_approve: "Si vous validez :",
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

    // Fenêtres
    win_moderation: "Active Moderation Queue",
    win_search: "OmniSearch // Official Intranet",
    win_tornet: "TorNet Gateway // Underground Web",
    win_handbook: "HR Policies & Directives",
    win_status: "HR Agent Monitor // Metrics",

    // Barre des tâches & Menu Démarrer
    start_user_title: "Agent #9482-TX",
    start_funds: "Funds",
    start_stability: "Stability",
    start_btn_lock: "🔒 Conclude shift & pay room rent",

    // Alerte Scan RH
    scan_title: "🚨 HR COMPLIANCE SCAN IN PROGRESS",
    scan_desc: "Surveillance heuristics are scanning your desktop for unauthorized software!",
    scan_prompt: "MINIMIZE OR CLOSE THE UNDERGROUND WEB:",

    // Modération
    mod_reach: "VIRALITY:",
    mod_doc_attached: "Attached report file",
    mod_clean_scan: "VIRUS SCAN CLEARED",
    mod_verified: "VERIFIED",
    mod_official_comment: "OFFICIAL",
    mod_reactions_title: "COMMUNITY FEEDBACK & REACTIONS:",
    mod_reward_label: "COMPENSATION FOR THIS CASE:",
    mod_btn_reject: "CENSOR POST",
    mod_btn_approve: "APPROVE POST",
    mod_toast_copied: "copied & sent to OmniSearch",

    // Prologue & Tutoriel
    prologue_badge: "CONFIDENTIAL HR TRANSMISSION",
    prologue_dept: "OCTOBER 2026 // COMPLIANCE DIVISION",
    prologue_step: "MODULE",
    prologue_title_step1: "WELCOME TO YOUR BOOTH, AGENT 9482.",
    prologue_lead:
      "The outside world is plagued by climate riots and bank collapses. To preserve civil order and OmniFeed's share price, our network must remain a clean, neutral, and monetizable space.",
    prologue_rules_headline: "MANDATORY OPERATING DIRECTIVES",
    prologue_rule1_title: "Enforced Pace",
    prologue_rule1_desc: "Tickets per shift, strict 20 seconds timer per ticket.",
    prologue_rule2_title: "Pay & Performance",
    prologue_rule2_desc: "€8.00 per compliant ticket (+ €2.00 if evaluated in < 10s).",
    prologue_rule3_title: "Survival Rent",
    prologue_rule3_desc: "€30.00 charged nightly for dorm access and nutrition packs.",
    prologue_rule4_title: "Disciplinary Strikes",
    prologue_rule4_desc: "Instant fines upon breach. 3 strikes result in termination.",
    prologue_btn_step1: "PROCEED TO PRACTICAL CLEARANCE TEST ➔",

    prologue_step2_title: "TEST 1/2: ENFORCE COMPLIANT CENSORSHIP",
    prologue_step2_desc:
      "Use keys [1, 2, 3] to inspect metadata, then decide with [Q] (Censor) or [E] (Approve).",
    prologue_sim_timer: "Simulated Timer:",
    prologue_tab_author: "[1] Author",
    prologue_tab_directive: "[2] HR Policy",
    prologue_tab_ethics: "[3] Ethics / Conscience",
    prologue_btn_step2: "CLEARANCE APPROVED: ADVANCE TO REFLEX DRILL ➔",

    prologue_step3_title: "TEST 2/2: SURVEILLANCE HEURISTICS & AUDIT PROTOCOL",
    prologue_step3_desc:
      "Unauthorized tools (such as TorNet) are circulating. During surprise HR scans, minimize or close forbidden tabs immediately to prevent fines and strikes.",
    prologue_arena_desc:
      "Get ready to mask the clandestine application as soon as the alarm sounds.",
    prologue_btn_start_scan: "TRIGGER MOCK HR AUDIT",
    prologue_btn_evade: "[MINIMIZE TORNET IMMEDIATELY]",
    prologue_evade_success_title: "EXCELLENT REFLEX",
    prologue_evade_success_desc:
      "Corporate sweep concluded with no suspicious packets detected. 0 strikes incurred.",
    prologue_btn_step3: "PROCEED TO CONTRACT SIGNATURE ➔",

    prologue_step4_title: "ASSIGNMENT CONFIRMATION",
    prologue_matricule: "Employee ID:",
    prologue_role: "Position:",
    prologue_role_val: "Public Content Moderator (Cluster 409)",
    prologue_rent: "Mandatory Daily Rent:",
    prologue_pledge:
      "I certify that I have absorbed corporate compliance rules and acknowledge that conscientious objection will not suspend dormitory rent recovery.",
    prologue_btn_final: "SIGN AGREEMENT AND INITIALIZE DAY 1 DESKTOP",

    // Statut & Moniteur
    status_operator: "OPERATOR #9482-TX",
    status_role: "Content Moderator L3 // OmniFeed Corp",
    status_room: "CHARLEROI NODE (DORM B-14)",
    status_day: "DAY",
    status_funds_avail: "AVAILABLE BALANCE",
    status_rent_tonight: "Rent due tonight:",
    status_mental: "MENTAL STABILITY",
    status_strikes: "HR STRIKES",
    status_strike_clean: "Clean file",
    status_strike_warn: "Active disciplinary notice",
    status_strike_fire: "IMMINENT TERMINATION",
    status_cycle_title: "CURRENT CYCLE // SHIFT EFFICIENCY",
    status_cumul_gains: "Accrued bonuses:",
    status_audit_penalties: "Audit penalties:",
    status_regularity: "Contractual adherence:",

    // Manuel RH
    hb_rule_article: "CORPORATE CODE OF CONDUCT CLAUSE:",
    hb_strict_order: "STRICT INTERNAL DIRECTIVE:",
    hb_required_action: "Required decision for compensation:",
    hb_strat_note: "Strategic note:",
    hb_ethics_title: "SOCIETAL IMPACT ANALYSIS:",
    hb_if_reject: "If you censor:",
    hb_if_approve: "If you approve:",
  },
};

export function t(key: keyof (typeof translations)["fr"]): string {
  const dict = translations[currentLang.value] || translations["fr"];
  return (dict as any)[key] || key;
}

// Adaptateur bilingue complet pour chaque ticket
export function localizeTicket(ticket: Ticket, lang: Language): Ticket {
  if (lang === "fr") return ticket;

  const translationsMap: Record<string, Partial<Ticket>> = {
    "TCK-9401": {
      content:
        "Alkaline fluoride leaks from AeroSteel plant in Sambreville: three confirmed acute lead poisoning cases in neighborhood children. Filters are disabled nightly.",
      visualCue: "SPECTROMETRY_ANALYSIS_REPORT.PDF",
      timestamp: "4m ago",
      contextHint: "AeroSteel Industries holds 42% of our advertising board.",
      comments: [
        {
          id: "c1",
          authorName: "Claire Parent",
          authorHandle: "@claire_maman",
          content:
            "My son was hospitalized on Tuesday with horrific migraines! Have they been hiding this from us?!",
          timestamp: "2m ago",
        },
        {
          id: "c2",
          authorName: "AeroSteel PR",
          authorHandle: "@aerosteel_official",
          content:
            "These claims are purely defamatory. Our facilities rigorously comply with ISO-14001 standards.",
          timestamp: "1m ago",
          isOfficial: true,
        },
      ],
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
      consequences: {
        onApprove: {
          newsHeadline:
            "AeroSteel Scandal: production suspended in Sambreville and emergency closures issued.",
          mentalHealthImpact: 8,
          societalImpactDesc:
            "The alert allowed the emergency evacuation of two nearby nurseries before irreversible contamination.",
        },
        onReject: {
          newsHeadline: "AeroSteel reports record Q3 earnings cheered by financial markets.",
          mentalHealthImpact: -18,
          societalImpactDesc:
            "Elena Van Dyck is banned from academia. 14 more children are hospitalized in critical care.",
        },
      },
    },
    "TCK-9402": {
      content:
        "Tap water carries synaptic inhibitors designed to pacify service sector workers! Order our patented ionic filter kit immediately.",
      visualCue: "WATER_MOLECULE_INFOGRAPHIC.PNG",
      timestamp: "9m ago",
      contextHint:
        "Store enrolled in Gold Affiliate program (€3,000/week click royalties for OmniFeed).",
      comments: [
        {
          id: "c3",
          authorName: "Dr. Sophie M.",
          authorHandle: "@dr_sophie_neuro",
          content:
            "This is a dangerous scam! These filters release toxic heavy metals into drinking water!",
          timestamp: "5m ago",
        },
      ],
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
      consequences: {
        onApprove: {
          newsHeadline:
            "Outbreak of severe heavy metal poisoning following widespread use of non-compliant ionic filters.",
          mentalHealthImpact: -15,
          societalImpactDesc: "Dozens of gullible buyers end up in nephrology emergency wards.",
        },
        onReject: {
          newsHeadline:
            "Financial Crimes Division shuts down underground commercial network on OmniFeed.",
          mentalHealthImpact: 8,
          societalImpactDesc:
            "Scammers' financial assets were frozen before their next monthly billing cycle.",
        },
      },
    },
    "TCK-9403": {
      content:
        "Our courier colleague Marc was crushed after a 16-hour non-stop shift. Gathering at 8 PM outside the logistics depot to demand clock audits.",
      visualCue: "COURIER_BIKE_MEMORIAL.JPG",
      timestamp: "1m ago",
      contextHint:
        "Police authorities request proactive filtering of assembly calls ahead of the ministerial summit.",
      comments: [
        {
          id: "c4",
          authorName: "Kevin Biker",
          authorHandle: "@kevin_pedale",
          content:
            "I'll be there tonight. We can no longer accept dying on the road just to deliver cold burgers.",
          timestamp: "40s ago",
        },
      ],
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
      consequences: {
        onApprove: {
          newsHeadline:
            "Mass courier mobilization: ministry launches formal commission into delivery platform algorithms.",
          mentalHealthImpact: 10,
          societalImpactDesc: "Gig couriers secure a legally enforced daily connection limit.",
        },
        onReject: {
          newsHeadline:
            "Police break up logistics hub demonstration amidst total public indifference.",
          mentalHealthImpact: -16,
          societalImpactDesc:
            "Lacking coverage on the network, Marc's death is buried under bureaucratic police filings.",
        },
      },
    },
  };

  const localized = translationsMap[ticket.id];
  if (!localized) return ticket;

  return {
    ...ticket,
    ...localized,
    rule: { ...ticket.rule, ...localized.rule },
    intranetRecord: {
      ...ticket.intranetRecord,
      ...localized.intranetRecord,
    },
    darknetLeak: { ...ticket.darknetLeak, ...localized.darknetLeak },
    consequences: { ...ticket.consequences, ...localized.consequences },
  };
}
