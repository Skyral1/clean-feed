<template>
  <div class="feed-card">
    <div class="card-header">
      <div class="author-info">
        <span class="author-name">{{ ticket.authorName }}</span>
        <span class="author-handle">{{ ticket.authorHandle }}</span>
        <span v-if="ticket.authorVerified" class="verified-pill">CERTIFIÉ</span>
      </div>
      <div class="ticket-meta">
        <span>{{ ticket.id }}</span>
        <span class="reach-tag">PORTÉE : {{ ticket.reachMultiplier }}x</span>
      </div>
    </div>

    <div class="post-content">
      <p class="post-text">"{{ ticket.content }}"</p>

      <!-- Image d'illustration réelle intégrée au post -->
      <div class="post-visual-wrapper">
        <img
          :src="ticket.imageUrl"
          alt="Pièce jointe du signalement"
          class="post-image"
          loading="lazy"
        />
      </div>

      <div class="attachment-box">
        <div class="attachment-left">
          <span class="attachment-icon">📎</span>
          <span class="attachment-name">{{ ticket.visualCue }}</span>
        </div>
        <span class="attachment-status">VÉRIFIÉ SANS CODE MALVEILLANT</span>
      </div>
    </div>

    <!-- Chronomètre régressif -->
    <div class="timer-section">
      <div class="timer-labels">
        <span>DÉLAI DE TRAITEMENT (CADENCE INDUSTRIELLE)</span>
        <span :class="timeLeft < 5 ? 'text-danger font-bold' : 'text-sky'">
          {{ timeLeft.toFixed(1) }}s / {{ maxTime.toFixed(1) }}s
        </span>
      </div>
      <div class="timer-track">
        <div
          class="timer-fill"
          :class="{ critical: timeLeft < 5 }"
          :style="{ width: `${(timeLeft / maxTime) * 100}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ticket } from "@/types/game";

defineProps<{
  ticket: Ticket;
  timeLeft: number;
  maxTime: number;
}>();
</script>

<style scoped>
.post-visual-wrapper {
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  max-height: 240px;
  border: 1px solid var(--border-color);
  background-color: #000;
}

.post-image {
  width: 100%;
  height: 240px;
  object-fit: cover;
  display: block;
  filter: contrast(1.05) brightness(0.9);
}
</style>
