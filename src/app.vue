<template>
  <div class="terminal-app">
    <!-- ÉCRAN 1 : ACCUEIL -->
    <MenuScreen v-if="gameStage === 'menu'" @start="startPrologue" />

    <!-- ÉCRAN 2 : PROLOGUE -->
    <PrologueScreen v-else-if="gameStage === 'prologue'" @proceed="startGameplay" />

    <!-- ÉCRAN 3 : ENVIRONNEMENT PLEIN ÉCRAN OMNIOS -->
    <div v-else-if="gameStage === 'playing'" class="desktop-screen" @click="closeStartMenu">
      <!-- Espace du bureau virtuel (100% hauteur jusqu'à la barre des tâches) -->
      <div class="desktop-workspace">
        <!-- Raccourcis du bureau -->
        <div class="desktop-shortcuts">
          <div class="desktop-icon" @dblclick="restoreWindow('moderation')">
            <span class="icon-glyph">📋</span>
            <span class="icon-label">Modération</span>
          </div>
          <div class="desktop-icon" @dblclick="restoreWindow('search')">
            <span class="icon-glyph">🔍</span>
            <span class="icon-label">OmniSearch</span>
          </div>
          <div class="desktop-icon" @dblclick="restoreWindow('handbook')">
            <span class="icon-glyph">📕</span>
            <span class="icon-label">Manuel RH</span>
          </div>
          <div class="desktop-icon" @dblclick="restoreWindow('status')">
            <span class="icon-glyph">👤</span>
            <span class="icon-label">Moniteur Agent</span>
          </div>
          <div class="desktop-icon disabled">
            <span class="icon-glyph">🗑️</span>
            <span class="icon-label">Corbeille</span>
          </div>
        </div>

        <!-- Fenêtre 1 : File de Modération -->
        <WindowFrame
          v-if="windows.moderation.isOpen"
          :window="windows.moderation"
          :is-top-focus="topWindowId === 'moderation'"
          @focus="focusWindow('moderation')"
          @minimize="minimizeWindow('moderation')"
          @close="closeWindow('moderation')"
          @move="moveWindow('moderation', $event)"
          @resize="resizeWindow('moderation', $event)"
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
          :is-top-focus="topWindowId === 'search'"
          @focus="focusWindow('search')"
          @minimize="minimizeWindow('search')"
          @close="closeWindow('search')"
          @move="moveWindow('search', $event)"
          @resize="resizeWindow('search', $event)"
        >
          <SearchWindow v-if="currentTicket" :current-ticket="currentTicket" />
        </WindowFrame>

        <!-- Fenêtre 3 : Manuel des Directives RH -->
        <WindowFrame
          v-if="windows.handbook.isOpen"
          :window="windows.handbook"
          :is-top-focus="topWindowId === 'handbook'"
          @focus="focusWindow('handbook')"
          @minimize="minimizeWindow('handbook')"
          @close="closeWindow('handbook')"
          @move="moveWindow('handbook', $event)"
          @resize="resizeWindow('handbook', $event)"
        >
          <HandbookWindow v-if="currentTicket" :ticket="currentTicket" />
        </WindowFrame>

        <!-- Fenêtre 4 : Moniteur d'Agent RH (Solde, Santé, Strikes) -->
        <WindowFrame
          v-if="windows.status.isOpen"
          :window="windows.status"
          :is-top-focus="topWindowId === 'status'"
          @focus="focusWindow('status')"
          @minimize="minimizeWindow('status')"
          @close="closeWindow('status')"
          @move="moveWindow('status', $event)"
          @resize="resizeWindow('status', $event)"
        >
          <StatusWindow
            :stats="stats"
            :daily-rent="dailyRent"
            :shift-gains="shiftGains"
            :shift-losses="shiftLosses"
          />
        </WindowFrame>
      </div>

      <!-- Menu Démarrer -->
      <div v-if="isStartMenuOpen" class="start-menu-popup" @click.stop>
        <div class="start-user-box" @click="restoreWindow('status')">
          <div class="user-avatar">👤</div>
          <div>
            <div class="user-name">Agent #9482-TX</div>
            <div class="user-sub">
              Solde : {{ stats.funds.toFixed(2) }} € | Santé : {{ stats.mentalHealth }}%
            </div>
          </div>
        </div>

        <div class="start-app-list">
          <button class="start-app-item" @click="restoreWindow('moderation')">
            <span>📋</span> File de Modération en direct
          </button>
          <button class="start-app-item" @click="restoreWindow('search')">
            <span>🔍</span> OmniSearch Base centrale
          </button>
          <button class="start-app-item" @click="restoreWindow('handbook')">
            <span>📕</span> Manuel de Compliance RH
          </button>
          <button class="start-app-item" @click="restoreWindow('status')">
            <span>👤</span> Moniteur de Statut & Solde
          </button>
        </div>

        <div class="start-menu-footer">
          <button class="btn-lock" @click="concludeShift">
            🔒 Clôturer le shift et payer le loyer
          </button>
        </div>
      </div>

      <!-- Barre des tâches inférieure -->
      <nav class="taskbar">
        <div class="taskbar-left">
          <button
            class="start-button"
            :class="{ active: isStartMenuOpen }"
            @click.stop="isStartMenuOpen = !isStartMenuOpen"
          >
            <span class="start-logo">❖</span> OmniOS
          </button>

          <div class="running-task-list">
            <button
              class="taskbar-tab"
              :class="{
                active: windows.moderation.isOpen && !windows.moderation.isMinimized,
                focused: topWindowId === 'moderation' && !windows.moderation.isMinimized,
              }"
              @click="toggleTaskWindow('moderation')"
            >
              <span class="tab-dot"></span>
              📋 Modération
            </button>
            <button
              class="taskbar-tab"
              :class="{
                active: windows.search.isOpen && !windows.search.isMinimized,
                focused: topWindowId === 'search' && !windows.search.isMinimized,
              }"
              @click="toggleTaskWindow('search')"
            >
              <span class="tab-dot"></span>
              🔍 OmniSearch
            </button>
            <button
              class="taskbar-tab"
              :class="{
                active: windows.handbook.isOpen && !windows.handbook.isMinimized,
                focused: topWindowId === 'handbook' && !windows.handbook.isMinimized,
              }"
              @click="toggleTaskWindow('handbook')"
            >
              <span class="tab-dot"></span>
              📕 Manuel RH
            </button>
            <button
              class="taskbar-tab"
              :class="{
                active: windows.status.isOpen && !windows.status.isMinimized,
                focused: topWindowId === 'status' && !windows.status.isMinimized,
              }"
              @click="toggleTaskWindow('status')"
            >
              <span class="tab-dot"></span>
              👤 Statut Agent
            </button>
          </div>
        </div>

        <div class="taskbar-right">
          <!-- Widgets rapides dans la zone de notifications -->
          <div class="quick-status-badges" @click="restoreWindow('status')">
            <span class="badge-item text-emerald">💶 {{ stats.funds.toFixed(1) }} €</span>
            <span class="badge-item" :class="stats.mentalHealth < 35 ? 'text-danger' : 'text-amber'"
              >🧠 {{ stats.mentalHealth }}%</span
            >
            <span class="badge-item text-danger">⚠️ {{ stats.hrStrikes }}/3</span>
          </div>

          <div class="system-tray">
            <span class="clock-indicator">{{ currentTimeString }}</span>
          </div>
        </div>
      </nav>
    </div>

    <!-- ÉCRAN 4 : BILAN COMPTABLE -->
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

import MenuScreen from "@/components/MenuScreen.vue";
import PrologueScreen from "@/components/PrologueScreen.vue";
import ShiftReport from "@/components/ShiftReport.vue";
import WindowFrame from "@/components/WindowFrame.vue";
import ModerationWindow from "@/components/ModerationWindow.vue";
import SearchWindow from "@/components/SearchWindow.vue";
import HandbookWindow from "@/components/HandbookWindow.vue";
import StatusWindow from "@/components/StatusWindow.vue";

const gameStage = ref<GameStage>("menu");
const dailyRent = 40.0;
const isStartMenuOpen = ref(false);

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

// Z-Index et focus
let topZ = 10;
const topWindowId = ref("moderation");

// 4 fenêtres libres et positionnées sur toute la hauteur
const windows = reactive<Record<string, WindowState>>({
  moderation: {
    id: "moderation",
    title: "File de Modération Active",
    icon: "📋",
    isOpen: true,
    isMinimized: false,
    zIndex: 10,
    x: 30,
    y: 20,
    width: 680,
    height: 780,
  },
  search: {
    id: "search",
    title: "OmniSearch // Surveillance Intranet",
    icon: "🔍",
    isOpen: true,
    isMinimized: false,
    zIndex: 9,
    x: 740,
    y: 20,
    width: 580,
    height: 380,
  },
  handbook: {
    id: "handbook",
    title: "Directives & Protocoles RH",
    icon: "📕",
    isOpen: true,
    isMinimized: false,
    zIndex: 8,
    x: 740,
    y: 420,
    width: 580,
    height: 250,
  },
  status: {
    id: "status",
    title: "Moniteur d'Agent RH // Métriques de Survie",
    icon: "👤",
    isOpen: true,
    isMinimized: false,
    zIndex: 7,
    x: 740,
    y: 690,
    width: 580,
    height: 290,
  },
});

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
  topWindowId.value = key;
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

function resizeWindow(key: string, rect: { x: number; y: number; width: number; height: number }) {
  windows[key].x = rect.x;
  windows[key].y = rect.y;
  windows[key].width = rect.width;
  windows[key].height = rect.height;
}

function restoreWindow(key: string) {
  windows[key].isOpen = true;
  windows[key].isMinimized = false;
  focusWindow(key);
  isStartMenuOpen.value = false;
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
  } else if (topWindowId.value === key) {
    windows[key].isMinimized = true;
  } else {
    focusWindow(key);
  }
}

function closeStartMenu() {
  isStartMenuOpen.value = false;
}

// Gameplay Flow
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
  isStartMenuOpen.value = false;
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
  background:
    radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 45%),
    linear-gradient(135deg, #090e15 0%, #06090e 100%);
  position: relative;
  overflow: hidden;
}

.desktop-workspace {
  flex: 1;
  position: relative;
  overflow: hidden;
}

/* Raccourcis bureau */
.desktop-shortcuts {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 1;
}

.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  width: 76px;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 6px;
  transition: background-color 0.15s;
}

.desktop-icon:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.desktop-icon.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.icon-glyph {
  font-size: 2rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
}

.icon-label {
  font-size: 0.72rem;
  color: #e2e8f0;
  text-align: center;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

/* Menu Démarrer */
.start-menu-popup {
  position: absolute;
  bottom: 50px;
  left: 12px;
  width: 320px;
  background-color: rgba(18, 24, 32, 0.95);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.8);
  padding: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.start-user-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.75rem;
  cursor: pointer;
}

.user-avatar {
  font-size: 1.5rem;
  background-color: #1e293b;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
}
.user-sub {
  font-size: 0.7rem;
  color: var(--text-dim);
}

.start-app-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.start-app-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background: transparent;
  border: none;
  padding: 0.65rem;
  border-radius: 6px;
  color: var(--text-main);
  font-size: 0.82rem;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s;
}

.start-app-item:hover {
  background-color: rgba(56, 189, 248, 0.12);
  color: var(--c-sky);
}

.start-menu-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 0.5rem;
}

.btn-lock {
  width: 100%;
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: var(--c-danger);
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
}

.btn-lock:hover {
  background-color: var(--c-danger);
  color: #fff;
}

/* Barre des tâches */
.taskbar {
  height: 44px;
  background-color: rgba(12, 17, 24, 0.88);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.85rem;
  z-index: 999;
}

.taskbar-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.start-button {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.start-button:hover,
.start-button.active {
  background: var(--c-sky);
  color: #07090c;
  border-color: var(--c-sky);
}

.start-logo {
  font-size: 0.95rem;
}

.running-task-list {
  display: flex;
  gap: 0.35rem;
}

.taskbar-tab {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid transparent;
  color: var(--text-dim);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.15s;
}

.taskbar-tab:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.taskbar-tab.active {
  background-color: rgba(30, 41, 59, 0.6);
  border-color: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.taskbar-tab.focused {
  border-bottom: 2px solid var(--c-sky);
  color: var(--c-sky);
}

.tab-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #64748b;
}

.taskbar-tab.active .tab-dot {
  background-color: var(--c-sky);
}

.taskbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quick-status-badges {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  font-family: ui-monospace, monospace;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.quick-status-badges:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: var(--c-sky);
}

.system-tray {
  display: flex;
  align-items: center;
}

.clock-indicator {
  color: #f1f5f9;
  font-weight: 700;
  font-size: 0.75rem;
  font-family: ui-monospace, monospace;
}
</style>
