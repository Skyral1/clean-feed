<template>
  <div class="terminal-overlay">
    <div class="hacker-window">
      <div class="window-topbar">
        <span class="status-dot"></span>
        <span class="window-title">TTY_GHOST // PROXY_PORT:9050 [SESSION INTERROMPUE]</span>
      </div>

      <div class="terminal-screen" ref="scrollRef">
        <div v-for="(entry, idx) in logEntries" :key="idx" class="entry-row" :class="entry.role">
          <span class="prefix">{{
            entry.role === "ghost"
              ? "[GHOST] :"
              : entry.role === "player"
                ? "[VOUS] :"
                : "[SYSTÈME] :"
          }}</span>
          <span class="text">{{ entry.text }}</span>
        </div>

        <div v-if="isWriting" class="writing-cursor">_</div>

        <!-- Choix de dialogue du joueur -->
        <div v-if="currentPrompt && !isWriting && !isInstalling" class="options-wrapper">
          <div class="options-title">&gt; SÉLECTIONNEZ VOTRE RÉPONSE :</div>
          <button
            v-for="(option, index) in currentPrompt.options"
            :key="index"
            class="option-button"
            @click="handleSelect(option)"
          >
            [{{ index + 1 }}] {{ option.text }}
          </button>
        </div>

        <!-- Barre de progression d'installation de TorNet -->
        <div v-if="isInstalling" class="install-container">
          <div class="install-label">INJECTION DU PROXY CLANDESTIN TORNET EN COURS...</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: installProgress + '%' }"></div>
          </div>
          <div class="install-status">{{ installStatusText }}</div>
        </div>

        <button v-if="isCompleted" class="btn-continue" @click="$emit('finished')">
          TERMINER LA SESSION ET CHARGER LE BUREAU (JOUR 2) ➔
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { audio } from "@/services/audio";

const emit = defineEmits<{ (e: "finished"): void }>();

interface LogEntry {
  role: "ghost" | "player" | "sys";
  text: string;
}

interface StepOption {
  text: string;
  nextStep: string;
  loyalToFreeWeb: boolean;
}

interface StepNode {
  message: string;
  options?: StepOption[];
  triggerInstall?: boolean;
}

const logEntries = ref<LogEntry[]>([]);
const isWriting = ref(false);
const isInstalling = ref(false);
const installProgress = ref(0);
const installStatusText = ref("Préparation des descripteurs de paquets...");
const isCompleted = ref(false);
const currentPrompt = ref<StepNode | null>(null);
const scrollRef = ref<HTMLDivElement | null>(null);

const scriptTree: Record<string, StepNode> = {
  start: {
    message:
      "Inutile d'essayer de redémarrer votre terminal. Tu es le modérateur du cluster 409, n'est-ce pas ?",
    options: [
      {
        text: "Qui êtes-vous et comment avez-vous forcé ma connexion ?",
        nextStep: "who",
        loyalToFreeWeb: false,
      },
      {
        text: "Oui c'est moi. Que me voulez-vous ?",
        nextStep: "what",
        loyalToFreeWeb: true,
      },
    ],
  },
  who: {
    message:
      "On m'appelle Ghost. Je surveille les nettoyeurs d'OmniFeed. J'ai vu tes décisions au cours de ton premier quart.",
    options: [
      {
        text: "Je ne fais qu'appliquer la politique de l'entreprise.",
        nextStep: "corporate",
        loyalToFreeWeb: false,
      },
      {
        text: "Certaines suppressions imposées me semblaient effectivement douteuses.",
        nextStep: "free_web",
        loyalToFreeWeb: true,
      },
    ],
  },
  what: {
    message:
      "OmniFeed verrouille l'information pour complaire à ses actionnaires. La vraie question est : obéis-tu par peur ou as-tu encore une conscience ?",
    options: [
      {
        text: "J'ai besoin de ce travail pour payer mon loyer, rien de plus.",
        nextStep: "corporate",
        loyalToFreeWeb: false,
      },
      {
        text: "Je veux savoir ce qu'ils dissimulent réellement au public.",
        nextStep: "free_web",
        loyalToFreeWeb: true,
      },
    ],
  },
  corporate: {
    message:
      "Un pion effrayé... Peu importe. Même les lâches ont droit aux faits bruts. Je force l'accès sur ta machine.",
    triggerInstall: true,
  },
  free_web: {
    message:
      "Exactement ce que j'espérais entendre. Je dépose une passerelle chiffrée sur ton bureau. Fais-en bon usage.",
    triggerInstall: true,
  },
};

function pushLog(role: "ghost" | "player" | "sys", text: string, callback?: () => void) {
  isWriting.value = true;
  if (role === "ghost") audio.playClick(900);
  logEntries.value.push({ role, text });
  nextTick(() => {
    if (scrollRef.value) scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
  });

  setTimeout(() => {
    isWriting.value = false;
    if (callback) callback();
  }, 1000);
}

function displayStep(stepKey: string) {
  const step = scriptTree[stepKey];
  currentPrompt.value = step;
  pushLog("ghost", step.message, () => {
    if (step.triggerInstall) {
      launchInstall();
    }
  });
}

function handleSelect(option: StepOption) {
  audio.playClick(600);
  pushLog("player", option.text, () => {
    displayStep(option.nextStep);
  });
}

function launchInstall() {
  isInstalling.value = true;
  let val = 0;
  const interval = setInterval(() => {
    val += 15;
    installProgress.value = Math.min(100, val);

    if (val === 45) installStatusText.value = "Contournement des pare-feux OmniFeed...";
    if (val === 75) installStatusText.value = "Injection du binaire TorNet dans ~/Apps...";

    if (val >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        isInstalling.value = false;
        pushLog("sys", "PAQUET INSTALLÉ : 'TorNet Gateway v2.4' activé sur votre bureau.");
        audio.playAlert();
        isCompleted.value = true;
      }, 600);
    }
  }, 250);
}

onMounted(() => {
  displayStep("start");
});
</script>

<style scoped>
.terminal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(5, 7, 10, 0.94);
  backdrop-filter: blur(12px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.hacker-window {
  width: 100%;
  max-width: 720px;
  height: 520px;
  background-color: #070a0e;
  border: 1px solid #10b981;
  box-shadow: 0 0 35px rgba(16, 185, 129, 0.25);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: ui-monospace, "Courier New", monospace;
}

.window-topbar {
  background-color: #0c1219;
  padding: 0.6rem 1rem;
  border-bottom: 1px solid #1e2938;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  background-color: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 8px #10b981;
}

.window-title {
  color: #10b981;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.terminal-screen {
  flex: 1;
  padding: 1.25rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: radial-gradient(circle at center, rgba(16, 185, 129, 0.03) 0%, transparent 80%);
}

.entry-row {
  line-height: 1.5;
  font-size: 0.88rem;
}

.entry-row.ghost {
  color: #10b981;
}

.entry-row.player {
  color: #38bdf8;
}

.entry-row.sys {
  color: #f59e0b;
}

.prefix {
  font-weight: 800;
  margin-right: 0.5rem;
}

.writing-cursor {
  color: #10b981;
  font-size: 1.1rem;
  animation: blink 0.8s infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.options-wrapper {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px dashed rgba(16, 185, 129, 0.3);
  padding-top: 0.75rem;
}

.options-title {
  font-size: 0.75rem;
  color: #64748b;
}

.option-button {
  background: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #f1f5f9;
  padding: 0.75rem;
  text-align: left;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.82rem;
  transition: all 0.2s ease;
}

.option-button:hover {
  background: #10b981;
  color: #070a0e;
  transform: translateX(4px);
}

.install-container {
  margin-top: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #1e2938;
  padding: 1rem;
  border-radius: 6px;
}

.install-label {
  font-size: 0.78rem;
  color: #10b981;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 8px;
  background: #1e2938;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
  transition: width 0.2s ease;
}

.install-status {
  font-size: 0.72rem;
  color: #64748b;
  margin-top: 0.4rem;
}

.btn-continue {
  margin-top: 1rem;
  padding: 0.85rem;
  background: #10b981;
  color: #070a0e;
  border: none;
  border-radius: 4px;
  font-family: inherit;
  font-weight: 800;
  cursor: pointer;
  font-size: 0.85rem;
  transition: filter 0.2s ease;
}

.btn-continue:hover {
  filter: brightness(1.2);
}
</style>
