<template>
  <div class="chat-wrapper">
    <div class="chat-disclaimer">CANAL POINT-À-POINT CHIFFRÉ // SIGNAL INTRACTABLE</div>

    <div class="messages-flow" ref="msgContainer">
      <div v-for="(msg, i) in messages" :key="i" class="chat-bubble" :class="msg.sender">
        <div class="bubble-sender">
          {{ msg.sender === "ghost" ? "Ghost_0x (Hacktiviste)" : "Vous" }}
        </div>
        <p class="bubble-text">{{ msg.text }}</p>
        <span class="bubble-time">{{ msg.timestamp }}</span>
      </div>
    </div>

    <!-- Déverrouillage du logiciel pirate -->
    <div v-if="!isToolInstalled" class="install-prompt">
      <p>
        Ghost_0x vous a envoyé le paquet d'injection :
        <code>tornet-gateway.bin</code>.
      </p>
      <button @click="$emit('install')" class="btn-install-tool">
        ⚡ INJECTER LE MOTEUR DU WEB LIBRE SUR LE SYSTÈME
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from "@/types/game";

defineProps<{
  messages: ChatMessage[];
  isToolInstalled: boolean;
}>();

defineEmits<{
  (e: "install"): void;
}>();
</script>

<style scoped>
.chat-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 0.85rem;
  font-size: 0.85rem;
}

.chat-disclaimer {
  font-size: 0.68rem;
  color: var(--c-emerald);
  background-color: rgba(16, 185, 129, 0.1);
  padding: 0.35rem 0.6rem;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
}

.messages-flow {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-right: 0.5rem;
}

.chat-bubble {
  max-width: 85%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.chat-bubble.ghost {
  align-self: flex-start;
  background-color: #1a222d;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.chat-bubble.player {
  align-self: flex-end;
  background-color: #0284c7;
  color: #fff;
}

.bubble-sender {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--c-sky);
}

.bubble-text {
  line-height: 1.4;
  margin: 0;
}

.bubble-time {
  font-size: 0.65rem;
  color: var(--text-dim);
  align-self: flex-end;
}

.install-prompt {
  background-color: rgba(16, 185, 129, 0.08);
  border: 1px solid var(--c-emerald);
  padding: 0.85rem;
  border-radius: 6px;
  text-align: center;
}

.install-prompt code {
  color: var(--c-emerald);
  font-weight: 700;
}

.btn-install-tool {
  margin-top: 0.5rem;
  width: 100%;
  background: var(--c-emerald);
  color: #000;
  font-weight: 800;
  padding: 0.65rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
