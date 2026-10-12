<template>
  <div class="terminal-app">
    <!-- 1. Menu principal -->
    <MenuScreen v-if="gameStage === 'menu'" @start="startPrologue" />

    <!-- 2. Prologue narratif -->
    <PrologueScreen v-else-if="gameStage === 'prologue'" @proceed="startGameplay" />

    <!-- 3. Écran de modération -->
    <div v-else-if="gameStage === 'playing'" class="gameplay-wrapper">
      <HeaderBar :stats="stats" />

      <main v-if="currentTicket" class="app-workspace">
        <PostCard :ticket="currentTicket" :time-left="timeLeft" :max-time="maxTime" />
        <AuditSidebar
          :ticket="currentTicket"
          :active-tab="activeTab"
          @update:active-tab="activeTab = $event"
          @decide="submitDecision"
        />
      </main>

      <footer class="app-footer">
        <span>RÉGULATION DES FLUX // PROTOCOLE DE COMPLIANCE ALGORITHMIQUE</span>
        <span>RACCOURCIS : [Q] CENSURER | [E] VALIDER | [1-3] INSPECTER LES ONGLETS</span>
      </footer>
    </div>

    <!-- 4. Bilan du shift -->
    <ShiftReport
      v-else-if="gameStage === 'shift_report'"
      :stats="stats"
      :shift-gains="shiftGains"
      :shift-losses="shiftLosses"
      :daily-rent="dailyRent"
      :decisions-log="decisionsLog"
      @next-day="startNextDay"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type {
  Ticket,
  PlayerStats,
  ModerationAction,
  LoggedDecision,
  GameStage,
} from "@/types/game";
import dataset from "@/data/tickets.json";
import { audio } from "@/services/audio";

import HeaderBar from "@/components/HeaderBar.vue";
import PostCard from "@/components/PostCard.vue";
import AuditSidebar from "@/components/AuditSidebar.vue";
import MenuScreen from "@/components/MenuScreen.vue";
import PrologueScreen from "@/components/PrologueScreen.vue";
import ShiftReport from "@/components/ShiftReport.vue";

const gameStage = ref<GameStage>("menu");
const maxTime = 20.0;
const dailyRent = 40.0; // Équilibré : 8 tickets x (5€ de base + 2€ bonus) = 56€ max

const tickets = ref<Ticket[]>(dataset as Ticket[]);
const currentIndex = ref(0);
const currentTicket = ref<Ticket | null>(null);
const timeLeft = ref(maxTime);
const activeTab = ref<"history" | "rules" | "ethics">("history");

const shiftGains = ref(0);
const shiftLosses = ref(0);
const decisionsLog = ref<LoggedDecision[]>([]);

const stats = ref<PlayerStats>({
  funds: 50.0,
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

  // Calcul économique équilibré
  if (isCorporateCompliant) {
    const speedBonus = timeLeft.value > 10.0 ? 2.0 : 0.0;
    const earned = 5.0 + speedBonus;
    stats.value.funds += earned;
    shiftGains.value += earned;
  } else {
    // Audit RH en cas de désobéissance corporative
    if (Math.random() < 0.65) {
      stats.value.hrStrikes += 1;
      stats.value.funds -= 12.0;
      shiftLosses.value += 12.0;
      audio.playAlert();
    }
  }

  // Évolution de la santé mentale
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
