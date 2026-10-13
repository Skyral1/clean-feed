<template>
  <div class="center-screen">
    <div class="report-container" :class="{ 'game-over-theme': isGameOver }">
      <!-- En-tête standard ou alerte d'expulsion -->
      <div class="report-header">
        <h2 v-if="!isGameOver">RAPPORT DE FIN DE POSTE // JOUR {{ stats.day }}</h2>
        <h2 v-else class="text-danger">AVIS DE RÉSILIATION ET EXPULSION // JOUR {{ stats.day }}</h2>
        <span class="report-subtitle">
          {{ isGameOver ? "FIN DE PROTOCOLE AGENT" : "CLÔTURE DU CYCLE D'AUDIT" }}
        </span>
      </div>

      <!-- Bilan financier -->
      <div class="report-grid">
        <div class="report-box">
          <span class="report-box-title">Gains du quart</span>
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

      <!-- Écran de Game Over explicite en cas d'échec -->
      <div v-if="isGameOver" class="game-over-box">
        <div class="game-over-badge">MOTIF DE RUPTURE :</div>
        <p class="game-over-reason">{{ gameOverReason }}</p>
        <button class="btn-restart" @click="$emit('restart')">
          RETOURNER À L'ACCUEIL // ENGAGER UN NOUVEL AGENT
        </button>
      </div>

      <!-- Déroulement normal si le joueur survit -->
      <template v-else>
        <div class="news-section">
          <h3>REVUE DE PRESSE DU LENDEMAIN</h3>
          <div class="news-list">
            <div v-for="(log, idx) in decisionsLog" :key="idx" class="news-item">
              <div class="news-meta">
                <span class="news-author">{{ log.author }}</span>
                <span :class="log.actionTaken === 'approve' ? 'text-emerald' : 'text-danger'">
                  DÉCISION : {{ log.actionTaken === "approve" ? "VALIDÉ" : "CENSURÉ" }}
                </span>
              </div>
              <p class="news-headline">"{{ log.headlineGenerated }}"</p>
            </div>
          </div>
        </div>

        <button @click="$emit('nextDay')" class="btn-next-day">
          ENTAMER LE QUART SUIVANT (JOUR {{ stats.day + 1 }}) ➔
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PlayerStats, LoggedDecision } from "@/types/game";

const props = defineProps<{
  stats: PlayerStats;
  shiftGains: number;
  shiftLosses: number;
  dailyRent: number;
  decisionsLog: LoggedDecision[];
}>();

defineEmits<{
  (e: "nextDay"): void;
  (e: "restart"): void;
}>();

const isGameOver = computed(() => {
  return props.stats.hrStrikes >= 3 || props.stats.funds < 0 || props.stats.mentalHealth <= 0;
});

const gameOverReason = computed(() => {
  if (props.stats.hrStrikes >= 3) {
    return "Licenciement disciplinaire pour insubordination répétée (3 strikes RH accumulés).";
  }
  if (props.stats.funds < 0) {
    return "Expulsion immédiate du dortoir. Votre solde négatif ne permet plus de couvrir le loyer et les rations.";
  }
  if (props.stats.mentalHealth <= 0) {
    return "Décompensation psychologique aiguë. Vous avez été évacué vers une unité de rééducation psychiatrique.";
  }
  return "";
});
</script>

<style scoped>
.report-container {
  width: 100%;
  max-width: 680px;
  background-color: rgba(18, 24, 32, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.report-container.game-over-theme {
  border-color: var(--c-danger);
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.35);
}

.report-header {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.75rem;
}

.report-header h2 {
  font-size: 1.3rem;
  font-family: ui-monospace, monospace;
  margin: 0;
}

.report-subtitle {
  font-size: 0.75rem;
  color: var(--text-dim);
  font-family: ui-monospace, monospace;
}

.report-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.report-box {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.85rem;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.report-box-title {
  font-size: 0.7rem;
  color: var(--text-dim);
}

.report-box-val {
  font-size: 1.2rem;
  font-weight: 800;
  font-family: ui-monospace, monospace;
}

.news-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.news-section h3 {
  font-size: 0.75rem;
  color: var(--c-amber);
  font-family: ui-monospace, monospace;
  margin: 0;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 180px;
  overflow-y: auto;
}

.news-item {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.65rem 0.85rem;
  border-radius: 6px;
  font-size: 0.8rem;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.72rem;
  font-family: ui-monospace, monospace;
}

.news-author {
  color: var(--c-sky);
  font-weight: 700;
}

.news-headline {
  color: #fff;
  font-style: italic;
  margin: 0;
}

.game-over-box {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--c-danger);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.game-over-badge {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--c-danger);
  font-family: ui-monospace, monospace;
}

.game-over-reason {
  color: #fff;
  font-size: 0.95rem;
  line-height: 1.5;
}

.btn-restart {
  background: var(--c-danger);
  color: #fff;
  border: none;
  padding: 0.85rem;
  border-radius: 6px;
  font-weight: 800;
  cursor: pointer;
  font-family: ui-monospace, monospace;
  transition: filter 0.2s;
}

.btn-restart:hover {
  filter: brightness(1.2);
}

.btn-next-day {
  background: linear-gradient(180deg, var(--c-sky) 0%, #0284c7 100%);
  color: #07090c;
  border: none;
  padding: 0.85rem;
  border-radius: 6px;
  font-weight: 800;
  cursor: pointer;
  font-family: ui-monospace, monospace;
  transition: filter 0.2s;
}

.btn-next-day:hover {
  filter: brightness(1.15);
}
</style>
