<template>
  <div
    v-show="!window.isMinimized"
    class="os-window"
    :style="{
      left: `${window.x}px`,
      top: `${window.y}px`,
      width: `${window.width}px`,
      height: `${window.height}px`,
      zIndex: window.zIndex,
    }"
    @mousedown="$emit('focus')"
  >
    <!-- Barre de titre déplaçable -->
    <div class="window-titlebar" @mousedown="startDrag">
      <div class="titlebar-title">
        <span class="window-icon">{{ window.icon }}</span>
        <span>{{ window.title }}</span>
      </div>
      <div class="titlebar-controls" @mousedown.stop>
        <button class="win-btn" title="Réduire" @click="$emit('minimize')">_</button>
        <button class="win-btn close" title="Fermer" @click="$emit('close')">✕</button>
      </div>
    </div>

    <!-- Contenu scrollable de la fenêtre -->
    <div class="window-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WindowState } from "@/types/game";

const props = defineProps<{
  window: WindowState;
}>();

const emit = defineEmits<{
  (e: "focus"): void;
  (e: "minimize"): void;
  (e: "close"): void;
  (e: "move", coords: { x: number; y: number }): void;
}>();

let isDragging = false;
let startX = 0;
let startY = 0;
let initialX = 0;
let initialY = 0;

function startDrag(e: MouseEvent) {
  emit("focus");
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  initialX = props.window.x;
  initialY = props.window.y;

  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", stopDrag);
}

function onDrag(e: MouseEvent) {
  if (!isDragging) return;
  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;

  const newX = Math.max(10, Math.min(window.innerWidth - 120, initialX + deltaX));
  const newY = Math.max(45, Math.min(window.innerHeight - 80, initialY + deltaY));

  emit("move", { x: newX, y: newY });
}

function stopDrag() {
  isDragging = false;
  window.removeEventListener("mousemove", onDrag);
  window.removeEventListener("mouseup", stopDrag);
}
</script>

<style scoped>
.os-window {
  position: absolute;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  user-select: none;
}

.window-titlebar {
  height: 38px;
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.85rem;
  cursor: move;
}

.titlebar-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-main);
  font-family: ui-monospace, monospace;
}

.titlebar-controls {
  display: flex;
  gap: 0.35rem;
}

.win-btn {
  width: 24px;
  height: 22px;
  background-color: #1a222c;
  border: 1px solid var(--border-color);
  color: var(--text-dim);
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.win-btn:hover {
  background-color: #273544;
  color: #fff;
}

.win-btn.close:hover {
  background-color: var(--c-danger);
  border-color: var(--c-danger);
  color: #fff;
}

.window-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  background-color: var(--bg-surface);
}
</style>
