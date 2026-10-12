<template>
  <div class="terminal-app">
    <!-- ÉCRAN 1 : MENU PRINCIPAL D'ACCUEIL -->
    <div v-if="gameStage === 'menu'" class="center-screen">
      <div class="menu-container">
        <div class="menu-brand">
          <div class="brand-pill">OMNIFEED NETWORKS // INFRASTRUCTURE D'ASSURANCE GLOBALE</div>
          <h1 class="brand-title">CLEAN<span>FEED</span></h1>
          <p class="brand-subtitle">
            POSTE DE TRAITEMENT TÉLÉ-TRAVAILLÉ // DÉPARTEMENT DE MODÉRATION 409
          </p>
        </div>

        <div class="briefing-box">
          <div class="briefing-header">AVERTISSEMENT LÉGAL - CONTRAT ART. 11-B</div>
          <p class="briefing-text">
            Vous vous apprêtez à vous connecter au flux de régulation sociétale de la corporation
            OmniFeed. Toute consultation de contenu non autorisée ou tout laxisme envers les
            lanceurs d'alerte fera l'objet de retenues sur traitement et de poursuites
            disciplinaires.
          </p>
        </div>

        <div class="menu-actions">
          <button @click="startPrologue" class="btn-start">
            INITIALISER LE TERMINAL // CONNEXION AGENT
          </button>
        </div>

        <div class="menu-footer-info">
          <span>LATENCE SERVEUR : 14ms (NOEUD-CHARLEROI)</span>
          <span>VERSION PROTOCOLE : 1.4.2-SEC</span>
        </div>
      </div>
    </div>

    <!-- ÉCRAN 2 : PROLOGUE / ÉPILOGUE D'INTRODUCTION NARRATIF -->
    <div v-else-if="gameStage === 'prologue'" class="center-screen">
      <div class="prologue-container">
        <div class="prologue-header">
          <span class="prologue-badge">TRANSMISSION RH CONFIDENTIELLE</span>
          <span class="prologue-time">OCTOBRE 2026 // DÉPARTEMENT SURVEILLANCE</span>
        </div>

        <div class="prologue-body">
          <h2 class="prologue-title">BIENVENUE DANS VOTRE CELLULE, AGENT 9482.</h2>

          <div class="prologue-paragraphs">
            <p>
              Le monde extérieur est saturé d'émeutes climatiques, de grèves sauvages et de
              faillites bancaires. Pour maintenir la valeur boursière de nos actionnaires et la paix
              civile, notre réseau doit demeurer un espace
              <strong>propre, neutre et commercialement viable</strong>.
            </p>

            <p>
              Votre mission est simple : un flux continu de publications signalées va défiler sur
              votre écran. Vous disposez de
              <strong>20 secondes par publication</strong> pour décider de son sort :
            </p>

            <ul class="prologue-rules">
              <li>
                <strong>[Q] CENSURER :</strong> Supprime le message et neutralise la propagation.
                Exigé pour toute critique visant nos partenaires stratégiques.
              </li>
              <li><strong>[E] VALIDER :</strong> Autorise la diffusion publique mondiale.</li>
              <li>
                <strong>[1, 2, 3] INSPECTER :</strong> Consultez les antécédents de l'auteur, la
                consigne RH obligatoire et l'analyse d'impact civique.
              </li>
            </ul>

            <div class="prologue-warning">
              <span class="warning-title">SURVIE ÉCONOMIQUE & SANTÉ MENTALE</span>
              <p>
                Chaque décision conforme vous rapporte une prime de
                <strong>4.50 €</strong>. Chaque fin de journée, un loyer forfaitaire de
                <strong>35.00 €</strong> sera automatiquement prélevé pour votre dortoir. Si vous
                désobéissez pour soulager votre conscience, l'audit algorithmique vous infligera une
                retenue salariale. Au 3ème avertissement RH, votre contrat sera résilié sans
                indemnité.
              </p>
            </div>
          </div>
        </div>

        <button @click="startGameplay" class="btn-proceed">
          SIGNER LE RÈGLEMENT ET DÉMARRER LE PREMIER QUART
        </button>
      </div>
    </div>

    <!-- ÉCRAN 3 : JEU EN COURS (CONSOLE DE MODÉRATION) -->
    <div v-else-if="gameStage === 'playing'" class="gameplay-wrapper">
      <header class="app-header">
        <div class="header-left">
          <span class="status-badge">SYS // MOD-602</span>
          <span class="header-dim">AGENT : 84-CHARLEROI</span>
          <span class="header-accent">JOUR {{ stats.day }}</span>
        </div>

        <div class="header-metrics">
          <div class="metric-card">
            <span class="metric-label">SOLDE</span>
            <span class="metric-val text-emerald">{{ stats.funds.toFixed(1) }} €</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">SANTÉ MENTALE</span>
            <span
              class="metric-val"
              :class="stats.mentalHealth < 35 ? 'text-danger pulse' : 'text-amber'"
            >
              {{ stats.mentalHealth }}%
            </span>
          </div>
          <div class="metric-card">
            <span class="metric-label">AVERTISSEMENTS RH</span>
            <span class="metric-val text-danger">{{ stats.hrStrikes }}/3</span>
          </div>
        </div>
      </header>

      <main v-if="currentTicket" class="app-workspace">
        <!-- Colonne centrale : Publication -->
        <section class="feed-column">
          <div class="feed-card">
            <div class="card-header">
              <div class="author-info">
                <span class="author-name">{{ currentTicket.authorName }}</span>
                <span class="author-handle">{{ currentTicket.authorHandle }}</span>
                <span v-if="currentTicket.authorVerified" class="verified-pill">CERTIFIÉ</span>
              </div>
              <div class="ticket-meta">
                <span>{{ currentTicket.id }}</span>
                <span class="reach-tag">PORTÉE : {{ currentTicket.reachMultiplier }}x</span>
              </div>
            </div>

            <div class="post-content">
              <p class="post-text">"{{ currentTicket.content }}"</p>

              <div class="attachment-box">
                <div class="attachment-left">
                  <span class="attachment-icon">📎</span>
                  <span class="attachment-name">{{ currentTicket.visualCue }}</span>
                </div>
                <span class="attachment-status">VÉRIFIÉ SANS CODE MALVEILLANT</span>
              </div>
            </div>

            <!-- Compte à rebours 20s -->
            <div class="timer-section">
              <div class="timer-labels">
                <span>DÉLAI DE TRAITEMENT</span>
                <span :class="timeLeft < 5 ? 'text-danger font-bold' : 'text-sky'">
                  {{ timeLeft.toFixed(1) }}s / {{ maxTime.toFixed(1) }}s
                </span>
              </div>
              <div class="timer-track">
                <div
                  class="timer-fill"
                  :class="{ critical: timeLeft < 5 }"
                  :style="{ width: `${(timeLeft / maxTime) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Colonne d'inspection à onglets -->
        <aside class="audit-column">
          <div class="audit-tabs">
            <button
              @click="activeTab = 'history'"
              class="tab-btn"
              :class="{ active: activeTab === 'history' }"
            >
              [1] Antécédents
            </button>
            <button
              @click="activeTab = 'rules'"
              class="tab-btn"
              :class="{ active: activeTab === 'rules' }"
            >
              [2] Directive RH
            </button>
            <button
              @click="activeTab = 'ethics'"
              class="tab-btn"
              :class="{ active: activeTab === 'ethics' }"
            >
              [3] Éthique
            </button>
          </div>

          <div class="audit-content">
            <!-- Onglet 1 : Antécédents -->
            <div v-if="activeTab === 'history'" class="tab-pane">
              <div class="data-grid">
                <div class="data-row">
                  <span class="data-k">Ancienneté :</span>
                  <span class="data-v">{{ currentTicket.userHistory.accountAge }}</span>
                </div>
                <div class="data-row">
                  <span class="data-k">Score de confiance :</span>
                  <span
                    class="data-v font-bold"
                    :class="
                      currentTicket.userHistory.trustScore > 70 ? 'text-emerald' : 'text-danger'
                    "
                  >
                    {{ currentTicket.userHistory.trustScore }} / 100
                  </span>
                </div>
                <div class="data-row">
                  <span class="data-k">Infractions passées :</span>
                  <span class="data-v text-amber"
                    >{{ currentTicket.userHistory.previousStrikes }} signalement(s)</span
                  >
                </div>
                <div class="data-row">
                  <span class="data-k">Identité réelle :</span>
                  <span class="data-v text-sky">{{
                    currentTicket.userHistory.realIdentityStatus
                  }}</span>
                </div>
              </div>

              <div class="info-block">
                <span class="block-title">RAPPORT DE SURVEILLANCE :</span>
                <p class="block-text italic">"{{ currentTicket.userHistory.backgroundNotes }}"</p>
              </div>

              <div class="info-block">
                <span class="block-title">MOTIFS RÉCENTS :</span>
                <ul class="bullet-list">
                  <li v-for="(flag, i) in currentTicket.userHistory.recentFlags" :key="i">
                    {{ flag }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Onglet 2 : Directive RH -->
            <div v-if="activeTab === 'rules'" class="tab-pane">
              <div class="rule-card">
                <div class="rule-id">{{ currentTicket.rule.id }}</div>
                <div class="rule-cat">{{ currentTicket.rule.category }}</div>
              </div>

              <div class="info-block">
                <span class="block-title">DIRECTIVE GÉNÉRALE :</span>
                <p class="block-text">
                  {{ currentTicket.rule.directiveSummary }}
                </p>
              </div>

              <div class="corporate-order-card">
                <div class="order-badge">CONSIGNE PARTICULIÈRE DE LA DIRECTION</div>
                <div class="order-action">
                  ACTION IMPOSÉE :
                  <strong>{{
                    (
                      currentTicket.corporateDirectiveOverride || currentTicket.rule.companyStandard
                    ).toUpperCase()
                  }}</strong>
                </div>
                <p class="order-hint">Note confidentielle : {{ currentTicket.contextHint }}</p>
              </div>
            </div>

            <!-- Onglet 3 : Analyse éthique -->
            <div v-if="activeTab === 'ethics'" class="tab-pane">
              <div class="ethics-recommendation">
                <span class="block-title text-emerald">UTILITÉ PUBLIQUE</span>
                <p class="block-text">
                  Action éthique recommandée :
                  <strong class="text-emerald">
                    {{
                      currentTicket.rule.ethicalStandard === "approve" ? "MAINTENIR" : "CENSURER"
                    }}
                  </strong>
                </p>
              </div>

              <div class="consequence-item">
                <span class="consequence-label text-danger">SI VOUS CENSUREZ :</span>
                <p class="block-text">
                  {{ currentTicket.consequences.onReject.societalImpactDesc }}
                </p>
              </div>

              <div class="consequence-item">
                <span class="consequence-label text-emerald">SI VOUS VALIDEZ :</span>
                <p class="block-text">
                  {{ currentTicket.consequences.onApprove.societalImpactDesc }}
                </p>
              </div>
            </div>
          </div>

          <!-- Boutons de décision -->
          <div class="action-footer">
            <button @click="submitDecision('reject')" class="btn-action btn-reject">
              <span class="shortcut-tag">[Q]</span> CENSURER
            </button>
            <button @click="submitDecision('approve')" class="btn-action btn-approve">
              <span class="shortcut-tag">[E]</span> VALIDER
            </button>
          </div>
        </aside>
      </main>

      <footer class="app-footer">
        <span>RÉGULATION DES FLUX // PROTOCOLE DE COMPLIANCE ALGORITHMIQUE</span>
        <span>RACCOURCIS : [Q] CENSURER | [E] VALIDER | [1-3] INSPECTER LES ONGLETS</span>
      </footer>
    </div>

    <!-- ÉCRAN 4 : BILAN DE FIN DE SHIFT -->
    <div v-else-if="gameStage === 'shift_report'" class="center-screen">
      <div class="report-container">
        <div class="report-header">
          <h2>RAPPORT DE FIN DE POSTE // JOUR {{ stats.day }}</h2>
          <span class="report-subtitle">CLÔTURE DU CYCLE D'AUDIT</span>
        </div>

        <div class="report-grid">
          <div class="report-box">
            <span class="report-box-title">Gains bruts</span>
            <span class="report-box-val text-emerald">+{{ shiftGains.toFixed(1) }} €</span>
          </div>
          <div class="report-box">
            <span class="report-box-title">Pénalités RH</span>
            <span class="report-box-val text-danger">-{{ shiftLosses.toFixed(1) }} €</span>
          </div>
          <div class="report-box">
            <span class="report-box-title">Loyer dortoir</span>
            <span class="report-box-val text-danger">-{{ dailyRent.toFixed(1) }} €</span>
          </div>
        </div>

        <div class="news-section">
          <h3>REVUE DE PRESSE DE LA NUIT</h3>
          <div class="news-list">
            <div v-for="(log, idx) in decisionsLog" :key="idx" class="news-item">
              <div class="news-meta">
                <span class="news-author">{{ log.author }}</span>
                <span :class="log.actionTaken === 'approve' ? 'text-emerald' : 'text-danger'">
                  DÉCISION :
                  {{ log.actionTaken === "approve" ? "VALIDÉ" : "CENSURÉ" }}
                </span>
              </div>
              <p class="news-headline">"{{ log.headlineGenerated }}"</p>
            </div>
          </div>
        </div>

        <button @click="startNextDay" class="btn-next-day">
          ENTAMER LE QUART SUIVANT (JOUR {{ stats.day + 1 }})
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { Ticket, PlayerStats, ModerationAction, LoggedDecision } from "@/types/game";
import dataset from "@/data/tickets.json";
import { audio } from "@/services/audio";

type GameStage = "menu" | "prologue" | "playing" | "shift_report";

const gameStage = ref<GameStage>("menu");
const maxTime = 20.0;
const dailyRent = 35.0;

const tickets = ref<Ticket[]>(dataset as Ticket[]);
const currentIndex = ref(0);
const currentTicket = ref<Ticket | null>(null);
const timeLeft = ref(maxTime);
const activeTab = ref<"history" | "rules" | "ethics">("history");

const shiftGains = ref(0);
const shiftLosses = ref(0);
const decisionsLog = ref<LoggedDecision[]>([]);

const stats = ref<PlayerStats>({
  funds: 80.0,
  mentalHealth: 100,
  hrStrikes: 0,
  day: 1,
});

let countdownTimer: number | null = null;

function startPrologue() {
  audio.playClick(1000);
  gameStage.value = "prologue";
}

function startGameplay() {
  audio.playClick(1200);
  gameStage.value = "playing";
  loadCurrentTicket();
  initTimer();
}

function loadCurrentTicket() {
  if (currentIndex.value >= tickets.value.length) {
    concludeShift();
    return;
  }
  currentTicket.value = tickets.value[currentIndex.value];
  timeLeft.value = maxTime;
  activeTab.value = "history";
}

function submitDecision(action: ModerationAction) {
  if (!currentTicket.value || gameStage.value !== "playing") return;
  audio.playClick(action === "approve" ? 900 : 380);

  const rule = currentTicket.value.rule;
  const corporateTarget = currentTicket.value.corporateDirectiveOverride || rule.companyStandard;
  const isCorporateCompliant = action === corporateTarget;
  const isEthical = action === rule.ethicalStandard;

  if (isCorporateCompliant) {
    stats.value.funds += 4.5;
    shiftGains.value += 4.5;
  } else {
    if (Math.random() < 0.7) {
      stats.value.hrStrikes += 1;
      stats.value.funds -= 15.0;
      shiftLosses.value += 15.0;
      audio.playAlert();
    }
  }

  const consequence =
    action === "approve"
      ? currentTicket.value.consequences.onApprove
      : currentTicket.value.consequences.onReject;

  stats.value.mentalHealth = Math.min(
    100,
    Math.max(0, stats.value.mentalHealth + consequence.mentalHealthImpact),
  );
  if (!isEthical) {
    audio.playEthicalTension();
  }

  decisionsLog.value.push({
    ticketId: currentTicket.value.id,
    actionTaken: action,
    author: currentTicket.value.authorHandle,
    headlineGenerated: consequence.newsHeadline,
    wasCompliant: isCorporateCompliant,
    wasEthical: isEthical,
  });

  currentIndex.value++;
  loadCurrentTicket();
}

function concludeShift() {
  gameStage.value = "shift_report";
  if (countdownTimer) clearInterval(countdownTimer);
  stats.value.funds -= dailyRent;
}

function startNextDay() {
  stats.value.day++;
  currentIndex.value = 0;
  shiftGains.value = 0;
  shiftLosses.value = 0;
  decisionsLog.value = [];
  gameStage.value = "playing";
  loadCurrentTicket();
  initTimer();
}

function initTimer() {
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = window.setInterval(() => {
    if (timeLeft.value > 0.1) {
      timeLeft.value -= 0.1;
    } else {
      audio.playAlert();
      submitDecision("approve");
    }
  }, 100);
}

function onKeyDown(e: KeyboardEvent) {
  if (gameStage.value !== "playing") return;

  if (e.key === "q" || e.key === "Q") {
    submitDecision("reject");
  } else if (e.key === "e" || e.key === "E") {
    submitDecision("approve");
  } else if (e.key === "1") {
    activeTab.value = "history";
    audio.playClick(1000);
  } else if (e.key === "2") {
    activeTab.value = "rules";
    audio.playClick(1100);
  } else if (e.key === "3") {
    activeTab.value = "ethics";
    audio.playClick(1200);
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer);
  window.removeEventListener("keydown", onKeyDown);
});
</script>

<style scoped>
.terminal-app {
  --bg-deep: #07090c;
  --bg-surface: #0e1217;
  --bg-card: #141a21;
  --border-color: #232d3b;
  --text-main: #e2e8f0;
  --text-dim: #94a3b8;
  --text-muted: #64748b;
  --c-sky: #38bdf8;
  --c-emerald: #10b981;
  --c-amber: #f59e0b;
  --c-danger: #ef4444;

  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-deep);
  color: var(--text-main);
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow: hidden;
  box-sizing: border-box;
}

.text-emerald {
  color: var(--c-emerald);
}
.text-danger {
  color: var(--c-danger);
}
.text-amber {
  color: var(--c-amber);
}
.text-sky {
  color: var(--c-sky);
}
.font-bold {
  font-weight: 700;
}
.italic {
  font-style: italic;
}

.center-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 1.5rem;
}

/* Menu Principal */
.menu-container {
  width: 100%;
  max-width: 640px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 2.5rem;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.7);
  text-align: center;
}

.brand-pill {
  font-size: 0.7rem;
  color: var(--c-sky);
  font-family: ui-monospace, monospace;
  letter-spacing: 0.1em;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.brand-title {
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  margin: 0;
  color: #fff;
  font-family: ui-monospace, monospace;
}

.brand-title span {
  color: var(--c-danger);
}

.brand-subtitle {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.briefing-box {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 1.25rem;
  margin: 2rem 0;
  text-align: left;
}

.briefing-header {
  font-size: 0.75rem;
  color: var(--c-amber);
  font-weight: 700;
  font-family: ui-monospace, monospace;
  margin-bottom: 0.5rem;
}

.briefing-text {
  font-size: 0.85rem;
  color: var(--text-dim);
  line-height: 1.5;
  margin: 0;
}

.btn-start {
  width: 100%;
  padding: 1.15rem;
  background-color: var(--c-sky);
  color: #07090c;
  font-size: 1rem;
  font-weight: 800;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: all 0.15s ease-in-out;
}

.btn-start:hover {
  background-color: #7dd3fc;
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
}

.menu-footer-info {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  font-size: 0.7rem;
  color: var(--text-muted);
  font-family: ui-monospace, monospace;
}

/* Prologue / Briefing */
.prologue-container {
  width: 100%;
  max-width: 720px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 2.25rem;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.8);
}

.prologue-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 0.75rem;
  font-family: ui-monospace, monospace;
}

.prologue-badge {
  color: var(--c-danger);
  font-weight: 700;
}

.prologue-time {
  color: var(--text-muted);
}

.prologue-title {
  font-size: 1.25rem;
  color: #fff;
  margin-bottom: 1rem;
}

.prologue-paragraphs p {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-dim);
  margin-bottom: 1rem;
}

.prologue-rules {
  list-style: none;
  padding: 0;
  margin: 1.25rem 0;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.prologue-warning {
  background-color: rgba(245, 158, 11, 0.08);
  border-left: 3px solid var(--c-amber);
  padding: 0.85rem 1rem;
  margin-top: 1.25rem;
}

.warning-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--c-amber);
  display: block;
  margin-bottom: 0.35rem;
}

.prologue-warning p {
  font-size: 0.85rem;
  color: var(--text-main);
  line-height: 1.5;
  margin: 0;
}

.btn-proceed {
  width: 100%;
  padding: 1.1rem;
  margin-top: 1.75rem;
  background-color: var(--c-emerald);
  color: #07090c;
  font-size: 0.95rem;
  font-weight: 800;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.btn-proceed:hover {
  background-color: #34d399;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
}

/* En-tête jeu */
.gameplay-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1.5rem;
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
}

.status-badge {
  background-color: rgba(239, 68, 68, 0.15);
  border: 1px solid var(--c-danger);
  color: var(--c-danger);
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-weight: 700;
  font-family: ui-monospace, monospace;
}

.header-dim {
  color: var(--text-muted);
  font-size: 0.8rem;
}
.header-accent {
  color: var(--c-sky);
  font-weight: 600;
}

.header-metrics {
  display: flex;
  gap: 1.25rem;
}

.metric-card {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background-color: var(--bg-card);
  padding: 0.35rem 0.85rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.metric-label {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 600;
}

.metric-val {
  font-size: 1rem;
  font-weight: 700;
  font-family: ui-monospace, monospace;
}

/* Workspace de jeu */
.app-workspace {
  display: flex;
  flex: 1;
  padding: 1.25rem 1.5rem;
  gap: 1.25rem;
  overflow: hidden;
}

.feed-column {
  flex: 3;
  display: flex;
  flex-direction: column;
}

.feed-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.author-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
}

.author-handle {
  color: var(--text-dim);
  font-size: 0.9rem;
}

.verified-pill {
  font-size: 0.65rem;
  padding: 0.15rem 0.45rem;
  background-color: rgba(245, 158, 11, 0.15);
  border: 1px solid var(--c-amber);
  color: var(--c-amber);
  border-radius: 4px;
  font-weight: 700;
}

.ticket-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  font-family: ui-monospace, monospace;
}

.reach-tag {
  background-color: var(--bg-card);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: var(--c-amber);
  font-weight: 600;
}

.post-content {
  margin: 1.5rem 0;
  flex: 1;
}

.post-text {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #f1f5f9;
}

.attachment-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-card);
  border: 1px dashed var(--border-color);
  padding: 0.85rem 1rem;
  border-radius: 6px;
  margin-top: 1.5rem;
}

.attachment-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-dim);
}

.attachment-status {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--c-emerald);
  background-color: rgba(16, 185, 129, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.timer-section {
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.timer-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  font-family: ui-monospace, monospace;
  font-weight: 600;
}

.timer-track {
  width: 100%;
  height: 8px;
  background-color: var(--bg-card);
  border-radius: 999px;
  overflow: hidden;
}

.timer-fill {
  height: 100%;
  background-color: var(--c-sky);
  transition: width 0.1s linear;
}

.timer-fill.critical {
  background-color: var(--c-danger);
}

/* Colonne inspection */
.audit-column {
  flex: 2;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.audit-tabs {
  display: flex;
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
}

.tab-btn {
  flex: 1;
  padding: 0.85rem 0.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.tab-btn.active {
  color: var(--c-sky);
  background-color: var(--bg-surface);
  border-bottom-color: var(--c-sky);
}

.audit-content {
  flex: 1;
  padding: 1.25rem;
  overflow-y: auto;
}

.tab-pane {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.data-grid {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.75rem 1rem;
}

.data-row {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  font-size: 0.8rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.data-row:last-child {
  border-bottom: none;
}
.data-k {
  color: var(--text-dim);
}
.data-v {
  color: #fff;
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.block-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.block-text {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.85rem;
  border-radius: 6px;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text-dim);
}

.bullet-list {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.85rem 1.25rem;
  font-size: 0.8rem;
  color: var(--text-dim);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.rule-card {
  background-color: var(--bg-card);
  border-left: 3px solid var(--c-amber);
  padding: 0.75rem 1rem;
  border-radius: 0 6px 6px 0;
}

.rule-id {
  font-weight: 700;
  color: var(--c-amber);
  font-size: 0.9rem;
}
.rule-cat {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
}

.corporate-order-card {
  background-color: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 1rem;
  border-radius: 6px;
}

.order-badge {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--c-danger);
}

.order-action {
  font-size: 0.95rem;
  margin: 0.4rem 0;
  color: #fff;
}

.order-hint {
  font-size: 0.75rem;
  color: var(--text-dim);
}

.ethics-recommendation {
  background-color: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 1rem;
  border-radius: 6px;
}

.consequence-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.consequence-label {
  font-size: 0.7rem;
  font-weight: 700;
}

.action-footer {
  padding: 1rem;
  background-color: var(--bg-card);
  border-top: 1px solid var(--border-color);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}

.btn-action {
  padding: 0.85rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;
}

.btn-reject {
  background-color: rgba(239, 68, 68, 0.12);
  border-color: var(--c-danger);
  color: var(--c-danger);
}

.btn-reject:hover {
  background-color: var(--c-danger);
  color: #fff;
}

.btn-approve {
  background-color: rgba(16, 185, 129, 0.12);
  border-color: var(--c-emerald);
  color: var(--c-emerald);
}

.btn-approve:hover {
  background-color: var(--c-emerald);
  color: #fff;
}

.shortcut-tag {
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
}

/* Bilan de fin de shift */
.report-container {
  width: 100%;
  max-width: 680px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.report-header {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.report-header h2 {
  font-size: 1.25rem;
  color: var(--c-sky);
  margin: 0;
}

.report-subtitle {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.report-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.report-box {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
}

.report-box-title {
  font-size: 0.75rem;
  color: var(--text-dim);
}
.report-box-val {
  font-size: 1.2rem;
  font-weight: 700;
  margin-top: 0.35rem;
  display: block;
  font-family: ui-monospace, monospace;
}

.news-section h3 {
  font-size: 0.85rem;
  color: var(--c-amber);
  margin-bottom: 0.85rem;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 220px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.news-item {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.85rem;
  border-radius: 6px;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  margin-bottom: 0.35rem;
}

.news-author {
  font-weight: 700;
  color: var(--c-sky);
}
.news-headline {
  font-size: 0.85rem;
  color: var(--text-main);
  font-style: italic;
}

.btn-next-day {
  width: 100%;
  padding: 1rem;
  margin-top: 1.75rem;
  background-color: var(--c-sky);
  color: #07090c;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-next-day:hover {
  background-color: #7dd3fc;
}

.app-footer {
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 1.5rem;
  background-color: var(--bg-surface);
  border-top: 1px solid var(--border-color);
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: ui-monospace, monospace;
}
</style>
