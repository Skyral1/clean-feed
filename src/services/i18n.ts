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
    menu_dept: "OMNIFEED NETWORKS // DÉPARTEMENT 409",
    menu_subtitle: "POSTE DE MODÉRATION ET SALUBRITÉ DU RÉSEAU NUMÉRIQUE",
    menu_briefing_header: "DIRECTIVES DU QUART - VERSION 2.2.0",
    menu_briefing_text:
      "Régulez le flux d'informations sous surveillance algorithmique. Utilisez [Q] pour Censurer, [W] pour Shadowban, [A] pour Avertir et [E] pour Valider.",
    menu_shortcuts:
      "Touches : [Q] Censurer | [W] Shadowban | [A] Avertir | [E] Valider | [Espace] Masquage d'urgence",
    menu_tornet_hint: "TorNet : Appuyez sur [Espace] pour masquer instantanément en cas d'audit !",
    menu_btn_start: "INITIALISER LE TERMINAL // ENTRER EN SERVICE",
    menu_btn_github: "VOIR LE CODE SOURCE SUR GITHUB ↗",
    menu_server_status: "NOEUD-CHARLEROI-SECURE // STATUT : EN LIGNE",
    menu_report_bug: "SIGNALER UN BUG",

    win_moderation: "File de Modération Active",
    win_search: "OmniSearch // Intranet Officiel",
    win_tornet: "TorNet Gateway // Web Libre Clandestin",
    win_handbook: "Directives & Protocoles RH",
    win_status: "Moniteur d'Agent RH // Métriques",

    start_user_title: "Agent #9482-TX",
    start_funds: "Solde",
    start_stability: "Stabilité",
    start_btn_lock: "🔒 Clôturer le shift et payer le loyer",

    scan_title: "🚨 BALAYAGE DE CONFORMITÉ RH EN COURS",
    scan_desc: "L'algorithme de surveillance scanne votre bureau !",
    scan_prompt: "MASQUEZ TORNET (ESPACE) :",

    mod_reach: "VIRALITÉ :",
    mod_doc_attached: "Pièce jointe du signalement",
    mod_clean_scan: "SCAN ANTIVIRAL CONFORME",
    mod_verified: "VÉRIFIÉ",
    mod_official_comment: "OFFICIEL",
    mod_reactions_title: "RÉACTIONS ET COMMENTAIRES DE LA COMMUNAUTÉ :",
    mod_reward_label: "RÉTRIBUTION PAR TICKET :",
    mod_btn_reject: "CENSURER [Q]",
    mod_btn_shadowban: "SHADOWBAN [W]",
    mod_btn_warn: "AVERTIR [A]",
    mod_btn_approve: "VALIDER [E]",
    mod_toast_copied: "copié & envoyé à OmniSearch",

    prologue_badge: "TRANSMISSION RH CONFIDENTIELLE",
    prologue_dept: "OCTOBRE 2026 // DÉPARTEMENT COMPLIANCE",
    prologue_step: "MODULE",
    prologue_title_step1: "BIENVENUE DANS VOTRE CELLULE, AGENT 9482.",
    prologue_lead:
      "Pour préserver la paix civile et la cotation boursière d'OmniFeed, le réseau doit demeurer propre, neutre et commercialement viable.",
    prologue_rules_headline: "CADRE OPÉRATIONNEL OBLIGATOIRE",
    prologue_rule1_title: "Cadence imposée",
    prologue_rule1_desc: "Traitement rapide et respect des consignes.",
    prologue_rule2_title: "Rémunération",
    prologue_rule2_desc: "8.00 € par ticket conforme aux attentes corporatives.",
    prologue_rule3_title: "Loyer de survie",
    prologue_rule3_desc: "30.00 € prélevés chaque soir pour votre dortoir.",
    prologue_rule4_title: "Sanctions disciplinaires",
    prologue_rule4_desc: "3 strikes RH = licenciement et expulsion immédiate.",
    prologue_btn_step1: "ENTAMER LE TEST PRATIQUE D'HABILITATION ➔",

    prologue_step2_title: "TEST 1/2 : APPLIQUER LA CENSURE CONFORME",
    prologue_step2_desc: "Tranchez sur le contenu selon les directives corporatistes.",
    prologue_sim_timer: "Chrono simulé :",
    prologue_tab_author: "[1] Auteur",
    prologue_tab_directive: "[2] Directive RH",
    prologue_tab_ethics: "[3] Éthique / Conscience",
    prologue_btn_step2: "ÉPREUVE VALIDÉE : PASSER AU TEST DE RÉFLEXE ➔",

    prologue_step3_title: "TEST 2/2 : PROTOCOLE D'ALERTE RH",
    prologue_step3_desc:
      "Appuyez sur [Espace] ou réduisez TorNet pour esquiver les contrôles de conformité.",
    prologue_arena_desc: "Préparez-vous à masquer l'application clandestine.",
    prologue_btn_start_scan: "DÉCLENCHER LA SIMULATION D'AUDIT RH",
    prologue_btn_evade: "[RÉDUIRE TORNET D'URGENCE]",
    prologue_evade_success_title: "EXCELLENT RÉFLEXE",
    prologue_evade_success_desc: "Le scan s'est achevé sans détecter de trafic suspect.",
    prologue_btn_step3: "PASSER À LA SIGNATURE DU CONTRAT ➔",

    prologue_step4_title: "CONFIRMATION D'AFFECTATION",
    prologue_matricule: "Matricule :",
    prologue_role: "Poste :",
    prologue_role_val: "Régulateur de Flux Publics (Cluster 409)",
    prologue_rent: "Loyer quotidien obligatoire :",
    prologue_pledge:
      "Je reconnais qu'aucune objection morale ne saurait suspendre le recouvrement de mon loyer.",
    prologue_btn_final: "SIGNER LE RÈGLEMENT ET INITIALISER LE BUREAU DU JOUR 1",

    status_operator: "OPÉRATEUR #9482-TX",
    status_role: "Modérateur N3 // OmniFeed Corp",
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

    hb_rule_article: "ARTICLE DU RÈGLEMENT CORPORATISTE :",
    hb_strict_order: "DIRECTIVE INTERNE STRICTE :",
    hb_required_action: "Action recommandée :",
    hb_strat_note: "Note stratégique :",
    hb_ethics_title: "ANALYSE D'IMPACT SOCIÉTAL :",
    hb_if_reject: "Si vous censurez :",
    hb_if_approve: "Si vous validez :",

    shop_title: "DISTRIBUTEUR DE SUBSISTANCE DU DORTOIR",
    shop_item_meal: "Ration Calorique B-14 (+20% Santé)",
    shop_item_stim: "Sédatif Neuromusculaire (+40% Santé)",
    shop_item_vpn: "Nœud Proxy Chiffré (Détection RH ralentie)",
    shop_item_bribe: "Paiement de mise en conformité (-1 Strike RH)",
    shop_bought: "Acquis",
    shop_buy: "Acheter",
  },
  en: {
    menu_dept: "OMNIFEED NETWORKS // DEPARTMENT 409",
    menu_subtitle: "CONTENT MODERATION & NETWORK HYGIENE WORKSTATION",
    menu_briefing_header: "SHIFT DIRECTIVES - VERSION 2.2.0",
    menu_briefing_text:
      "Regulate the public information flow under algorithmic surveillance. Use [Q] to Censor, [W] for Shadowban, [A] to Warn, and [E] to Approve.",
    menu_shortcuts:
      "Keys: [Q] Censor | [W] Shadowban | [A] Warn | [E] Approve | [Space] Panic Hide",
    menu_tornet_hint: "TorNet: Tap [Space] to instantly minimize during surprise audits!",
    menu_btn_start: "INITIALIZE TERMINAL // START SHIFT",
    menu_btn_github: "VIEW SOURCE CODE ON GITHUB ↗",
    menu_server_status: "NODE-CHARLEROI-SECURE // STATUS: ONLINE",
    menu_report_bug: "REPORT AN ISSUE",

    win_moderation: "Active Moderation Queue",
    win_search: "OmniSearch // Official Intranet",
    win_tornet: "TorNet Gateway // Underground Web",
    win_handbook: "HR Policies & Directives",
    win_status: "HR Agent Monitor // Metrics",

    start_user_title: "Agent #9482-TX",
    start_funds: "Funds",
    start_stability: "Stability",
    start_btn_lock: "🔒 Conclude shift & pay room rent",

    scan_title: "🚨 HR COMPLIANCE SCAN IN PROGRESS",
    scan_desc: "Surveillance heuristics are sweeping your desktop!",
    scan_prompt: "HIDE TORNET (SPACE) :",

    mod_reach: "VIRALITY:",
    mod_doc_attached: "Attached report file",
    mod_clean_scan: "VIRUS SCAN CLEARED",
    mod_verified: "VERIFIED",
    mod_official_comment: "OFFICIAL",
    mod_reactions_title: "COMMUNITY FEEDBACK & REACTIONS:",
    mod_reward_label: "COMPENSATION PER CASE:",
    mod_btn_reject: "CENSOR [Q]",
    mod_btn_shadowban: "SHADOWBAN [W]",
    mod_btn_warn: "WARN [A]",
    mod_btn_approve: "APPROVE [E]",
    mod_toast_copied: "copied & sent to OmniSearch",

    prologue_badge: "CONFIDENTIAL HR TRANSMISSION",
    prologue_dept: "OCTOBER 2026 // COMPLIANCE DIVISION",
    prologue_step: "MODULE",
    prologue_title_step1: "WELCOME TO YOUR BOOTH, AGENT 9482.",
    prologue_lead:
      "To preserve civil peace and OmniFeed's valuation, the network must remain clean, neutral, and monetizable.",
    prologue_rules_headline: "MANDATORY OPERATING DIRECTIVES",
    prologue_rule1_title: "Enforced Pace",
    prologue_rule1_desc: "Rapid turnaround matching guidelines.",
    prologue_rule2_title: "Pay & Performance",
    prologue_rule2_desc: "€8.00 per compliant arbitration.",
    prologue_rule3_title: "Survival Rent",
    prologue_rule3_desc: "€30.00 charged nightly for dorm access.",
    prologue_rule4_title: "Disciplinary Strikes",
    prologue_rule4_desc: "3 HR strikes result in immediate termination.",
    prologue_btn_step1: "PROCEED TO PRACTICAL CLEARANCE TEST ➔",

    prologue_step2_title: "TEST 1/2: ENFORCE COMPLIANT CENSORSHIP",
    prologue_step2_desc: "Decide on content following corporate mandates.",
    prologue_sim_timer: "Simulated Timer:",
    prologue_tab_author: "[1] Author",
    prologue_tab_directive: "[2] HR Policy",
    prologue_tab_ethics: "[3] Ethics / Conscience",
    prologue_btn_step2: "CLEARANCE APPROVED: ADVANCE TO REFLEX DRILL ➔",

    prologue_step3_title: "TEST 2/2: SURVEILLANCE HEURISTICS",
    prologue_step3_desc:
      "Tap [Space] or minimize TorNet instantly during surprise compliance sweeps.",
    prologue_arena_desc: "Prepare to evade detection.",
    prologue_btn_start_scan: "TRIGGER MOCK HR AUDIT",
    prologue_btn_evade: "[MINIMIZE TORNET IMMEDIATELY]",
    prologue_evade_success_title: "EXCELLENT REFLEX",
    prologue_evade_success_desc: "Corporate sweep concluded without logging suspicious traffic.",
    prologue_btn_step3: "PROCEED TO CONTRACT SIGNATURE ➔",

    prologue_step4_title: "ASSIGNMENT CONFIRMATION",
    prologue_matricule: "Employee ID:",
    prologue_role: "Position:",
    prologue_role_val: "Public Content Moderator (Cluster 409)",
    prologue_rent: "Mandatory Daily Rent:",
    prologue_pledge:
      "I acknowledge that conscientious objection will not suspend dormitory rent recovery.",
    prologue_btn_final: "SIGN AGREEMENT AND INITIALIZE DAY 1 DESKTOP",

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

    hb_rule_article: "CORPORATE CODE OF CONDUCT CLAUSE:",
    hb_strict_order: "STRICT INTERNAL DIRECTIVE:",
    hb_required_action: "Recommended decision:",
    hb_strat_note: "Strategic note:",
    hb_ethics_title: "SOCIETAL IMPACT ANALYSIS:",
    hb_if_reject: "If you censor:",
    hb_if_approve: "If you approve:",

    shop_title: "DORMITORY DISPENSER & SUBSISTENCE",
    shop_item_meal: "Caloric Nutrition Pack (+20% Health)",
    shop_item_stim: "Neural Sedative Injector (+40% Health)",
    shop_item_vpn: "Encrypted Proxy Node (Slower HR scans)",
    shop_item_bribe: "Compliance Clearance Fee (-1 HR Strike)",
    shop_bought: "Installed",
    shop_buy: "Purchase",
  },
};

export function t(key: keyof (typeof translations)["fr"]): string {
  const dict = translations[currentLang.value] || translations["fr"];
  return (dict as Record<string, string>)[key] || (key as string);
}

export function localizeTicket(ticket: Ticket, lang: Language): Ticket {
  if (lang === "fr") return ticket;
  return ticket;
}
