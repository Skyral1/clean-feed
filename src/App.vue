<template>
  <div class="terminal-app">
    <!-- ÉCRAN 1 : ACCUEIL -->
    <MenuScreen v-if="gameStage === 'menu'" @start="startPrologue" />

    <!-- ÉCRAN 2 : PROLOGUE -->
    <PrologueScreen v-else-if="gameStage === 'prologue'" @proceed="startGameplay" />

    <!-- NOUVEL ÉCRAN : INTERROGATOIRE DU HACKER GHOST APRES LE JOUR 1 -->
    <HackerTerminal
      v-else-if="gameStage === 'hacker_terminal'"
      @finished="onHackerTerminalFinished"
    />

    <!-- ÉCRAN 3 : BUREAU OMNIOS COMPLET -->
    <div v-else-if="gameStage === 'playing'" class="desktop-screen" @click="closeStartMenu">
      <!-- Modal d'événement inopiné en cours de partie -->
      <InGameEventModal :event="activeEvent" />

      <!-- Alerte de balayage de surveillance RH en plein écran -->
      <div v-if="isHrScanning" class="hr-scan-overlay">
        <div class="scan-alert-box">
          <div class="scan-title">🚨 BALAYAGE DE CONFORMITÉ RH EN COURS</div>
          <p>
            L'algorithme de surveillance scanne votre bureau à la recherche de logiciels interdits !
          </p>
          <div class="scan-countdown">
            FERMEZ OU RÉDUISEZ LE WEB LIBRE :
            <strong>{{ scanCountdown.toFixed(1) }}s</strong>
          </div>
        </div>
      </div>

      <!-- Espace bureau avec icônes -->
      <div class="desktop-workspace">
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
          <div class="desktop-icon" @dblclick="restoreWindow('chat')">
            <span class="icon-glyph">💬</span>
            <span class="icon-label">GhostChat</span>
            <span v-if="unreadChat" class="unread-dot"></span>
          </div>
          <div v-if="isDarknetInstalled" class="desktop-icon" @dblclick="restoreWindow('darknet')">
            <span class="icon-glyph">🧅</span>
            <span class="icon-label">TorNet</span>
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
          <ModerationWindow v-if="currentTicket" :ticket="currentTicket" @decide="submitDecision" />
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
          <SearchWindow v-if="currentTicket" :current-ticket="currentTicket" />
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

        <!-- 4. Messagerie Sécurisée GhostChat -->
        <WindowFrame
          v-if="windows.chat.isOpen"
          :window="windows.chat"
          :is-top-focus="topWindowId === 'chat'"
          @focus="focusWindow('chat')"
          @minimize="minimizeWindow('chat')"
          @close="closeWindow('chat')"
          @move="moveWindow('chat', $event)"
          @resize="resizeWindow('chat', $event)"
        >
          <GhostChatWindow
            :messages="chatMessages"
            :is-tool-installed="isDarknetInstalled"
            @install="installDarknetTool"
          />
        </WindowFrame>

        <!-- 5. Manuel RH -->
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

        <!-- 6. Moniteur Statut Agent -->
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
              Solde : {{ stats.funds.toFixed(2) }} € | Stabilité : {{ stats.mentalHealth }}%
            </div>
          </div>
        </div>

        <div class="start-app-list">
          <button class="start-app-item" @click="restoreWindow('moderation')">
            <span>📋</span> File de Modération
          </button>
          <button class="start-app-item" @click="restoreWindow('search')">
            <span>🔍</span> OmniSearch Officiel
          </button>
          <button class="start-app-item" @click="restoreWindow('handbook')">
            <span>📕</span> Manuel de Compliance RH
          </button>
          <button class="start-app-item" @click="restoreWindow('chat')">
            <span>💬</span> GhostChat Sécurisé
          </button>
          <button
            v-if="isDarknetInstalled"
            class="start-app-item text-emerald"
            @click="restoreWindow('darknet')"
          >
            <span>🧅</span> TorNet Gateway (Non censuré)
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
                focused: topWindowId === 'moderation',
              }"
              @click="toggleTaskWindow('moderation')"
            >
              📋 Modération
            </button>
            <button
              class="taskbar-tab"
              :class="{
                active: windows.search.isOpen && !windows.search.isMinimized,
                focused: topWindowId === 'search',
              }"
              @click="toggleTaskWindow('search')"
            >
              🔍 OmniSearch
            </button>
            <button
              class="taskbar-tab"
              :class="{
                active: windows.chat.isOpen && !windows.chat.isMinimized,
                focused: topWindowId === 'chat',
              }"
              @click="toggleTaskWindow('chat')"
            >
              💬 GhostChat
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
              🧅 TorNet
            </button>
            <button
              class="taskbar-tab"
              :class="{
                active: windows.handbook.isOpen && !windows.handbook.isMinimized,
                focused: topWindowId === 'handbook',
              }"
              @click="toggleTaskWindow('handbook')"
            >
              📕 Manuel RH
            </button>
            <button
              class="taskbar-tab"
              :class="{
                active: windows.status.isOpen && !windows.status.isMinimized,
                focused: topWindowId === 'status',
              }"
              @click="toggleTaskWindow('status')"
            >
              👤 Statut Agent
            </button>
          </div>
        </div>

        <div class="taskbar-right">
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
import { ref, reactive, onMounted, onUnmounted } from "vue";
import type {
  Ticket,
  PlayerStats,
  ModerationAction,
  LoggedDecision,
  GameStage,
  WindowState,
  ChatMessage,
  GameEvent,
} from "@/types/game";
import dataset from "@/data/tickets.json";
import { audio } from "@/services/audio";

import MenuScreen from "@/components/MenuScreen.vue";
import PrologueScreen from "@/components/PrologueScreen.vue";
import ShiftReport from "@/components/ShiftReport.vue";
import WindowFrame from "@/components/WindowFrame.vue";
import ModerationWindow from "@/components/ModerationWindow.vue";
import SearchWindow from "@/components/SearchWindow.vue";
import DarknetWindow from "@/components/DarknetWindow.vue";
import GhostChatWindow from "@/components/GhostChatWindow.vue";
import HandbookWindow from "@/components/HandbookWindow.vue";
import StatusWindow from "@/components/StatusWindow.vue";
import HackerTerminal from "@/components/HackerTerminal.vue";
import InGameEventModal from "@/components/InGameEventModal.vue";

const gameStage = ref<GameStage>("menu");
const dailyRent = 30.0;
const isStartMenuOpen = ref(false);

const tickets = ref<Ticket[]>(dataset as Ticket[]);
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
});

// Événements dynamiques
const activeEvent = ref<GameEvent | null>(null);
let eventTimeout: number | null = null;

// Éléments du piratage et de la surveillance
const isDarknetInstalled = ref(false);
const unreadChat = ref(true);
const detectionExposure = ref(0);
const isHrScanning = ref(false);
const scanCountdown = ref(3.0);
let stealthInterval: number | null = null;
let hrScanInterval: number | null = null;

const chatMessages = ref<ChatMessage[]>([
  {
    sender: "ghost",
    text: "Agent 9482, écoutez-moi attentivement. OmniFeed censure sciemment les rapports sanitaires et étouffe les alertes de leurs actionnaires.",
    timestamp: "19:40",
  },
  {
    sender: "ghost",
    text: "J'ai déposé un outil d'injection dans ce canal. Installez TorNet pour accéder au Web non filtré. Mais attention : réduisez la fenêtre immédiatement lorsque le scan RH se déclenche !",
    timestamp: "19:41",
  },
]);

// Windows Layout
let topZ = 10;
const topWindowId = ref("moderation");

const windows = reactive<Record<string, WindowState>>({
  moderation: {
    id: "moderation",
    title: "File de Modération Active",
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
    title: "OmniSearch // Intranet Officiel",
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
    title: "TorNet Gateway // Web Libre Clandestin",
    icon: "🧅",
    isOpen: false,
    isMinimized: false,
    zIndex: 11,
    x: 700,
    y: 200,
    width: 620,
    height: 480,
  },
  chat: {
    id: "chat",
    title: "GhostChat // Canal Chiffré",
    icon: "💬",
    isOpen: false,
    isMinimized: false,
    zIndex: 12,
    x: 350,
    y: 150,
    width: 460,
    height: 460,
  },
  handbook: {
    id: "handbook",
    title: "Directives & Protocoles RH",
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
    title: "Moniteur d'Agent RH // Métriques",
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

// Installation de l'outil pirate
function installDarknetTool() {
  audio.playClick(1400);
  isDarknetInstalled.value = true;
  windows.darknet.isOpen = true;
  windows.darknet.isMinimized = false;
  focusWindow("darknet");
  chatMessages.value.push({
    sender: "ghost",
    text: "TorNet est injecté dans votre session. Vous pouvez maintenant consulter la vérité brute sur chaque publication. Gardez l'œil ouvert.",
    timestamp: "19:43",
  });
}

// Surveillance RH et furtivité
function startSurveillanceLoop() {
  stealthInterval = window.setInterval(() => {
    if (gameStage.value !== "playing") return;

    if (isDarknetInstalled.value && windows.darknet.isOpen && !windows.darknet.isMinimized) {
      detectionExposure.value = Math.min(100, detectionExposure.value + 4);
    } else {
      detectionExposure.value = Math.max(0, detectionExposure.value - 6);
    }

    if (detectionExposure.value > 80 && !isHrScanning.value) {
      triggerHrAuditScan();
    }
  }, 1000);

  hrScanInterval = window.setInterval(() => {
    if (gameStage.value === "playing" && isDarknetInstalled.value && !isHrScanning.value) {
      if (Math.random() < 0.6) {
        triggerHrAuditScan();
      }
    }
  }, 50000);
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
        chatMessages.value.push({
          sender: "ghost",
          text: "ALERTE : Votre poste vient d'être repéré ! Cachez immédiatement TorNet la prochaine fois !",
          timestamp: "19:44",
        });
      }
    }
  }, 100);
}

// Système d'événements aléatoires
function triggerRandomEvent() {
  const eventPool: GameEvent[] = [
    {
      id: "ddos_attack",
      title: "Attaque par Déni de Service (DDoS)",
      type: "ddos",
      description:
        "Les serveurs OmniFeed saturent sous les requêtes de cyber-militants. Vos écrans clignotent et le système ralentit.",
      choices: [
        {
          label: "Relancer les caches d'urgence (-15.0 €)",
          action: () => {
            stats.value.funds = Math.max(0, stats.value.funds - 15.0);
            activeEvent.value = null;
          },
        },
        {
          label: "Laisser saturer (-15% Stabilité mentale)",
          action: () => {
            stats.value.mentalHealth = Math.max(0, stats.value.mentalHealth - 15);
            activeEvent.value = null;
          },
        },
      ],
    },
    {
      id: "anonymous_bribe",
      title: "Proposition Clandestine",
      type: "leak",
      description:
        "Ghost vous transmet un pourboire discret en monnaie anonyme pour financer votre prochain loyer.",
      choices: [
        {
          label: "Accepter le paiement de subsistance (+20.0 €)",
          action: () => {
            stats.value.funds += 20.0;
            activeEvent.value = null;
          },
        },
        {
          label: "Refuser et purger le log (Prudence)",
          action: () => {
            activeEvent.value = null;
          },
        },
      ],
    },
  ];

  activeEvent.value = eventPool[Math.floor(Math.random() * eventPool.length)];
  audio.playAlert();
}

function checkDayEvents() {
  if (eventTimeout) clearTimeout(eventTimeout);
  eventTimeout = window.setTimeout(() => {
    if (gameStage.value === "playing") {
      triggerRandomEvent();
    }
  }, 18000);
}

// Gestion des fenêtres
function focusWindow(key: string) {
  topZ++;
  windows[key].zIndex = topZ;
  topWindowId.value = key;
  if (key === "chat") unreadChat.value = false;
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

// Déroulement de la partie
function startPrologue() {
  audio.playClick(1000);
  gameStage.value = "prologue";
}

function startGameplay() {
  audio.playClick(1200);
  gameStage.value = "playing";
  loadCurrentTicket();
  startSurveillanceLoop();
  checkDayEvents();
}

function loadCurrentTicket() {
  if (currentIndex.value >= tickets.value.length) {
    concludeShift();
    return;
  }
  currentTicket.value = tickets.value[currentIndex.value];
}

function submitDecision(action: ModerationAction) {
  if (!currentTicket.value || gameStage.value !== "playing") return;
  audio.playClick(action === "approve" ? 900 : 380);

  const rule = currentTicket.value.rule;
  const corporateTarget = currentTicket.value.corporateDirectiveOverride || rule.companyStandard;
  const isCorporateCompliant = action === corporateTarget;
  const isEthical = action === rule.ethicalStandard;
  const flatReward = 6.0;

  if (isCorporateCompliant) {
    stats.value.funds += flatReward;
    shiftGains.value += flatReward;
  } else {
    if (Math.random() < 0.6) {
      stats.value.hrStrikes += 1;
      stats.value.funds -= 10.0;
      shiftLosses.value += 10.0;
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
    rewardEarned: isCorporateCompliant ? flatReward : 0,
    headlineGenerated: consequence.newsHeadline,
    wasCompliant: isCorporateCompliant,
    wasEthical: isEthical,
    usedDarknet: isDarknetInstalled.value && windows.darknet.isOpen,
  });

  currentIndex.value++;
  loadCurrentTicket();
}

function concludeShift() {
  gameStage.value = "shift_report";
  stats.value.funds -= dailyRent;
  isStartMenuOpen.value = false;
  activeEvent.value = null;
  if (stealthInterval) clearInterval(stealthInterval);
  if (hrScanInterval) clearInterval(hrScanInterval);
  if (eventTimeout) clearTimeout(eventTimeout);
}

function startNextDay() {
  // Après le Jour 1, le hacker Ghost pirate la machine
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
  checkDayEvents();
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
  restoreWindow("chat");
  checkDayEvents();
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
  if (stealthInterval) clearInterval(stealthInterval);
  if (hrScanInterval) clearInterval(hrScanInterval);
  if (eventTimeout) clearTimeout(eventTimeout);
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

/* Alerte de balayage RH */
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

/* Raccourcis bureau */
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

.desktop-icon.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.unread-dot {
  position: absolute;
  top: 6px;
  right: 18px;
  width: 10px;
  height: 10px;
  background-color: var(--c-danger);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--c-danger);
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
  background-color: #1e2938;
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
