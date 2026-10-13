<template>
  <div class="terminal-app">
    <!-- ÉCRAN 1 : ACCUEIL -->
    <MenuScreen v-if="gameStage === 'menu'" @start="startPrologue" />

    <!-- ÉCRAN 2 : PROLOGUE -->
    <PrologueScreen v-else-if="gameStage === 'prologue'" @proceed="startGameplay" />

    <!-- ÉCRAN INTERMÉDIAIRE : TERMINAL GHOST -->
    <HackerTerminal
      v-else-if="gameStage === 'hacker_terminal'"
      @finished="onHackerTerminalFinished"
    />

    <!-- ÉCRAN 3 : BUREAU OMNIOS -->
    <div v-else-if="gameStage === 'playing'" class="desktop-screen" @click="closeStartMenu">
      <InGameEventModal :event="activeEvent" />

      <!-- Alerte de balayage de surveillance RH -->
      <div v-if="isHrScanning" class="hr-scan-overlay">
        <div class="scan-alert-box">
          <div class="scan-title">{{ t("scan_title") }}</div>
          <p>{{ t("scan_desc") }}</p>
          <div class="scan-countdown">
            {{ t("scan_prompt") }}
            <strong>{{ scanCountdown.toFixed(1) }}s</strong>
          </div>
        </div>
      </div>

      <!-- Espace bureau avec raccourcis -->
      <div class="desktop-workspace">
        <div class="desktop-shortcuts">
          <div class="desktop-icon" @dblclick="restoreWindow('moderation')">
            <span class="icon-glyph">📋</span>
            <span class="icon-label">{{ t("win_moderation") }}</span>
          </div>
          <div class="desktop-icon" @dblclick="restoreWindow('search')">
            <span class="icon-glyph">🔍</span>
            <span class="icon-label">{{ t("win_search") }}</span>
          </div>
          <div class="desktop-icon" @dblclick="restoreWindow('handbook')">
            <span class="icon-glyph">📕</span>
            <span class="icon-label">{{ t("win_handbook") }}</span>
          </div>
          <div class="desktop-icon" @dblclick="restoreWindow('status')">
            <span class="icon-glyph">👤</span>
            <span class="icon-label">{{ t("win_status") }}</span>
          </div>
          <div v-if="isDarknetInstalled" class="desktop-icon" @dblclick="restoreWindow('darknet')">
            <span class="icon-glyph">🧅</span>
            <span class="icon-label">{{ t("win_tornet") }}</span>
          </div>
        </div>

        <!-- 1. File de Modération -->
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
            @decide="submitDecision"
            @search="handleQuickSearch"
          />
        </WindowFrame>

        <!-- 2. OmniSearch Officiel -->
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
          <SearchWindow
            v-if="currentTicket"
            :current-ticket="currentTicket"
            :initial-query="activeSearchQuery"
          />
        </WindowFrame>

        <!-- 3. Web Libre Clandestin (TorNet) -->
        <WindowFrame
          v-if="isDarknetInstalled && windows.darknet.isOpen"
          :window="windows.darknet"
          :is-top-focus="topWindowId === 'darknet'"
          @focus="focusWindow('darknet')"
          @minimize="minimizeWindow('darknet')"
          @close="closeWindow('darknet')"
          @move="moveWindow('darknet', $event)"
          @resize="resizeWindow('darknet', $event)"
        >
          <DarknetWindow
            v-if="currentTicket"
            :current-ticket="currentTicket"
            :detection-risk="detectionExposure"
          />
        </WindowFrame>

        <!-- 4. Manuel RH -->
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

        <!-- 5. Moniteur Statut Agent -->
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

      <!-- Barre des tâches -->
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
                focused: topWindowId === 'moderation',
              }"
              @click="toggleTaskWindow('moderation')"
            >
              📋 {{ t("win_moderation") }}
            </button>
            <button
              class="taskbar-tab"
              :class="{
                active: windows.search.isOpen && !windows.search.isMinimized,
                focused: topWindowId === 'search',
              }"
              @click="toggleTaskWindow('search')"
            >
              🔍 {{ t("win_search") }}
            </button>
            <button
              v-if="isDarknetInstalled"
              class="taskbar-tab tab-darknet"
              :class="{
                active: windows.darknet.isOpen && !windows.darknet.isMinimized,
                focused: topWindowId === 'darknet',
              }"
              @click="toggleTaskWindow('darknet')"
            >
              🧅 {{ t("win_tornet") }}
            </button>
            <button
              class="taskbar-tab"
              :class="{
                active: windows.handbook.isOpen && !windows.handbook.isMinimized,
                focused: topWindowId === 'handbook',
              }"
              @click="toggleTaskWindow('handbook')"
            >
              📕 {{ t("win_handbook") }}
            </button>
            <button
              class="taskbar-tab"
              :class="{
                active: windows.status.isOpen && !windows.status.isMinimized,
                focused: topWindowId === 'status',
              }"
              @click="toggleTaskWindow('status')"
            >
              👤 {{ t("win_status") }}
            </button>
          </div>
        </div>

        <div class="taskbar-right">
          <div class="quick-status-badges" @click="restoreWindow('status')">
            <span class="badge-item text-emerald">💶 {{ stats.funds.toFixed(1) }} €</span>
            <span
              class="badge-item"
              :class="stats.mentalHealth < 35 ? 'text-danger' : 'text-amber'"
            >
              🧠 {{ stats.mentalHealth }}%
            </span>
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
      @restart="restartGame"
      @buy-item="handleShopPurchase"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from "vue";
import type {
  Ticket,
  PlayerStats,
  ModerationAction,
  LoggedDecision,
  GameStage,
  WindowState,
  GameEvent,
} from "@/types/game";
import dataset from "@/data/tickets.json";
import { audio } from "@/services/audio";
import { currentLang, localizeTicket, t } from "@/services/i18n";
import { GAME_EVENTS, buildEventInstance } from "@/services/eventManager";

import MenuScreen from "@/components/MenuScreen.vue";
import PrologueScreen from "@/components/PrologueScreen.vue";
import ShiftReport from "@/components/ShiftReport.vue";
import WindowFrame from "@/components/WindowFrame.vue";
import ModerationWindow from "@/components/ModerationWindow.vue";
import SearchWindow from "@/components/SearchWindow.vue";
import DarknetWindow from "@/components/DarknetWindow.vue";
import HandbookWindow from "@/components/HandbookWindow.vue";
import StatusWindow from "@/components/StatusWindow.vue";
import HackerTerminal from "@/components/HackerTerminal.vue";
import InGameEventModal from "@/components/InGameEventModal.vue";

const gameStage = ref<GameStage>("menu");
const dailyRent = 30.0;
const isStartMenuOpen = ref(false);

const allTickets = ref<Ticket[]>(dataset as Ticket[]);
const currentIndex = ref(0);
const currentTicket = ref<Ticket | null>(null);

const shiftGains = ref(0);
const shiftLosses = ref(0);
const decisionsLog = ref<LoggedDecision[]>([]);

const stats = ref<PlayerStats>({
  funds: 50.0,
  mentalHealth: 100,
  hrStrikes: 0,
  day: 1,
  reputationResistance: 0,
  reputationCorporate: 0,
  hasProxyShield: false,
});

const dayTickets = computed(() => {
  return allTickets.value.filter((t) => t.day === stats.value.day);
});

const activeEvent = ref<GameEvent | null>(null);
const activeSearchQuery = ref("");
const triggeredEventIds = ref<Set<string>>(new Set());
const shiftElapsedSeconds = ref(0);
let shiftTimerInterval: number | null = null;
let eventTriggerWatcher: number | null = null;

const isDarknetInstalled = ref(false);
const detectionExposure = ref(0);
const isHrScanning = ref(false);
const scanCountdown = ref(3.0);
let stealthInterval: number | null = null;
let hrScanInterval: number | null = null;

let topZ = 10;
const topWindowId = ref("moderation");

const windows = reactive<Record<string, WindowState>>({
  moderation: {
    id: "moderation",
    title: t("win_moderation"),
    icon: "📋",
    isOpen: true,
    isMinimized: false,
    zIndex: 10,
    x: 25,
    y: 15,
    width: 650,
    height: 760,
  },
  search: {
    id: "search",
    title: t("win_search"),
    icon: "🔍",
    isOpen: true,
    isMinimized: false,
    zIndex: 9,
    x: 700,
    y: 15,
    width: 580,
    height: 380,
  },
  darknet: {
    id: "darknet",
    title: t("win_tornet"),
    icon: "🧅",
    isOpen: false,
    isMinimized: false,
    zIndex: 11,
    x: 700,
    y: 200,
    width: 620,
    height: 480,
  },
  handbook: {
    id: "handbook",
    title: t("win_handbook"),
    icon: "📕",
    isOpen: true,
    isMinimized: false,
    zIndex: 8,
    x: 700,
    y: 415,
    width: 580,
    height: 250,
  },
  status: {
    id: "status",
    title: t("win_status"),
    icon: "👤",
    isOpen: true,
    isMinimized: false,
    zIndex: 7,
    x: 700,
    y: 680,
    width: 580,
    height: 270,
  },
});

const currentTimeString = ref("19:42");

function updateClock() {
  const now = new Date();
  currentTimeString.value = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function handleQuickSearch(query: string) {
  activeSearchQuery.value = query;
  windows.search.isOpen = true;
  windows.search.isMinimized = false;
  focusWindow("search");
}

function startSurveillanceLoop() {
  stealthInterval = window.setInterval(() => {
    if (gameStage.value !== "playing") return;

    const rate = stats.value.hasProxyShield ? 2 : 4;
    if (isDarknetInstalled.value && windows.darknet.isOpen && !windows.darknet.isMinimized) {
      detectionExposure.value = Math.min(100, detectionExposure.value + rate);
    } else {
      detectionExposure.value = Math.max(0, detectionExposure.value - 6);
    }

    if (detectionExposure.value > 80 && !isHrScanning.value) {
      triggerHrAuditScan();
    }
  }, 1000);

  hrScanInterval = window.setInterval(() => {
    if (gameStage.value === "playing" && isDarknetInstalled.value && !isHrScanning.value) {
      if (Math.random() < 0.5) {
        triggerHrAuditScan();
      }
    }
  }, 45000);
}

function triggerHrAuditScan() {
  isHrScanning.value = true;
  scanCountdown.value = 3.2;
  audio.playAlert();

  const scanTimer = setInterval(() => {
    scanCountdown.value -= 0.1;
    if (scanCountdown.value <= 0) {
      clearInterval(scanTimer);
      isHrScanning.value = false;

      if (windows.darknet.isOpen && !windows.darknet.isMinimized) {
        audio.playAlert();
        stats.value.hrStrikes += 1;
        stats.value.funds -= 15.0;
        shiftLosses.value += 15.0;
      }
    }
  }, 100);
}

function evaluateTriggers() {
  if (stats.value.day < 2 || activeEvent.value !== null) return;

  for (const eventDef of GAME_EVENTS) {
    if (triggeredEventIds.value.has(eventDef.id)) continue;

    const cond = eventDef.trigger;
    const isDayEligible = stats.value.day >= cond.minDay;
    const isTimeEligible = shiftElapsedSeconds.value >= cond.minSecondsElapsed;
    const isConditionMet = cond.check(stats.value, currentIndex.value);

    if (isDayEligible && isTimeEligible && isConditionMet) {
      triggeredEventIds.value.add(eventDef.id);
      activeEvent.value = buildEventInstance(eventDef, stats.value, () => {
        activeEvent.value = null;
      });
      audio.playAlert();
      break;
    }
  }
}

function startShiftTimers() {
  shiftElapsedSeconds.value = 0;
  if (shiftTimerInterval) clearInterval(shiftTimerInterval);
  shiftTimerInterval = window.setInterval(() => {
    shiftElapsedSeconds.value++;
  }, 1000);

  if (eventTriggerWatcher) clearInterval(eventTriggerWatcher);
  eventTriggerWatcher = window.setInterval(() => {
    if (gameStage.value === "playing") {
      evaluateTriggers();
    }
  }, 3000);
}

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

function startPrologue() {
  audio.playClick(1000);
  gameStage.value = "prologue";
}

function startGameplay() {
  audio.playClick(1200);
  gameStage.value = "playing";
  loadCurrentTicket();
  startSurveillanceLoop();
  startShiftTimers();
}

function loadCurrentTicket() {
  const currentList = dayTickets.value;
  if (currentIndex.value >= currentList.length) {
    concludeShift();
    return;
  }
  const rawTicket = currentList[currentIndex.value];
  currentTicket.value = localizeTicket(rawTicket, currentLang.value);
}

function submitDecision(action: ModerationAction) {
  if (!currentTicket.value || gameStage.value !== "playing") return;
  audio.playClick(action === "approve" ? 900 : 380);

  const rule = currentTicket.value.rule;
  const corporateTarget = currentTicket.value.corporateDirectiveOverride || rule.companyStandard;
  const isCorporateCompliant = action === corporateTarget;
  const isEthical = action === rule.ethicalStandard;
  const flatReward = 8.0;

  if (isCorporateCompliant) {
    stats.value.funds += flatReward;
    shiftGains.value += flatReward;
    stats.value.reputationCorporate += 1;
  } else {
    stats.value.reputationResistance += 1;
    if (Math.random() < 0.45) {
      stats.value.hrStrikes += 1;
      stats.value.funds -= 10.0;
      shiftLosses.value += 10.0;
      audio.playAlert();
    }
  }

  const cons = currentTicket.value.consequences;
  let consequence = cons.onReject;
  if (action === "approve") consequence = cons.onApprove;
  else if (action === "shadowban" && cons.onShadowban) consequence = cons.onShadowban;
  else if (action === "warn" && cons.onWarn) consequence = cons.onWarn;

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
    rewardEarned: isCorporateCompliant ? flatReward : 0,
    headlineGenerated: consequence.newsHeadline,
    wasCompliant: isCorporateCompliant,
    wasEthical: isEthical,
    usedDarknet: isDarknetInstalled.value && windows.darknet.isOpen,
  });

  currentIndex.value++;
  loadCurrentTicket();
  evaluateTriggers();
}

function handleShopPurchase(item: "meal" | "stim" | "vpn" | "bribe") {
  if (item === "meal" && stats.value.funds >= 12.0) {
    stats.value.funds -= 12.0;
    stats.value.mentalHealth = Math.min(100, stats.value.mentalHealth + 20);
    audio.playClick(950);
  } else if (item === "stim" && stats.value.funds >= 20.0) {
    stats.value.funds -= 20.0;
    stats.value.mentalHealth = Math.min(100, stats.value.mentalHealth + 40);
    audio.playClick(1100);
  } else if (item === "vpn" && stats.value.funds >= 30.0 && !stats.value.hasProxyShield) {
    stats.value.funds -= 30.0;
    stats.value.hasProxyShield = true;
    audio.playClick(1300);
  } else if (item === "bribe" && stats.value.funds >= 25.0 && stats.value.hrStrikes > 0) {
    stats.value.funds -= 25.0;
    stats.value.hrStrikes = Math.max(0, stats.value.hrStrikes - 1);
    audio.playClick(600);
  }
}

function concludeShift() {
  gameStage.value = "shift_report";
  stats.value.funds -= dailyRent;
  isStartMenuOpen.value = false;
  activeEvent.value = null;

  if (stealthInterval) clearInterval(stealthInterval);
  if (hrScanInterval) clearInterval(hrScanInterval);
  if (shiftTimerInterval) clearInterval(shiftTimerInterval);
  if (eventTriggerWatcher) clearInterval(eventTriggerWatcher);
}

function startNextDay() {
  if (stats.value.day === 1 && !isDarknetInstalled.value) {
    gameStage.value = "hacker_terminal";
    return;
  }

  stats.value.day++;
  currentIndex.value = 0;
  shiftGains.value = 0;
  shiftLosses.value = 0;
  decisionsLog.value = [];
  gameStage.value = "playing";
  loadCurrentTicket();
  startSurveillanceLoop();
  startShiftTimers();
}

function onHackerTerminalFinished() {
  isDarknetInstalled.value = true;
  stats.value.day = 2;
  currentIndex.value = 0;
  shiftGains.value = 0;
  shiftLosses.value = 0;
  decisionsLog.value = [];
  gameStage.value = "playing";
  loadCurrentTicket();
  startSurveillanceLoop();
  startShiftTimers();
  restoreWindow("darknet");
}

function restartGame() {
  stats.value = {
    funds: 50.0,
    mentalHealth: 100,
    hrStrikes: 0,
    day: 1,
    reputationResistance: 0,
    reputationCorporate: 0,
    hasProxyShield: false,
  };
  currentIndex.value = 0;
  shiftGains.value = 0;
  shiftLosses.value = 0;
  decisionsLog.value = [];
  isDarknetInstalled.value = false;
  triggeredEventIds.value.clear();
  gameStage.value = "menu";
}

function onKeyDown(e: KeyboardEvent) {
  if (gameStage.value !== "playing") return;
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

  // Touche Panique : [Espace] masque instantanément TorNet
  if (e.code === "Space") {
    e.preventDefault();
    if (windows.darknet.isOpen && !windows.darknet.isMinimized) {
      windows.darknet.isMinimized = true;
      audio.playPanicEvade();
    }
    return;
  }

  if (e.key === "q" || e.key === "Q") {
    submitDecision("reject");
  } else if (e.key === "w" || e.key === "W") {
    submitDecision("shadowban");
  } else if (e.key === "a" || e.key === "A") {
    submitDecision("warn");
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
  if (stealthInterval) clearInterval(stealthInterval);
  if (hrScanInterval) clearInterval(hrScanInterval);
  if (shiftTimerInterval) clearInterval(shiftTimerInterval);
  if (eventTriggerWatcher) clearInterval(eventTriggerWatcher);
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

.hr-scan-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(239, 68, 68, 0.25);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.scan-alert-box {
  background-color: #07090c;
  border: 2px solid #ef4444;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.8);
}

.scan-title {
  color: #ef4444;
  font-weight: 800;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-family: ui-monospace, monospace;
}

.scan-countdown {
  margin-top: 0.75rem;
  font-size: 0.95rem;
  color: #fff;
  font-family: ui-monospace, monospace;
}

.scan-countdown strong {
  color: #ef4444;
  font-size: 1.2rem;
}

.desktop-workspace {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.desktop-shortcuts {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  z-index: 1;
}

.desktop-icon {
  position: relative;
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

.tab-darknet.active {
  border-color: var(--c-emerald);
  color: var(--c-emerald);
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

.clock-indicator {
  color: #f1f5f9;
  font-weight: 700;
  font-size: 0.75rem;
  font-family: ui-monospace, monospace;
}
</style>
