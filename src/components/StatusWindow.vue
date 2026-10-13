<template>
  <div class="status-monitor">
    <div class="agent-profile-card">
      <div class="agent-avatar">👤</div>
      <div class="agent-details">
        <div class="agent-id">{{ t("status_operator") }}</div>
        <div class="agent-role">{{ t("status_role") }}</div>
        <div class="agent-sub">{{ t("status_room") }}</div>
      </div>
      <div class="day-badge">
        {{ t("status_day") }} <span>{{ stats.day }}</span>
      </div>
    </div>

    <div class="metrics-dashboard">
      <div class="metric-tile">
        <div class="tile-header">
          <span class="tile-label">{{ t("status_funds_avail") }}</span>
          <span class="tile-icon">💶</span>
        </div>
        <div class="tile-value text-emerald">{{ stats.funds.toFixed(2) }} €</div>
        <div class="tile-foot">
          {{ t("status_rent_tonight") }}
          <strong class="text-danger">-{{ dailyRent.toFixed(2) }} €</strong>
        </div>
      </div>

      <div class="metric-tile">
        <div class="tile-header">
          <span class="tile-label">{{ t("status_mental") }}</span>
          <span class="tile-icon">🧠</span>
        </div>
        <div
          class="tile-value"
          :class="stats.mentalHealth < 35 ? 'text-danger pulse' : 'text-amber'"
        >
          {{ stats.mentalHealth }}%
        </div>
        <div class="health-track">
          <div
            class="health-fill"
            :class="stats.mentalHealth < 35 ? 'bg-danger' : 'bg-amber'"
            :style="{ width: `${stats.mentalHealth}%` }"
          ></div>
        </div>
      </div>

      <div class="metric-tile">
        <div class="tile-header">
          <span class="tile-label">{{ t("status_strikes") }}</span>
          <span class="tile-icon">⚠️</span>
        </div>
        <div class="tile-value" :class="stats.hrStrikes > 0 ? 'text-danger' : 'text-emerald'">
          {{ stats.hrStrikes }} / 3
        </div>
        <div class="tile-foot">
          <span v-if="stats.hrStrikes === 0" class="text-emerald">{{
            t("status_strike_clean")
          }}</span>
          <span v-else-if="stats.hrStrikes < 3" class="text-danger">{{
            t("status_strike_warn")
          }}</span>
          <span v-else class="text-danger font-bold">{{ t("status_strike_fire") }}</span>
        </div>
      </div>
    </div>

    <div class="shift-stats-box">
      <div class="box-title">{{ t("status_cycle_title") }}</div>
      <div class="shift-stats-grid">
        <div class="stat-col">
          <span>{{ t("status_cumul_gains") }}</span>
          <strong class="text-emerald">+{{ shiftGains.toFixed(2) }} €</strong>
        </div>
        <div class="stat-col">
          <span>{{ t("status_audit_penalties") }}</span>
          <strong class="text-danger">-{{ shiftLosses.toFixed(2) }} €</strong>
        </div>
        <div class="stat-col">
          <span>{{ t("status_regularity") }}</span>
          <strong class="text-sky">
            {{ Math.round((stats.mentalHealth + (3 - stats.hrStrikes) * 33) / 2) }}%
          </strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlayerStats } from "@/types/game";
import { t } from "@/services/i18n";

defineProps<{
  stats: PlayerStats;
  dailyRent: number;
  shiftGains: number;
  shiftLosses: number;
}>();
</script>

<style scoped>
.status-monitor {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  font-size: 0.85rem;
}

.agent-profile-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.85rem 1rem;
  border-radius: 8px;
}

.agent-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #1e2938 0%, #0f172a 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.agent-details {
  flex: 1;
}

.agent-id {
  font-weight: 700;
  color: #fff;
  font-family: ui-monospace, monospace;
}

.agent-role {
  font-size: 0.75rem;
  color: var(--c-sky);
}

.agent-sub {
  font-size: 0.68rem;
  color: var(--text-muted);
}

.day-badge {
  text-align: right;
  font-size: 0.7rem;
  color: var(--text-muted);
  font-family: ui-monospace, monospace;
}

.day-badge span {
  display: block;
  font-size: 1.25rem;
  font-weight: 800;
  color: #fff;
}

.metrics-dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.metric-tile {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.tile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tile-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.tile-icon {
  font-size: 0.9rem;
}

.tile-value {
  font-size: 1.4rem;
  font-weight: 800;
  font-family: ui-monospace, monospace;
  margin: 0.35rem 0;
}

.tile-foot {
  font-size: 0.72rem;
  color: var(--text-dim);
}

.health-track {
  width: 100%;
  height: 6px;
  background-color: #0c1015;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 0.35rem;
}

.health-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.bg-amber {
  background-color: var(--c-amber);
}
.bg-danger {
  background-color: var(--c-danger);
}

.shift-stats-box {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.85rem 1rem;
  border-radius: 8px;
}

.box-title {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.shift-stats-grid {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
}

.stat-col {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
</style>
