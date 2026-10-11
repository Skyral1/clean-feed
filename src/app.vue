<template>
  <div class="interface-shell">
    <div class="crt-scanlines"></div>

    <header class="header-bar">
      <div>
        <span style="color: #ef4444; font-weight: bold">[TERMINAL-MOD-602]</span>
        <span style="margin-left: 1rem; color: #64748b">AGENT: 0x889</span>
        <span style="margin-left: 1rem; color: #38bdf8">JOUR {{ stats.day }}</span>
      </div>
      <div style="display: flex; gap: 1.5rem">
        <div>
          CRÉDITS :
          <span style="color: #10b981; font-weight: bold">{{ stats.funds.toFixed(1) }} €</span>
        </div>
        <div>
          SANTÉ MENTALE :
          <span :style="{ color: stats.mentalHealth < 30 ? '#ef4444' : '#f59e0b' }"
            >{{ stats.mentalHealth }}%</span
          >
        </div>
        <div>
          STRIKES RH :
          <span style="color: #ef4444; font-weight: bold">{{ stats.hrStrikes }}/3</span>
        </div>
      </div>
    </header>

    <main v-if="!isShiftFinished && currentTicket" class="workspace-grid">
      <section class="ticket-view">
        <div>
          <div
            style="
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #1f2937;
              padding-bottom: 0.5rem;
              font-size: 0.8rem;
            "
          >
            <span style="color: #38bdf8">{{ currentTicket.authorHandle }}</span>
            <span style="color: #64748b"
              >{{ currentTicket.id }} // PORTÉE : {{ currentTicket.reachMultiplier }}x</span
            >
          </div>
          <div style="margin: 2rem 0; font-size: 1.05rem; line-height: 1.5">
            {{ currentTicket.content }}
          </div>
          <div
            style="
              background-color: #090d10;
              border: 1px dashed #334155;
              padding: 0.75rem;
              color: #64748b;
              font-size: 0.8rem;
            "
          >
            {{ currentTicket.visualCue }}
          </div>
        </div>

        <div>
          <div
            style="
              display: flex;
              justify-content: space-between;
              font-size: 0.75rem;
              color: #64748b;
            "
          >
            <span>DÉLAI DE TRAITEMENT</span>
            <span>{{ timeLeft.toFixed(1) }}s</span>
          </div>
          <div class="progress-track">
            <div
              class="progress-bar"
              :class="{ urgent: timeLeft < 2.5 }"
              :style="{ width: `${(timeLeft / maxTime) * 100}%` }"
            ></div>
          </div>
        </div>
      </section>

      <aside class="sidebar-view">
        <div class="panel-box" style="flex: 1">
          <h2
            style="
              font-size: 0.85rem;
              color: #f59e0b;
              border-bottom: 1px solid #1f2937;
              padding-bottom: 0.5rem;
              margin-bottom: 0.75rem;
            "
          >
            RÈGLEMENT D'ENTREPRISE
          </h2>
          <p style="font-size: 0.8rem; margin-bottom: 0.5rem">
            <strong>Code :</strong> {{ currentTicket.rule.id }}
          </p>
          <p style="font-size: 0.8rem; color: #94a3b8">
            <strong>Détail :</strong> {{ currentTicket.contextHint }}
          </p>

          <div
            v-if="inspectionMode"
            style="
              margin-top: 1.5rem;
              padding: 0.75rem;
              border: 1px solid #0284c7;
              background: #0c4a6e22;
              font-size: 0.8rem;
            "
          >
            <p style="color: #38bdf8; font-weight: bold">ANALYSE D'IMPACT ÉTHIQUE</p>
            <p style="margin-top: 0.25rem">
              Action morale :
              {{ currentTicket.rule.ethicalStandard === "approve" ? "MAINTENIR" : "CENSURER" }}
            </p>
          </div>
        </div>

        <div class="panel-box">
          <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem">
            RACCOURCIS CLAVIER
          </div>
          <div class="key-commands">
            <div class="key-badge" style="color: #ef4444">[Q] REJET</div>
            <div class="key-badge" style="color: #38bdf8">[ESPACE] SCAN</div>
            <div class="key-badge" style="color: #10b981">[E] VALID</div>
          </div>
        </div>
      </aside>
    </main>

    <main v-else class="workspace-grid" style="align-items: center; justify-content: center">
      <section class="report-modal">
        <h2
          style="
            color: #38bdf8;
            border-bottom: 1px solid #1f2937;
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
          "
        >
          RAPPORT DE CLÔTURE // JOUR {{ stats.day }}
        </h2>
        <div style="display: flex; flex-direction: column; gap: 0.5rem">
          <div style="display: flex; justify-content: space-between">
            <span>Gains de productivité :</span>
            <span style="color: #10b981">+{{ shiftGains.toFixed(1) }} €</span>
          </div>
          <div style="display: flex; justify-content: space-between">
            <span>Retenues disciplinaires :</span>
            <span style="color: #ef4444">-{{ shiftLosses.toFixed(1) }} €</span>
          </div>
          <div style="display: flex; justify-content: space-between">
            <span>Loyer et souscription dortoir :</span>
            <span style="color: #ef4444">-{{ dailyRent }} €</span>
          </div>
          <div
            style="
              border-top: 1px solid #1f2937;
              padding-top: 0.5rem;
              display: flex;
              justify-content: space-between;
              font-weight: bold;
            "
          >
            <span>Solde bancaire actuel :</span>
            <span>{{ stats.funds.toFixed(1) }} €</span>
          </div>
        </div>

        <button class="primary-btn" @click="advanceNextDay">ENTAMER LE QUART SUIVANT</button>
      </section>
    </main>

    <footer
      style="
        display: flex;
        justify-content: space-between;
        font-size: 0.7rem;
        color: #475569;
        border-top: 1px solid #1f2937;
        padding-top: 0.5rem;
      "
    >
      <span>PROTOCOLE STRICT DE FILTRAGE // DISTRIBUTED WORKER 1.1</span>
      <span>CONNEXION SÉCURISÉE AU DATACENTER CENTRAL</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { Ticket, PlayerStats, ModerationAction } from "@/types/game";
import dataset from "@/data/tickets.json";
import { audio } from "@/services/audio";

const maxTime = 8.0;
const dailyRent = 40;
const tickets = ref<Ticket[]>(dataset as Ticket[]);
const currentIndex = ref(0);
const currentTicket = ref<Ticket | null>(null);
const timeLeft = ref(maxTime);
const isShiftFinished = ref(false);
const inspectionMode = ref(false);

const shiftGains = ref(0);
const shiftLosses = ref(0);

const stats = ref<PlayerStats>({
  funds: 85.0,
  mentalHealth: 100,
  hrStrikes: 0,
  day: 1,
});

let clockTimer: number | null = null;

function loadTicket() {
  if (currentIndex.value >= tickets.value.length) {
    completeShift();
    return;
  }
  currentTicket.value = tickets.value[currentIndex.value];
  timeLeft.value = maxTime;
  inspectionMode.value = false;
}

function submitDecision(action: ModerationAction) {
  if (!currentTicket.value) return;
  audio.playClick(action === "approve" ? 850 : 400);

  const expectedCompany =
    currentTicket.value.corporateDirectiveOverride || currentTicket.value.rule.companyStandard;
  const isCompliant = action === expectedCompany;
  const isEthical = action === currentTicket.value.rule.ethicalStandard;

  if (isCompliant) {
    stats.value.funds += 2.0;
    shiftGains.value += 2.0;
  } else {
    if (Math.random() < 0.6) {
      stats.value.hrStrikes += 1;
      stats.value.funds -= 12.0;
      shiftLosses.value += 12.0;
      audio.playAlert();
    }
  }

  if (!isEthical) {
    stats.value.mentalHealth = Math.max(0, stats.value.mentalHealth - 15);
    audio.playEthicalTension();
  }

  currentIndex.value++;
  loadTicket();
}

function completeShift() {
  isShiftFinished.value = true;
  if (clockTimer) clearInterval(clockTimer);
  stats.value.funds -= dailyRent;
}

function advanceNextDay() {
  stats.value.day++;
  currentIndex.value = 0;
  shiftGains.value = 0;
  shiftLosses.value = 0;
  isShiftFinished.value = false;
  loadTicket();
  startClock();
}

function startClock() {
  if (clockTimer) clearInterval(clockTimer);
  clockTimer = window.setInterval(() => {
    if (timeLeft.value > 0.1) {
      timeLeft.value -= 0.1;
    } else {
      audio.playAlert();
      submitDecision("approve");
    }
  }, 100);
}

function onKeyDown(e: KeyboardEvent) {
  if (isShiftFinished.value) return;
  if (e.key === "q" || e.key === "Q") {
    submitDecision("reject");
  } else if (e.key === "e" || e.key === "E") {
    submitDecision("approve");
  } else if (e.code === "Space") {
    e.preventDefault();
    inspectionMode.value = !inspectionMode.value;
    audio.playClick(1100);
  }
}

onMounted(() => {
  loadTicket();
  startClock();
  window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer);
  window.removeEventListener("keydown", onKeyDown);
});
</script>
