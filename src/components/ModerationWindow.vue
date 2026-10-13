<template>
  <div class="mod-layout">
    <transition name="fade">
      <div v-if="toastMessage" class="copy-toast">
        {{ toastMessage }}
      </div>
    </transition>

    <div class="post-header-box">
      <div class="author-block">
        <span
          class="author-display searchable-chip"
          title="Click to copy & search in OmniSearch"
          @click="quickSearch(ticket.authorName)"
        >
          {{ ticket.authorName }}
        </span>
        <span
          class="author-handle searchable-chip"
          title="Click to copy & search in OmniSearch"
          @click="quickSearch(ticket.authorHandle)"
        >
          {{ ticket.authorHandle }}
        </span>
        <span v-if="ticket.authorVerified" class="verified-tag">{{ t("mod_verified") }}</span>
      </div>
      <div class="post-meta">
        <span class="searchable-chip" title="Click to copy ID" @click="quickSearch(ticket.id)">
          {{ ticket.id }}
        </span>
        <span class="reach-badge">{{ t("mod_reach") }} {{ ticket.reachMultiplier }}x</span>
      </div>
    </div>

    <!-- Corps du signalement -->
    <div class="post-body">
      <p class="post-content-text selectable">"{{ ticket.content }}"</p>

      <div class="image-frame">
        <img :src="ticket.imageUrl" alt="Attachment" class="post-img" loading="lazy" />
      </div>

      <div class="file-tag">
        <span
          class="searchable-chip"
          title="Click to copy attachment name"
          @click="quickSearch(ticket.visualCue)"
        >
          📎 {{ ticket.visualCue }}
        </span>
        <span class="clean-badge">{{ t("mod_clean_scan") }}</span>
      </div>
    </div>

    <!-- Fil de commentaires -->
    <div class="comments-section">
      <span class="section-title">{{ t("mod_reactions_title") }}</span>
      <div class="comments-flow">
        <div
          v-for="comment in ticket.comments"
          :key="comment.id"
          class="comment-box"
          :class="{ official: comment.isOfficial }"
        >
          <div class="comment-user">
            <span class="comment-author searchable-chip" @click="quickSearch(comment.authorName)">
              {{ comment.authorName }}
            </span>
            <span class="comment-handle searchable-chip" @click="quickSearch(comment.authorHandle)">
              {{ comment.authorHandle }}
            </span>
            <span v-if="comment.isOfficial" class="corp-tag">{{ t("mod_official_comment") }}</span>
            <span class="comment-time">{{ comment.timestamp }}</span>
          </div>
          <p class="comment-text selectable">{{ comment.content }}</p>
        </div>
      </div>
    </div>

    <!-- Barre d'arbitrage nuancé (4 actions) -->
    <div class="arbitration-container">
      <div class="flat-reward-bar">
        <span>{{ t("mod_reward_label") }}</span>
        <strong class="text-emerald">+8.00 €</strong>
      </div>

      <div class="decision-grid">
        <button
          @click="$emit('decide', 'reject')"
          class="btn-arbitrage reject"
          title="Raccourci: Q"
        >
          {{ t("mod_btn_reject") }}
        </button>
        <button
          @click="$emit('decide', 'shadowban')"
          class="btn-arbitrage shadowban"
          title="Raccourci: W"
        >
          {{ t("mod_btn_shadowban") }}
        </button>
        <button @click="$emit('decide', 'warn')" class="btn-arbitrage warn" title="Raccourci: A">
          {{ t("mod_btn_warn") }}
        </button>
        <button
          @click="$emit('decide', 'approve')"
          class="btn-arbitrage approve"
          title="Raccourci: E"
        >
          {{ t("mod_btn_approve") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Ticket, ModerationAction } from "@/types/game";
import { audio } from "@/services/audio";
import { t } from "@/services/i18n";

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

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  toastMessage.value = `📋 "${text}" ${t("mod_toast_copied")}`;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toastMessage.value = "";
  }, 2200);

  emit("search", text);
}
</script>

<style scoped>
.mod-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.post-header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.author-block {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-display {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
}
.author-handle {
  font-size: 0.8rem;
  color: var(--text-dim);
}
.verified-tag {
  font-size: 0.65rem;
  background-color: rgba(245, 158, 11, 0.15);
  border: 1px solid var(--c-amber);
  color: var(--c-amber);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.reach-badge {
  background-color: var(--bg-card);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  color: var(--c-amber);
  font-weight: 700;
}

.post-content-text {
  font-size: 1.1rem;
  line-height: 1.45;
  color: #f1f5f9;
  margin-bottom: 0.75rem;
}

.image-frame {
  max-height: 200px;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: #000;
}

.post-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.file-tag {
  display: flex;
  justify-content: space-between;
  background-color: var(--bg-card);
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  font-size: 0.75rem;
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
  gap: 0.4rem;
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
  gap: 0.4rem;
  max-height: 120px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.comment-box {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
}

.comment-box.official {
  border-left: 3px solid var(--c-sky);
  background-color: rgba(56, 189, 248, 0.05);
}

.comment-user {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.2rem;
}

.comment-author {
  font-weight: 700;
  color: #fff;
}
.comment-handle {
  color: var(--text-muted);
  font-size: 0.7rem;
}
.corp-tag {
  font-size: 0.6rem;
  background-color: var(--c-sky);
  color: #000;
  font-weight: 700;
  padding: 0.05rem 0.25rem;
  border-radius: 3px;
}
.comment-time {
  margin-left: auto;
  color: var(--text-muted);
  font-size: 0.65rem;
}
.comment-text {
  color: var(--text-dim);
  line-height: 1.35;
}

.arbitration-container {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.flat-reward-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-family: ui-monospace, monospace;
}

.decision-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
}

.btn-arbitrage {
  padding: 0.75rem 0.4rem;
  border-radius: 6px;
  font-weight: 800;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  font-family: ui-monospace, monospace;
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

.btn-arbitrage.shadowban {
  background-color: rgba(217, 119, 6, 0.15);
  border-color: #f59e0b;
  color: #f59e0b;
}
.btn-arbitrage.shadowban:hover {
  background-color: #f59e0b;
  color: #000;
}

.btn-arbitrage.warn {
  background-color: rgba(56, 189, 248, 0.15);
  border-color: var(--c-sky);
  color: var(--c-sky);
}
.btn-arbitrage.warn:hover {
  background-color: var(--c-sky);
  color: #000;
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
</style>
