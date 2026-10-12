<template>
  <header class="app-header">
    <div class="header-left">
      <span class="status-badge">SYS // MOD-602</span>
      <span class="header-dim">AGENT: 84-CHARLEROI</span>
      <span class="header-accent">JOUR {{ stats.day }}</span>
    </div>

    <div class="header-metrics">
      <div class="metric-card">
        <span class="metric-label">SOLDE</span>
        <span class="metric-val text-emerald">{{ stats.funds.toFixed(1) }} €</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">SANTÉ MENTALE</span>
        <span
          class="metric-val"
          :class="stats.mentalHealth < 35 ? 'text-danger pulse' : 'text-amber'"
        >
          {{ stats.mentalHealth }}%
        </span>
      </div>
      <div class="metric-card">
        <span class="metric-label">AVERTISSEMENTS RH</span>
        <span class="metric-val text-danger">{{ stats.hrStrikes }}/3</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { PlayerStats } from "@/types/game";

defineProps<{
  stats: PlayerStats;
}>();
</script>
