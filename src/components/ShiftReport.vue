<template>
  <div class="center-screen">
    <div
      class="report-container"
      :class="{ 'game-over-theme': isGameOver, 'victory-theme': isEndingReached }"
    >
      <!-- En-tête -->
      <div class="report-header">
        <h2 v-if="isGameOver" class="text-danger">
          AVIS D'EXPULSION ET RÉSILIATION // JOUR {{ stats.day }}
        </h2>
        <h2 v-else-if="isEndingReached" class="text-emerald">
          DÉNOUEMENT TERMINAL // JOUR {{ stats.day }}
        </h2>
        <h2 v-else>RAPPORT DE FIN DE POSTE // JOUR {{ stats.day }}</h2>
        <span class="report-subtitle">
          {{
            isGameOver
              ? "FIN DE PROTOCOLE OPÉRATEUR"
              : isEndingReached
                ? "ÉPILOGUE DE L'AGENT"
                : "CLÔTURE DU CYCLE DE SURVEILLANCE"
          }}
        </span>
      </div>

      <!-- Métriques financières -->
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

      <!-- Écran de Game Over -->
      <div v-if="isGameOver" class="game-over-box">
        <div class="game-over-badge">MOTIF D'ARRÊT :</div>
        <p class="game-over-reason">{{ gameOverReason }}</p>
        <button class="btn-restart" @click="$emit('restart')">
          RETOURNER À L'ACCUEIL // ENGAGER UN NOUVEL AGENT
        </button>
      </div>

      <!-- Écran d'Épilogue / Fin de Jeu -->
      <div v-else-if="isEndingReached" class="ending-box">
        <div class="ending-title">{{ endingData.title }}</div>
        <p class="ending-desc">{{ endingData.description }}</p>
        <button class="btn-restart" @click="$emit('restart')">
          NOUVELLE PARTIE // EXPLORER UNE AUTRE VOIE
        </button>
      </div>

      <!-- Déroulement standard avec Boutique de Dortoir -->
      <template v-else>
        <!-- Boutique de survie -->
        <div class="shop-section">
          <h3>{{ t("shop_title") }}</h3>
          <div class="shop-grid">
            <button
              class="shop-btn"
              :disabled="stats.funds < 12.0 || stats.mentalHealth >= 100"
              @click="$emit('buyItem', 'meal')"
            >
              <span>{{ t("shop_item_meal") }}</span>
              <strong>12.00 €</strong>
            </button>
            <button
              class="shop-btn"
              :disabled="stats.funds < 20.0 || stats.mentalHealth >= 100"
              @click="$emit('buyItem', 'stim')"
            >
              <span>{{ t("shop_item_stim") }}</span>
              <strong>20.00 €</strong>
            </button>
            <button
              class="shop-btn"
              :disabled="stats.funds < 30.0 || stats.hasProxyShield"
              @click="$emit('buyItem', 'vpn')"
            >
              <span>{{ t("shop_item_vpn") }}</span>
              <strong>{{ stats.hasProxyShield ? t("shop_bought") : "30.00 €" }}</strong>
            </button>
            <button
              class="shop-btn"
              :disabled="stats.funds < 25.0 || stats.hrStrikes <= 0"
              @click="$emit('buyItem', 'bribe')"
            >
              <span>{{ t("shop_item_bribe") }}</span>
              <strong>25.00 €</strong>
            </button>
          </div>
        </div>

        <!-- Revue de presse -->
        <div class="news-section">
          <h3>REVUE DE PRESSE DU LENDEMAIN</h3>
          <div class="news-list">
            <div v-for="(log, idx) in decisionsLog" :key="idx" class="news-item">
              <div class="news-meta">
                <span class="news-author">{{ log.author }}</span>
                <span class="decision-pill" :class="log.actionTaken">
                  {{ log.actionTaken.toUpperCase() }}
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
import { t } from "@/services/i18n";

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
  (e: "buyItem", item: "meal" | "stim" | "vpn" | "bribe"): void;
}>();

const isGameOver = computed(() => {
  return props.stats.hrStrikes >= 3 || props.stats.funds < 0 || props.stats.mentalHealth <= 0;
});

const isEndingReached = computed(() => {
  return props.stats.day >= 3 && !isGameOver.value;
});

const gameOverReason = computed(() => {
  if (props.stats.hrStrikes >= 3) {
    return "Licenciement disciplinaire pour insubordination répétée (3 strikes RH accumulés).";
  }
  if (props.stats.funds < 0) {
    return "Expulsion immédiate du dortoir. Votre solde négatif ne permet plus de régler la chambrée.";
  }
  if (props.stats.mentalHealth <= 0) {
    return "Décompensation psychologique aiguë sous exposition continue à la modération toxique.";
  }
  return "";
});

const endingData = computed(() => {
  if (props.stats.reputationResistance > props.stats.reputationCorporate) {
    return {
      title: "ÉPILOGUE : LE MARTYR DU WEB LIBRE",
      description:
        "Grâce à vos arbitrages dissidents, la coordination citoyenne a percé l'omerta sur les pollutions de Sambreville. Les serveurs de Charleroi sont saisis par les juges d'instruction.",
    };
  }
  return {
    title: "ÉPILOGUE : L'AGENT DE CONFORMITÉ MODÈLE",
    description:
      "Votre fidélité corporative a préservé l'actionnariat d'OmniFeed. Vous êtes promu Superviseur Algorithmique de Zone et quittez le dortoir pour un logement de fonction.",
  };
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
  padding: 1.75rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.report-container.game-over-theme {
  border-color: var(--c-danger);
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.35);
}

.report-container.victory-theme {
  border-color: var(--c-emerald);
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.35);
}

.report-header {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.report-header h2 {
  font-size: 1.2rem;
  font-family: ui-monospace, monospace;
  margin: 0;
}

.report-subtitle {
  font-size: 0.7rem;
  color: var(--text-dim);
  font-family: ui-monospace, monospace;
}

.report-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
}

.report-box {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.75rem;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.report-box-title {
  font-size: 0.65rem;
  color: var(--text-dim);
}

.report-box-val {
  font-size: 1.15rem;
  font-weight: 800;
  font-family: ui-monospace, monospace;
}

.shop-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.shop-section h3 {
  font-size: 0.75rem;
  color: var(--c-sky);
  font-family: ui-monospace, monospace;
  margin: 0;
}

.shop-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.shop-btn {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  color: #fff;
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  font-size: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.15s;
}

.shop-btn:hover:not(:disabled) {
  border-color: var(--c-sky);
  background-color: rgba(56, 189, 248, 0.1);
}

.shop-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.news-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
  gap: 0.4rem;
  max-height: 140px;
  overflow-y: auto;
}

.news-item {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.2rem;
  font-size: 0.7rem;
  font-family: ui-monospace, monospace;
}

.news-author {
  color: var(--c-sky);
  font-weight: 700;
}

.decision-pill {
  font-weight: 700;
  font-size: 0.65rem;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
}
.decision-pill.approve {
  color: var(--c-emerald);
  background: rgba(16, 185, 129, 0.15);
}
.decision-pill.reject {
  color: var(--c-danger);
  background: rgba(239, 68, 68, 0.15);
}
.decision-pill.shadowban {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.15);
}
.decision-pill.warn {
  color: var(--c-sky);
  background: rgba(56, 189, 248, 0.15);
}

.news-headline {
  color: #fff;
  font-style: italic;
  margin: 0;
}

.game-over-box,
.ending-box {
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-color);
  padding: 1.25rem;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.ending-title {
  color: var(--c-emerald);
  font-weight: 800;
  font-family: ui-monospace, monospace;
}

.btn-restart,
.btn-next-day {
  background: linear-gradient(180deg, var(--c-sky) 0%, #0284c7 100%);
  color: #07090c;
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 800;
  cursor: pointer;
  font-family: ui-monospace, monospace;
}
.btn-restart {
  background: var(--c-danger);
  color: #fff;
}
</style>
