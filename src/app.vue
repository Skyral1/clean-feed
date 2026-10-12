<template>
  <div class="terminal-app">
    <!-- ÉCRAN 1 : MENU PRINCIPAL -->
    <MenuScreen v-if="gameStage === 'menu'" @start="startPrologue" />

    <!-- ÉCRAN 2 : PROLOGUE -->
    <PrologueScreen v-else-if="gameStage === 'prologue'" @proceed="startGameplay" />

    <!-- ÉCRAN 3 : BUREAU OMNIOS EN COURS -->
    <div v-else-if="gameStage === 'playing'" class="desktop-screen">
      <!-- Barre d'état supérieure -->
      <HeaderBar :stats="stats" />

      <!-- Espace du bureau virtuel (Bureau Multi-fenêtres) -->
      <div class="desktop-workspace" ref="desktopArea">
        <!-- Fenêtre 1 : File de Modération -->
        <WindowFrame
          v-if="windows.moderation.isOpen"
          :window="windows.moderation"
          @focus="focusWindow('moderation')"
          @minimize="minimizeWindow('moderation')"
          @close="closeWindow('moderation')"
          @move="moveWindow('moderation', $event)"
        >
          <ModerationWindow
            v-if="currentTicket"
            :ticket="currentTicket"
            :elapsed-seconds="elapsedTicketTime"
            :estimated-reward="currentTierReward"
            @decide="submitDecision"
          />
        </WindowFrame>

        <!-- Fenêtre 2 : Moteur de Recherche Intranet -->
        <WindowFrame
          v-if="windows.search.isOpen"
          :window="windows.search"
          @focus="focusWindow('search')"
          @minimize="minimizeWindow('search')"
          @close="closeWindow('search')"
          @move="moveWindow('search', $event)"
        >
          <SearchWindow v-if="currentTicket" :current-ticket="currentTicket" />
        </WindowFrame>

        <!-- Fenêtre 3 : Manuel des Directives RH -->
        <WindowFrame
          v-if="windows.handbook.isOpen"
          :window="windows.handbook"
          @focus="focusWindow('handbook')"
          @minimize="minimizeWindow('handbook')"
          @close="closeWindow('handbook')"
          @move="moveWindow('handbook', $event)"
        >
          <HandbookWindow v-if="currentTicket" :ticket="currentTicket" />
        </WindowFrame>
      </div>

      <!-- Barre des tâches inférieure (Taskbar) -->
      <nav class="taskbar">
        <div class="taskbar-left">
          <button class="start-btn" @click="reopenAllWindows"><span>🪟</span> OmniOS</button>

          <div class="running-apps">
            <button
              class="task-item"
              :class="{
                active: windows.moderation.isOpen && !windows.moderation.isMinimized,
              }"
              @click="toggleTaskWindow('moderation')"
            >
              📋 Modération
            </button>
            <button
              class="task-item"
              :class="{
                active: windows.search.isOpen && !windows.search.isMinimized,
              }"
              @click="toggleTaskWindow('search')"
            >
              🔍 OmniSearch
            </button>
            <button
              class="task-item"
              :class="{
                active: windows.handbook.isOpen && !windows.handbook.isMinimized,
              }"
              @click="toggleTaskWindow('handbook')"
            >
              📕 Manuel RH
            </button>
          </div>
        </div>

        <div class="taskbar-right">
          <span>RACCOURCIS : [Q] CENSURER | [E] VALIDER</span>
          <span class="clock-display">{{ currentTimeString }}</span>
        </div>
      </nav>
    </div>

    <!-- ÉCRAN 4 : BILAN DE FIN DE SHIFT -->
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
import { ref, computed, reactive, onMounted, onUnmounted } from "vue";
import type {
  Ticket,
  PlayerStats,
  ModerationAction,
  LoggedDecision,
  GameStage,
  WindowState,
} from "@/types/game";
import dataset from "@/data/tickets.json";
import { audio } from "@/services/audio";

import HeaderBar from "@/components/HeaderBar.vue";
import MenuScreen from "@/components/MenuScreen.vue";
import PrologueScreen from "@/components/PrologueScreen.vue";
import ShiftReport from "@/components/ShiftReport.vue";
import WindowFrame from "@/components/WindowFrame.vue";
import ModerationWindow from "@/components/ModerationWindow.vue";
import SearchWindow from "@/components/SearchWindow.vue";
import HandbookWindow from "@/components/HandbookWindow.vue";

const gameStage = ref<GameStage>("menu");
const dailyRent = 40.0;

const tickets = ref<Ticket[]>(dataset as Ticket[]);
const currentIndex = ref(0);
const currentTicket = ref<Ticket | null>(null);

const elapsedTicketTime = ref(0);
let ticketTimer: number | null = null;

const shiftGains = ref(0);
const shiftLosses = ref(0);
const decisionsLog = ref<LoggedDecision[]>([]);

const stats = ref<PlayerStats>({
  funds: 50.0,
  mentalHealth: 100,
  hrStrikes: 0,
  day: 1,
});

// Gestionnaire de fenêtres du bureau OmniOS
let topZ = 10;
const windows = reactive<Record<string, WindowState>>({
  moderation: {
    id: "moderation",
    title: "File de Modération Active",
    icon: "📋",
    isOpen: true,
    isMinimized: false,
    zIndex: 10,
    x: 40,
    y: 70,
    width: 680,
    height: 720,
  },
  search: {
    id: "search",
    title: "OmniSearch // Surveillance Intranet",
    icon: "🔍",
    isOpen: true,
    isMinimized: false,
    zIndex: 9,
    x: 740,
    y: 70,
    width: 580,
    height: 420,
  },
  handbook: {
    id: "handbook",
    title: "Directives & Protocoles RH",
    icon: "📕",
    isOpen: true,
    isMinimized: false,
    zIndex: 8,
    x: 740,
    y: 505,
    width: 580,
    height: 285,
  },
});

// Paliers de rémunération selon le temps passé
const currentTierReward = computed(() => {
  const t = elapsedTicketTime.value;
  if (t < 8.0) return 9.0;
  if (t < 20.0) return 6.0;
  if (t < 45.0) return 3.5;
  return 1.5;
});

const currentTimeString = ref("19:42");

function updateClock() {
  const now = new Date();
  currentTimeString.value = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

// Window Management
function focusWindow(key: string) {
  topZ++;
  windows[key].zIndex = topZ;
}

function minimizeWindow(key: string) {
  windows[key].isMinimized = true;
}

function closeWindow(key: string) {
  windows[key].isOpen = false;
}

function moveWindow(key: string, coords: { x: number; y: number }) {
  windows[key].x = coords.x;
  windows[key].y = coords.y;
}

function toggleTaskWindow(key: string) {
  audio.playClick(800);
  if (!windows[key].isOpen) {
    windows[key].isOpen = true;
    windows[key].isMinimized = false;
    focusWindow(key);
  } else if (windows[key].isMinimized) {
    windows[key].isMinimized = false;
    focusWindow(key);
  } else {
    windows[key].isMinimized = true;
  }
}

function reopenAllWindows() {
  audio.playClick(1000);
  Object.keys(windows).forEach((k) => {
    windows[k].isOpen = true;
    windows[k].isMinimized = false;
    focusWindow(k);
  });
}

// Game Flow
function startPrologue() {
  audio.playClick(1000);
  gameStage.value = "prologue";
}

function startGameplay() {
  audio.playClick(1200);
  gameStage.value = "playing";
  loadCurrentTicket();
  startTicketTimer();
}

function loadCurrentTicket() {
  if (currentIndex.value >= tickets.value.length) {
    concludeShift();
    return;
  }
  currentTicket.value = tickets.value[currentIndex.value];
  elapsedTicketTime.value = 0;
}

function startTicketTimer() {
  if (ticketTimer) clearInterval(ticketTimer);
  ticketTimer = window.setInterval(() => {
    elapsedTicketTime.value += 0.1;
  }, 100);
}

function submitDecision(action: ModerationAction) {
  if (!currentTicket.value || gameStage.value !== "playing") return;
  audio.playClick(action === "approve" ? 900 : 380);

  const rule = currentTicket.value.rule;
  const corporateTarget = currentTicket.value.corporateDirectiveOverride || rule.companyStandard;
  const isCorporateCompliant = action === corporateTarget;
  const isEthical = action === rule.ethicalStandard;
  const reward = currentTierReward.value;

  if (isCorporateCompliant) {
    stats.value.funds += reward;
    shiftGains.value += reward;
  } else {
    // Audit RH en cas de désobéissance aux actionnaires
    if (Math.random() < 0.65) {
      stats.value.hrStrikes += 1;
      stats.value.funds -= 12.0;
      shiftLosses.value += 12.0;
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
    timeSpentSeconds: Math.round(elapsedTicketTime.value),
    rewardEarned: isCorporateCompliant ? reward : 0,
    headlineGenerated: consequence.newsHeadline,
    wasCompliant: isCorporateCompliant,
    wasEthical: isEthical,
  });

  currentIndex.value++;
  loadCurrentTicket();
}

function concludeShift() {
  gameStage.value = "shift_report";
  if (ticketTimer) clearInterval(ticketTimer);
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
  startTicketTimer();
}

function onKeyDown(e: KeyboardEvent) {
  if (gameStage.value !== "playing") return;
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

  if (e.key === "q" || e.key === "Q") {
    submitDecision("reject");
  } else if (e.key === "e" || e.key === "E") {
    submitDecision("approve");
  }
}

onMounted(() => {
  updateClock();
  setInterval(updateClock, 10000);
  window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
  if (ticketTimer) clearInterval(ticketTimer);
  window.removeEventListener("keydown", onKeyDown);
});
</script>

<style scoped>
.desktop-screen {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: radial-gradient(circle at 50% 50%, #0d131a 0%, #06080b 100%);
  position: relative;
  overflow: hidden;
}

.desktop-workspace {
  flex: 1;
  position: relative;
  overflow: hidden;
}

/* Barre des tâches */
.taskbar {
  height: 44px;
  background-color: #0b0f14;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.85rem;
  z-index: 999;
}

.taskbar-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.start-btn {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  color: #fff;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-family: ui-monospace, monospace;
}

.start-btn:hover {
  background-color: #1a222c;
  border-color: var(--c-sky);
}

.running-apps {
  display: flex;
  gap: 0.35rem;
}

.task-item {
  background-color: transparent;
  border: 1px solid transparent;
  color: var(--text-dim);
  padding: 0.35rem 0.65rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s;
}

.task-item:hover {
  background-color: var(--bg-card);
  color: #fff;
}

.task-item.active {
  background-color: var(--bg-card);
  border-color: var(--c-sky);
  color: var(--c-sky);
  font-weight: 700;
}

.taskbar-right {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: ui-monospace, monospace;
}

.clock-display {
  color: #fff;
  font-weight: 700;
}
</style>
