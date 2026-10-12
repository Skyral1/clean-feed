<template>
  <div class="mod-layout">
    <!-- En-tête du post -->
    <div class="post-header-box">
      <div class="author-block">
        <span class="author-display">{{ ticket.authorName }}</span>
        <span class="author-handle">{{ ticket.authorHandle }}</span>
        <span v-if="ticket.authorVerified" class="verified-tag">VÉRIFIÉ</span>
      </div>
      <div class="post-meta">
        <span>{{ ticket.id }}</span>
        <span class="reach-badge">VIRALITÉ : {{ ticket.reachMultiplier }}x</span>
      </div>
    </div>

    <!-- Corps du message et image -->
    <div class="post-body">
      <p class="post-content-text">"{{ ticket.content }}"</p>

      <div class="image-frame">
        <img :src="ticket.imageUrl" alt="Document posté" class="post-img" loading="lazy" />
      </div>

      <div class="file-tag">
        <span>📎 {{ ticket.visualCue }}</span>
        <span class="clean-badge">SCAN ANTIVIRAL OK</span>
      </div>
    </div>

    <!-- Fil de commentaires des utilisateurs -->
    <div class="comments-section">
      <span class="section-title">RÉACTIONS ET COMMENTAIRES DE LA COMMUNAUTÉ :</span>
      <div class="comments-flow">
        <div
          v-for="comment in ticket.comments"
          :key="comment.id"
          class="comment-box"
          :class="{ official: comment.isOfficial }"
        >
          <div class="comment-user">
            <span class="comment-author">{{ comment.authorName }}</span>
            <span class="comment-handle">{{ comment.authorHandle }}</span>
            <span v-if="comment.isOfficial" class="corp-tag">OFFICIEL</span>
            <span class="comment-time">{{ comment.timestamp }}</span>
          </div>
          <p class="comment-text">{{ comment.content }}</p>
        </div>
      </div>
    </div>

    <!-- Barre de rémunération selon la cadence -->
    <div class="tier-bar">
      <div class="tier-info">
        <span
          >TEMPS D'ANALYSE DU DOSSIER :
          <strong class="text-sky">{{ elapsedSeconds.toFixed(1) }}s</strong></span
        >
        <span
          >PALIER EN COURS :
          <strong :class="currentTierClass"
            >{{ currentTierName }} (+{{ estimatedReward.toFixed(2) }} €)</strong
          ></span
        >
      </div>
      <div class="tier-progress-track">
        <div
          class="tier-fill"
          :style="{ width: `${tierProgressPercent}%` }"
          :class="currentTierClass"
        ></div>
      </div>
    </div>

    <!-- Boutons d'arbitrage -->
    <div class="decision-bar">
      <button @click="$emit('decide', 'reject')" class="btn-arbitrage reject">
        <span class="btn-shortcut">[Q]</span> CENSURER LE POST
      </button>
      <button @click="$emit('decide', 'approve')" class="btn-arbitrage approve">
        <span class="btn-shortcut">[E]</span> VALIDER LA PUBLICATION
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Ticket, ModerationAction } from "@/types/game";

const props = defineProps<{
  ticket: Ticket;
  elapsedSeconds: number;
  estimatedReward: number;
}>();

defineEmits<{
  (e: "decide", action: ModerationAction): void;
}>();

const currentTierName = computed(() => {
  if (props.elapsedSeconds < 8) return "Éclair (Rendement Max)";
  if (props.elapsedSeconds < 20) return "Cadence Standard";
  if (props.elapsedSeconds < 45) return "Approfondi (Pénalité de lenteur)";
  return "Plancher Réglementaire";
});

const currentTierClass = computed(() => {
  if (props.elapsedSeconds < 8) return "tier-super";
  if (props.elapsedSeconds < 20) return "tier-standard";
  if (props.elapsedSeconds < 45) return "tier-slow";
  return "tier-floor";
});

const tierProgressPercent = computed(() => {
  // Jauge de 0 à 45 secondes
  return Math.min(100, (props.elapsedSeconds / 45) * 100);
});
</script>

<style scoped>
.mod-layout {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.post-header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.75rem;
}

.author-block {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-display {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}
.author-handle {
  font-size: 0.85rem;
  color: var(--text-dim);
}
.verified-tag {
  font-size: 0.65rem;
  background-color: rgba(245, 158, 11, 0.15);
  border: 1px solid var(--c-amber);
  color: var(--c-amber);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: ui-monospace, monospace;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.reach-badge {
  background-color: var(--bg-card);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  color: var(--c-amber);
  font-weight: 700;
}

.post-content-text {
  font-size: 1.2rem;
  line-height: 1.5;
  color: #f1f5f9;
  margin-bottom: 0.85rem;
}

.image-frame {
  max-height: 220px;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: #000;
}

.post-img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}

.file-tag {
  display: flex;
  justify-content: space-between;
  background-color: var(--bg-card);
  padding: 0.6rem 0.85rem;
  border-radius: 4px;
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: var(--text-dim);
}

.clean-badge {
  color: var(--c-emerald);
  font-size: 0.7rem;
  font-weight: 700;
}

/* Commentaires */
.comments-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--c-amber);
  letter-spacing: 0.05em;
}

.comments-flow {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 160px;
  overflow-y: auto;
  padding-right: 0.35rem;
}

.comment-box {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.65rem 0.85rem;
  border-radius: 6px;
  font-size: 0.8rem;
}

.comment-box.official {
  border-left: 3px solid var(--c-sky);
  background-color: rgba(56, 189, 248, 0.05);
}

.comment-user {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.25rem;
}

.comment-author {
  font-weight: 700;
  color: #fff;
}
.comment-handle {
  color: var(--text-muted);
  font-size: 0.75rem;
}
.corp-tag {
  font-size: 0.6rem;
  background-color: var(--c-sky);
  color: #000;
  font-weight: 700;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
}
.comment-time {
  margin-left: auto;
  color: var(--text-muted);
  font-size: 0.7rem;
}
.comment-text {
  color: var(--text-dim);
  line-height: 1.4;
}

/* Paliers de prime */
.tier-bar {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1rem;
  border-radius: 6px;
}

.tier-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  font-family: ui-monospace, monospace;
}

.tier-progress-track {
  width: 100%;
  height: 6px;
  background-color: #0c1015;
  border-radius: 999px;
  overflow: hidden;
}

.tier-fill {
  height: 100%;
  transition: width 0.2s linear;
}

.tier-super {
  color: var(--c-emerald);
  background-color: var(--c-emerald);
}
.tier-standard {
  color: var(--c-sky);
  background-color: var(--c-sky);
}
.tier-slow {
  color: var(--c-amber);
  background-color: var(--c-amber);
}
.tier-floor {
  color: var(--c-danger);
  background-color: var(--c-danger);
}

/* Boutons */
.decision-bar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.btn-arbitrage {
  padding: 0.9rem;
  border-radius: 6px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  transition: all 0.15s;
}

.btn-arbitrage.reject {
  background-color: rgba(239, 68, 68, 0.15);
  border-color: var(--c-danger);
  color: var(--c-danger);
}
.btn-arbitrage.reject:hover {
  background-color: var(--c-danger);
  color: #fff;
}

.btn-arbitrage.approve {
  background-color: rgba(16, 185, 129, 0.15);
  border-color: var(--c-emerald);
  color: var(--c-emerald);
}
.btn-arbitrage.approve:hover {
  background-color: var(--c-emerald);
  color: #fff;
}

.btn-shortcut {
  font-family: ui-monospace, monospace;
  font-size: 0.8rem;
}
</style>
