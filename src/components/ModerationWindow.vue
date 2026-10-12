<template>
  <div class="mod-layout">
    <!-- Notification flottante discrète "Copié !" -->
    <transition name="fade">
      <div v-if="toastMessage" class="copy-toast">
        {{ toastMessage }}
      </div>
    </transition>

    <div class="post-header-box">
      <div class="author-block">
        <span
          class="author-display searchable-chip"
          title="Cliquer pour copier et chercher dans OmniSearch"
          @click="quickSearch(ticket.authorName)"
        >
          {{ ticket.authorName }}
        </span>
        <span
          class="author-handle searchable-chip"
          title="Cliquer pour copier et chercher dans OmniSearch"
          @click="quickSearch(ticket.authorHandle)"
        >
          {{ ticket.authorHandle }}
        </span>
        <span v-if="ticket.authorVerified" class="verified-tag">VÉRIFIÉ</span>
      </div>
      <div class="post-meta">
        <span
          class="searchable-chip"
          title="Cliquer pour copier l'identifiant"
          @click="quickSearch(ticket.id)"
        >
          {{ ticket.id }}
        </span>
        <span class="reach-badge">VIRALITÉ : {{ ticket.reachMultiplier }}x</span>
      </div>
    </div>

    <!-- Message et photo (texte sélectionnable pour copier/coller) -->
    <div class="post-body">
      <p class="post-content-text selectable">"{{ ticket.content }}"</p>

      <div class="image-frame">
        <img :src="ticket.imageUrl" alt="Document posté" class="post-img" loading="lazy" />
      </div>

      <div class="file-tag">
        <span
          class="searchable-chip"
          title="Cliquer pour copier la mention"
          @click="quickSearch(ticket.visualCue)"
        >
          📎 {{ ticket.visualCue }}
        </span>
        <span class="clean-badge">SCAN ANTIVIRAL CONFORME</span>
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
            <span
              class="comment-author searchable-chip"
              title="Cliquer pour rechercher cet intervenant"
              @click="quickSearch(comment.authorName)"
            >
              {{ comment.authorName }}
            </span>
            <span
              class="comment-handle searchable-chip"
              title="Cliquer pour rechercher ce pseudo"
              @click="quickSearch(comment.authorHandle)"
            >
              {{ comment.authorHandle }}
            </span>
            <span v-if="comment.isOfficial" class="corp-tag">OFFICIEL</span>
            <span class="comment-time">{{ comment.timestamp }}</span>
          </div>
          <p class="comment-text selectable">{{ comment.content }}</p>
        </div>
      </div>
    </div>

    <!-- Rémunération fixe par tâche -->
    <div class="flat-reward-bar">
      <span>RÉTRIBUTION POUR CE TRAITEMENT :</span>
      <strong class="text-emerald">+6.00 €</strong>
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
import { ref } from "vue";
import type { Ticket, ModerationAction } from "@/types/game";
import { audio } from "@/services/audio";

defineProps<{
  ticket: Ticket;
}>();

const emit = defineEmits<{
  (e: "decide", action: ModerationAction): void;
  (e: "search", query: string): void;
}>();

const toastMessage = ref("");
let toastTimeout: number | null = null;

function quickSearch(text: string) {
  if (!text) return;
  audio.playClick(1000);

  // Copie dans le presse-papier
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  // Affiche la bulle temporaire
  toastMessage.value = `📋 "${text}" copié & envoyé à OmniSearch`;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toastMessage.value = "";
  }, 2200);

  // Émet l'événement de recherche vers App.vue
  emit("search", text);
}
</script>

<style scoped>
.mod-layout {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  position: relative;
}

.copy-toast {
  position: absolute;
  top: -10px;
  right: 0;
  background-color: #0b0f16;
  border: 1px solid var(--c-sky);
  color: var(--c-sky);
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: ui-monospace, monospace;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 50;
  pointer-events: none;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
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
  max-height: 150px;
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

.flat-reward-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.65rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-family: ui-monospace, monospace;
}

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
