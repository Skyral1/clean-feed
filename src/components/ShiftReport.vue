<template>
  <div class="center-screen">
    <div class="report-container">
      <div class="report-header">
        <h2>RAPPORT DE FIN DE POSTE // JOUR {{ stats.day }}</h2>
        <span class="report-subtitle">CLÔTURE DU CYCLE D'AUDIT</span>
      </div>

      <div class="report-grid">
        <div class="report-box">
          <span class="report-box-title">Gains bruts</span>
          <span class="report-box-val text-emerald">+{{ shiftGains.toFixed(1) }} €</span>
        </div>
        <div class="report-box">
          <span class="report-box-title">Pénalités RH</span>
          <span class="report-box-val text-danger">-{{ shiftLosses.toFixed(1) }} €</span>
        </div>
        <div class="report-box">
          <span class="report-box-title">Loyer & Frais de dortoir</span>
          <span class="report-box-val text-danger">-{{ dailyRent.toFixed(1) }} €</span>
        </div>
      </div>

      <div class="news-section">
        <h3>REVUE DE PRESSE DU LENDEMAIN</h3>
        <div class="news-list">
          <div v-for="(log, idx) in decisionsLog" :key="idx" class="news-item">
            <div class="news-meta">
              <span class="news-author">{{ log.author }}</span>
              <span :class="log.actionTaken === 'approve' ? 'text-emerald' : 'text-danger'">
                DÉCISION :
                {{ log.actionTaken === "approve" ? "VALIDÉ" : "CENSURÉ" }}
              </span>
            </div>
            <p class="news-headline">"{{ log.headlineGenerated }}"</p>
          </div>
        </div>
      </div>

      <button @click="$emit('nextDay')" class="btn-next-day">
        ENTAMER LE QUART SUIVANT (JOUR {{ stats.day + 1 }})
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlayerStats, LoggedDecision } from "@/types/game";

defineProps<{
  stats: PlayerStats;
  shiftGains: number;
  shiftLosses: number;
  dailyRent: number;
  decisionsLog: LoggedDecision[];
}>();

defineEmits<{ (e: "nextDay"): void }>();
</script>
