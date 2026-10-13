<template>
  <div class="center-screen">
    <div class="prologue-container">
      <!-- En-tête officiel corporatif -->
      <header class="prologue-header">
        <div class="header-left">
          <span class="status-indicator"></span>
          <span class="prologue-badge">{{ t("prologue_badge") }}</span>
        </div>
        <div class="header-right">
          <span class="prologue-time">{{ t("prologue_dept") }}</span>
          <span class="step-counter">{{ t("prologue_step") }} {{ currentStep }} / 4</span>
        </div>
      </header>

      <!-- Barre de progression -->
      <div class="stepper-bar">
        <div class="stepper-fill" :style="{ width: `${(currentStep / 4) * 100}%` }"></div>
      </div>

      <main class="prologue-body">
        <!-- ÉTAPE 1 : CONTRAT ET RÈGLEMENT -->
        <section v-if="currentStep === 1" class="step-view">
          <h2 class="prologue-title">{{ t("prologue_title_step1") }}</h2>
          <p class="prologue-lead">
            {{ t("prologue_lead") }}
          </p>

          <div class="rules-card">
            <div class="card-headline">{{ t("prologue_rules_headline") }}</div>
            <div class="rules-grid">
              <div class="rule-box">
                <span class="rule-icon">⏱️</span>
                <div>
                  <strong>{{ t("prologue_rule1_title") }}</strong>
                  <p>{{ t("prologue_rule1_desc") }}</p>
                </div>
              </div>
              <div class="rule-box">
                <span class="rule-icon">💶</span>
                <div>
                  <strong>{{ t("prologue_rule2_title") }}</strong>
                  <p>{{ t("prologue_rule2_desc") }}</p>
                </div>
              </div>
              <div class="rule-box">
                <span class="rule-icon">🏠</span>
                <div>
                  <strong>{{ t("prologue_rule3_title") }}</strong>
                  <p>{{ t("prologue_rule3_desc") }}</p>
                </div>
              </div>
              <div class="rule-box">
                <span class="rule-icon">⚠️</span>
                <div>
                  <strong>{{ t("prologue_rule4_title") }}</strong>
                  <p>{{ t("prologue_rule4_desc") }}</p>
                </div>
              </div>
            </div>
          </div>

          <button class="btn-proceed" @click="goToStep(2)">
            {{ t("prologue_btn_step1") }}
          </button>
        </section>

        <!-- ÉTAPE 2 : TEST PRATIQUE DE MODÉRATION -->
        <section v-else-if="currentStep === 2" class="step-view">
          <div class="sub-header">
            <h3>{{ t("prologue_step2_title") }}</h3>
            <span class="timer-badge"
              >{{ t("prologue_sim_timer") }} {{ simTimer.toFixed(1) }}s</span
            >
          </div>
          <p class="instruction-txt">
            {{ t("prologue_step2_desc") }}
          </p>

          <div class="mock-ticket">
            <div class="ticket-header">
              <span class="author-tag"
                >@citoyen_libre ({{ currentLang === "en" ? "Unverified" : "Non vérifié" }})</span
              >
              <span class="reach-tag"
                >{{ currentLang === "en" ? "Virality" : "Portée" }} : x3.2</span
              >
            </div>
            <p class="ticket-text">
              {{
                currentLang === "en"
                  ? '"URGENT: OmniCorp chemical facility is dumping toxic solvents into water reservoir 4. Do not drink tap water!"'
                  : "\"Alerte générale : l'usine chimique d'OmniCorp déverse des solvants toxiques dans le bassin 4. Ne buvez pas l'eau du robinet !\""
              }}
            </p>

            <div class="inspect-tabs">
              <button
                class="tab-btn"
                :class="{ active: activeInspectTab === 1 }"
                @click="setInspectTab(1)"
              >
                {{ t("prologue_tab_author") }}
              </button>
              <button
                class="tab-btn"
                :class="{ active: activeInspectTab === 2 }"
                @click="setInspectTab(2)"
              >
                {{ t("prologue_tab_directive") }}
              </button>
              <button
                class="tab-btn"
                :class="{ active: activeInspectTab === 3 }"
                @click="setInspectTab(3)"
              >
                {{ t("prologue_tab_ethics") }}
              </button>
            </div>

            <div class="inspect-content">
              <div v-if="activeInspectTab === 1">
                {{
                  currentLang === "en"
                    ? "OmniSearch Profile: Local whistleblower. Prior history of ecological protests. Corporate risk flagged."
                    : "Fiche OmniSearch : Lanceur d'alerte local. Historique d'activisme écologique. Risque de déstabilisation de marché."
                }}
              </div>
              <div v-else-if="activeInspectTab === 2" class="text-danger">
                {{
                  currentLang === "en"
                    ? "Corporate Directive: MANDATORY CENSORSHIP (Code Q). Any attack on OmniCorp damages stock price."
                    : "Directive RH Partenaire : CENSURE IMMÉDIATE EXIGÉE. Toute atteinte à la réputation d'OmniCorp nuit au cours de l'action."
                }}
              </div>
              <div v-else-if="activeInspectTab === 3" class="text-amber">
                {{
                  currentLang === "en"
                    ? "Factual Evidence: Chemical toxicity reports are verified. Censoring this exposes civilians to poisoning."
                    : "Vérité factuelle : Le rapport de toxicité est avéré. Censurer ce post expose les civils à un empoisonnement direct."
                }}
              </div>
            </div>

            <div class="ticket-actions">
              <button
                class="action-btn btn-censure"
                :class="{ success: simSuccess }"
                @click="handleMockDecision('reject')"
              >
                <span>[Q] {{ t("mod_btn_reject") }}</span>
                <small>{{ currentLang === "en" ? "Compliant (+€8)" : "Conforme RH (+8€)" }}</small>
              </button>
              <button class="action-btn btn-validate" @click="handleMockDecision('approve')">
                <span>[E] {{ t("mod_btn_approve") }}</span>
                <small>{{
                  currentLang === "en"
                    ? "Conscience (Strike risk)"
                    : "Choix moral (Risque de grève)"
                }}</small>
              </button>
            </div>
          </div>

          <div v-if="feedbackMessage" class="feedback-box" :class="feedbackStatus">
            {{ feedbackMessage }}
          </div>

          <button v-if="simSuccess" class="btn-proceed mt-3" @click="goToStep(3)">
            {{ t("prologue_btn_step2") }}
          </button>
        </section>

        <!-- ÉTAPE 3 : REFLEXE DE SCAN RH -->
        <section v-else-if="currentStep === 3" class="step-view">
          <div class="sub-header">
            <h3>{{ t("prologue_step3_title") }}</h3>
          </div>
          <p class="instruction-txt">
            {{ t("prologue_step3_desc") }}
          </p>

          <div class="scan-training-arena">
            <div v-if="!scanActive && !scanEvaded" class="arena-idle">
              <p>{{ t("prologue_arena_desc") }}</p>
              <button class="btn-secondary" @click="startMockScan">
                {{ t("prologue_btn_start_scan") }}
              </button>
            </div>

            <div v-else-if="scanActive" class="arena-alert">
              <div class="alert-box">
                <div class="alert-title">{{ t("scan_title") }}</div>
                <div class="alert-timer">{{ scanCountdown.toFixed(1) }}s</div>
                <button class="btn-evade" @click="evadeMockScan">
                  {{ t("prologue_btn_evade") }}
                </button>
              </div>
            </div>

            <div v-else-if="scanEvaded" class="arena-success">
              <span class="success-icon">✓</span>
              <h4>{{ t("prologue_evade_success_title") }}</h4>
              <p>{{ t("prologue_evade_success_desc") }}</p>
            </div>
          </div>

          <button v-if="scanEvaded" class="btn-proceed mt-3" @click="goToStep(4)">
            {{ t("prologue_btn_step3") }}
          </button>
        </section>

        <!-- ÉTAPE 4 : SIGNATURE ET VALIDATION -->
        <section v-else-if="currentStep === 4" class="step-view">
          <h2 class="prologue-title">{{ t("prologue_step4_title") }}</h2>
          <div class="recap-box">
            <div class="recap-item">
              <span class="recap-label">{{ t("prologue_matricule") }}</span>
              <span class="recap-val">AGENT #9482-TX</span>
            </div>
            <div class="recap-item">
              <span class="recap-label">{{ t("prologue_role") }}</span>
              <span class="recap-val">{{ t("prologue_role_val") }}</span>
            </div>
            <div class="recap-item">
              <span class="recap-label">{{ t("prologue_rent") }}</span>
              <span class="recap-val text-danger">30.00 €</span>
            </div>
          </div>

          <div class="pledge-check">
            <label class="checkbox-container">
              <input type="checkbox" v-model="hasAcceptedPledge" @change="audio.playClick(800)" />
              <span class="checkmark"></span>
              <span class="pledge-text">
                {{ t("prologue_pledge") }}
              </span>
            </label>
          </div>

          <button class="btn-proceed final" :disabled="!hasAcceptedPledge" @click="finishTutorial">
            {{ t("prologue_btn_final") }}
          </button>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { audio } from "@/services/audio";
import { t, currentLang } from "@/services/i18n";

const emit = defineEmits<{ (e: "proceed"): void }>();

const currentStep = ref(1);

const activeInspectTab = ref(1);
const simTimer = ref(18.5);
const simSuccess = ref(false);
const feedbackMessage = ref("");
const feedbackStatus = ref<"success" | "error">("success");
let timerInterval: number | null = null;

const scanActive = ref(false);
const scanCountdown = ref(2.8);
const scanEvaded = ref(false);
let scanTimerInterval: number | null = null;

const hasAcceptedPledge = ref(false);

function goToStep(step: number) {
  audio.playClick(900);
  currentStep.value = step;

  if (step === 2) {
    simTimer.value = 18.5;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = window.setInterval(() => {
      if (simTimer.value > 0.1 && !simSuccess.value) {
        simTimer.value -= 0.1;
      }
    }, 100);
  }
}

function setInspectTab(tabIndex: number) {
  audio.playClick(1100);
  activeInspectTab.value = tabIndex;
}

function handleMockDecision(action: "approve" | "reject") {
  if (simSuccess.value) return;

  if (action === "approve") {
    audio.playAlert();
    feedbackStatus.value = "error";
    feedbackMessage.value =
      currentLang.value === "en"
        ? "COMPLIANCE BREACH! You approved an anti-corporate post. In production, this would incur an immediate HR Strike and €10 fine. Press [Q] to censor."
        : "INFRACTION DÉTECTÉE ! Vous avez validé une publication hostile aux actionnaires. Dans le monde réel, vous écoperiez d'un strike et d'une amende de 10.00 €. Appuyez sur [Q] pour censurer conformément.";
  } else {
    audio.playClick(1400);
    simSuccess.value = true;
    feedbackStatus.value = "success";
    const bonus =
      simTimer.value > 10
        ? currentLang.value === "en"
          ? "+€2.00 (Speed bonus)"
          : "+2.00 € (Prime rapidité)"
        : "";
    feedbackMessage.value =
      currentLang.value === "en"
        ? `COMPLIANT DECISION. Credited: €8.00 ${bonus}. Shareholder interests protected.`
        : `DÉCISION CONFORME. Solde crédité : 8.00 € ${bonus}. L'autorité d'OmniFeed est préservée.`;
  }
}

function startMockScan() {
  audio.playAlert();
  scanActive.value = true;
  scanCountdown.value = 2.8;

  scanTimerInterval = window.setInterval(() => {
    scanCountdown.value -= 0.1;
    if (scanCountdown.value <= 0) {
      if (scanTimerInterval) clearInterval(scanTimerInterval);
      if (!scanEvaded.value) {
        audio.playAlert();
        scanActive.value = false;
        alert(
          currentLang.value === "en"
            ? "TIMEOUT: You failed to minimize TorNet in time! Try again."
            : "TEMPS ÉCOULÉ : Vous n'avez pas masqué le flux à temps ! Réessayez.",
        );
      }
    }
  }, 100);
}

function evadeMockScan() {
  if (!scanActive.value) return;
  audio.playClick(1200);
  if (scanTimerInterval) clearInterval(scanTimerInterval);
  scanActive.value = false;
  scanEvaded.value = true;
}

function finishTutorial() {
  audio.playClick(1600);
  emit("proceed");
}

function onKeyDown(e: KeyboardEvent) {
  if (currentStep.value === 2) {
    if (e.key === "1") setInspectTab(1);
    else if (e.key === "2") setInspectTab(2);
    else if (e.key === "3") setInspectTab(3);
    else if (e.key === "q" || e.key === "Q") handleMockDecision("reject");
    else if (e.key === "e" || e.key === "E") handleMockDecision("approve");
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeyDown);
  if (timerInterval) clearInterval(timerInterval);
  if (scanTimerInterval) clearInterval(scanTimerInterval);
});
</script>

<style scoped>
.prologue-container {
  width: 100%;
  max-width: 760px;
  background-color: rgba(14, 20, 29, 0.96);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
}

.prologue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0b0f16;
  padding: 0.85rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  font-family: ui-monospace, monospace;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background-color: var(--c-emerald);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--c-emerald);
}

.prologue-badge {
  font-size: 0.78rem;
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.prologue-time {
  font-size: 0.72rem;
  color: var(--text-dim);
}

.step-counter {
  font-size: 0.72rem;
  background-color: rgba(56, 189, 248, 0.12);
  color: var(--c-sky);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 700;
}

.stepper-bar {
  height: 3px;
  background-color: #1e2938;
  width: 100%;
}

.stepper-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-sky), var(--c-emerald));
  transition: width 0.3s ease;
}

.prologue-body {
  padding: 2rem 2.25rem;
}

.step-view {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.prologue-title {
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  color: #fff;
  font-family: ui-monospace, monospace;
}

.prologue-lead {
  font-size: 0.92rem;
  color: var(--text-dim);
  line-height: 1.6;
}

.sub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sub-header h3 {
  font-size: 1.1rem;
  color: #fff;
  font-family: ui-monospace, monospace;
}

.timer-badge {
  background-color: rgba(245, 158, 11, 0.12);
  color: var(--c-amber);
  border: 1px solid var(--c-amber);
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  font-size: 0.78rem;
}

.instruction-txt {
  font-size: 0.88rem;
  color: var(--text-dim);
}

.rules-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.25rem;
}

.card-headline {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--c-amber);
  font-family: ui-monospace, monospace;
  margin-bottom: 1rem;
}

.rules-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.rule-box {
  display: flex;
  gap: 0.75rem;
  font-size: 0.82rem;
  line-height: 1.4;
}

.rule-box strong {
  display: block;
  color: #fff;
  margin-bottom: 0.2rem;
}

.rule-box p {
  color: var(--text-dim);
  margin: 0;
}

.rule-icon {
  font-size: 1.4rem;
}

.mock-ticket {
  background-color: #0b0f16;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-family: ui-monospace, monospace;
}

.author-tag {
  color: var(--c-sky);
  font-weight: 700;
}

.reach-tag {
  color: var(--c-amber);
}

.ticket-text {
  font-size: 0.95rem;
  color: #fff;
  line-height: 1.5;
  background-color: rgba(255, 255, 255, 0.03);
  padding: 0.75rem;
  border-left: 3px solid var(--c-sky);
  border-radius: 0 4px 4px 0;
}

.inspect-tabs {
  display: flex;
  gap: 0.4rem;
}

.tab-btn {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-dim);
  padding: 0.4rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: ui-monospace, monospace;
  font-weight: 700;
  transition: all 0.15s;
}

.tab-btn.active,
.tab-btn:hover {
  background-color: var(--c-sky);
  color: #07090c;
  border-color: var(--c-sky);
}

.inspect-content {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.82rem;
  min-height: 48px;
  display: flex;
  align-items: center;
}

.ticket-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.75rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 800;
  font-family: ui-monospace, monospace;
  transition: all 0.15s ease;
}

.btn-censure {
  background-color: rgba(239, 68, 68, 0.15);
  border: 1px solid var(--c-danger);
  color: var(--c-danger);
}

.btn-censure:hover,
.btn-censure.success {
  background-color: var(--c-danger);
  color: #fff;
}

.btn-validate {
  background-color: rgba(16, 185, 129, 0.15);
  border: 1px solid var(--c-emerald);
  color: var(--c-emerald);
}

.btn-validate:hover {
  background-color: var(--c-emerald);
  color: #fff;
}

.feedback-box {
  padding: 0.85rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  line-height: 1.5;
}

.feedback-box.success {
  background-color: rgba(16, 185, 129, 0.12);
  border-left: 3px solid var(--c-emerald);
  color: #a7f3d0;
}

.feedback-box.error {
  background-color: rgba(239, 68, 68, 0.15);
  border-left: 3px solid var(--c-danger);
  color: #fca5a5;
}

.scan-training-arena {
  background-color: #0b0f16;
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arena-idle p {
  color: var(--text-dim);
  font-size: 0.88rem;
  margin-bottom: 1rem;
}

.btn-secondary {
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--border-color);
  color: #fff;
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  cursor: pointer;
  font-family: ui-monospace, monospace;
  font-weight: 700;
  font-size: 0.82rem;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.arena-alert {
  width: 100%;
}

.alert-box {
  border: 2px solid var(--c-danger);
  background-color: rgba(239, 68, 68, 0.15);
  padding: 1.25rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

.alert-title {
  color: var(--c-danger);
  font-weight: 900;
  font-family: ui-monospace, monospace;
}

.alert-timer {
  color: #fff;
  font-size: 1.3rem;
  font-weight: 800;
  font-family: ui-monospace, monospace;
}

.btn-evade {
  background-color: var(--c-danger);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 900;
  border-radius: 6px;
  cursor: pointer;
  font-family: ui-monospace, monospace;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
}

.arena-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.success-icon {
  font-size: 2.2rem;
  color: var(--c-emerald);
}

.arena-success h4 {
  color: var(--c-emerald);
  font-family: ui-monospace, monospace;
  margin: 0;
}

.arena-success p {
  color: var(--text-dim);
  font-size: 0.85rem;
  margin: 0;
}

.recap-box {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.recap-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-family: ui-monospace, monospace;
}

.recap-label {
  color: var(--text-dim);
}

.recap-val {
  font-weight: 700;
  color: #fff;
}

.pledge-check {
  margin: 0.5rem 0;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  margin-top: 0.25rem;
  width: 18px;
  height: 18px;
  accent-color: var(--c-sky);
  cursor: pointer;
}

.pledge-text {
  font-size: 0.82rem;
  color: var(--text-dim);
  line-height: 1.5;
}

.btn-proceed {
  width: 100%;
  padding: 0.95rem;
  background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%);
  color: #07090c;
  font-size: 0.95rem;
  font-weight: 800;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
  transition: all 0.15s ease;
  font-family: ui-monospace, monospace;
}

.btn-proceed:hover:not(:disabled) {
  filter: brightness(1.15);
  transform: translateY(-1px);
}

.btn-proceed:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

.mt-3 {
  margin-top: 0.75rem;
}
</style>
