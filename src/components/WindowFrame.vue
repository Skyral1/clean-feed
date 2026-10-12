<template>
  <div
    v-show="!window.isMinimized"
    class="os-window"
    :class="{
      'is-maximized': isMaximized,
      'is-focused': isTopFocus,
    }"
    :style="windowStyle"
    @mousedown="$emit('focus')"
  >
    <!-- Poignées de redimensionnement (8 directions) -->
    <template v-if="!isMaximized">
      <div class="resize-handle handle-n" @mousedown.prevent.stop="startResize($event, 'n')"></div>
      <div class="resize-handle handle-s" @mousedown.prevent.stop="startResize($event, 's')"></div>
      <div class="resize-handle handle-e" @mousedown.prevent.stop="startResize($event, 'e')"></div>
      <div class="resize-handle handle-w" @mousedown.prevent.stop="startResize($event, 'w')"></div>
      <div
        class="resize-handle handle-ne"
        @mousedown.prevent.stop="startResize($event, 'ne')"
      ></div>
      <div
        class="resize-handle handle-nw"
        @mousedown.prevent.stop="startResize($event, 'nw')"
      ></div>
      <div
        class="resize-handle handle-se"
        @mousedown.prevent.stop="startResize($event, 'se')"
      ></div>
      <div
        class="resize-handle handle-sw"
        @mousedown.prevent.stop="startResize($event, 'sw')"
      ></div>
    </template>

    <!-- Barre de titre de style OS moderne -->
    <div class="window-titlebar" @mousedown="startDrag" @dblclick="toggleMaximize">
      <div class="titlebar-left">
        <span class="window-icon">{{ window.icon }}</span>
        <span class="window-title-text">{{ window.title }}</span>
      </div>

      <!-- Boutons de contrôle (Minimiser, Maximiser, Fermer) -->
      <div class="titlebar-controls" @mousedown.stop>
        <button class="win-control-btn btn-min" title="Réduire" @click="$emit('minimize')">
          <svg width="10" height="2" viewBox="0 0 10 2">
            <rect width="10" height="2" fill="currentColor" />
          </svg>
        </button>
        <button
          class="win-control-btn btn-max"
          :title="isMaximized ? 'Restaurer' : 'Agrandir'"
          @click="toggleMaximize"
        >
          <svg v-if="!isMaximized" width="10" height="10" viewBox="0 0 10 10">
            <rect width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" />
          </svg>
          <svg v-else width="10" height="10" viewBox="0 0 10 10">
            <rect
              x="2"
              y="0"
              width="8"
              height="8"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <rect
              x="0"
              y="2"
              width="8"
              height="8"
              fill="var(--bg-card)"
              stroke="currentColor"
              stroke-width="1.5"
            />
          </svg>
        </button>
        <button class="win-control-btn btn-close" title="Fermer" @click="$emit('close')">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" stroke-width="2" />
            <line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" stroke-width="2" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Corps de la fenêtre avec barre de défilement stylisée -->
    <div class="window-viewport custom-scroll">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { WindowState } from "@/types/game";

const props = defineProps<{
  window: WindowState;
  isTopFocus?: boolean;
}>();

const emit = defineEmits<{
  (e: "focus"): void;
  (e: "minimize"): void;
  (e: "close"): void;
  (e: "move", coords: { x: number; y: number }): void;
  (e: "resize", rect: { x: number; y: number; width: number; height: number }): void;
}>();

const isMaximized = ref(false);
const prevRect = ref({ x: 0, y: 0, width: 0, height: 0 });

const windowStyle = computed(() => {
  if (isMaximized.value) {
    return {
      left: "0px",
      top: "40px",
      width: "100%",
      height: "calc(100vh - 84px)",
      zIndex: props.window.zIndex,
      borderRadius: "0px",
    };
  }
  return {
    left: `${props.window.x}px`,
    top: `${props.window.y}px`,
    width: `${props.window.width}px`,
    height: `${props.window.height}px`,
    zIndex: props.window.zIndex,
  };
});

function toggleMaximize() {
  emit("focus");
  if (!isMaximized.value) {
    prevRect.value = {
      x: props.window.x,
      y: props.window.y,
      width: props.window.width,
      height: props.window.height,
    };
    isMaximized.value = true;
  } else {
    isMaximized.value = false;
    emit("resize", prevRect.value);
  }
}

// Déplacement à la souris
let isDragging = false;
let startMouseX = 0;
let startMouseY = 0;
let initialX = 0;
let initialY = 0;

function startDrag(e: MouseEvent) {
  if (isMaximized.value) return;
  emit("focus");
  isDragging = true;
  startMouseX = e.clientX;
  startMouseY = e.clientY;
  initialX = props.window.x;
  initialY = props.window.y;

  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", stopDrag);
}

function onDrag(e: MouseEvent) {
  if (!isDragging) return;
  const deltaX = e.clientX - startMouseX;
  const deltaY = e.clientY - startMouseY;

  const newX = Math.max(
    -props.window.width + 100,
    Math.min(window.innerWidth - 80, initialX + deltaX),
  );
  const newY = Math.max(40, Math.min(window.innerHeight - 80, initialY + deltaY));

  emit("move", { x: newX, y: newY });
}

function stopDrag() {
  isDragging = false;
  window.removeEventListener("mousemove", onDrag);
  window.removeEventListener("mouseup", stopDrag);
}

// Redimensionnement fluide aux 8 points de contact
let activeDirection = "";
let resizeStartX = 0;
let resizeStartY = 0;
let initialRect = { x: 0, y: 0, width: 0, height: 0 };

function startResize(e: MouseEvent, direction: string) {
  emit("focus");
  activeDirection = direction;
  resizeStartX = e.clientX;
  resizeStartY = e.clientY;
  initialRect = {
    x: props.window.x,
    y: props.window.y,
    width: props.window.width,
    height: props.window.height,
  };

  window.addEventListener("mousemove", onResize);
  window.addEventListener("mouseup", stopResize);
}

function onResize(e: MouseEvent) {
  if (!activeDirection) return;
  const dx = e.clientX - resizeStartX;
  const dy = e.clientY - resizeStartY;

  let { x, y, width, height } = initialRect;
  const minW = 360;
  const minH = 260;

  if (activeDirection.includes("e")) {
    width = Math.max(minW, initialRect.width + dx);
  }
  if (activeDirection.includes("s")) {
    height = Math.max(minH, initialRect.height + dy);
  }
  if (activeDirection.includes("w")) {
    const candidateWidth = initialRect.width - dx;
    if (candidateWidth > minW) {
      width = candidateWidth;
      x = initialRect.x + dx;
    }
  }
  if (activeDirection.includes("n")) {
    const candidateHeight = initialRect.height - dy;
    if (candidateHeight > minH) {
      height = candidateHeight;
      y = initialRect.y + dy;
    }
  }

  emit("resize", { x, y, width, height });
}

function stopResize() {
  activeDirection = "";
  window.removeEventListener("mousemove", onResize);
  window.removeEventListener("mouseup", stopResize);
}
</script>

<style scoped>
.os-window {
  position: absolute;
  background-color: rgba(18, 24, 32, 0.94);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  box-shadow:
    0 18px 45px rgba(0, 0, 0, 0.65),
    0 2px 10px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  user-select: none;
  transition: box-shadow 0.2s;
}

.os-window.is-focused {
  border-color: rgba(56, 189, 248, 0.45);
  box-shadow:
    0 22px 55px rgba(0, 0, 0, 0.8),
    0 0 15px rgba(56, 189, 248, 0.15);
}

.os-window.is-maximized {
  box-shadow: none;
}

/* Barre de titre */
.window-titlebar {
  height: 38px;
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(20, 28, 40, 0.8) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.85rem;
  cursor: grab;
}

.window-titlebar:active {
  cursor: grabbing;
}

.titlebar-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #f1f5f9;
  letter-spacing: 0.02em;
}

.window-icon {
  font-size: 0.9rem;
}

.titlebar-controls {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.win-control-btn {
  width: 28px;
  height: 24px;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.win-control-btn:hover {
  background-color: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.win-control-btn.btn-close:hover {
  background-color: #ef4444;
  color: #fff;
}

.window-viewport {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  background-color: transparent;
}

/* Poignées invisibles de redimensionnement */
.resize-handle {
  position: absolute;
  z-index: 10;
}

.handle-n {
  top: 0;
  left: 6px;
  right: 6px;
  height: 6px;
  cursor: n-resize;
}
.handle-s {
  bottom: 0;
  left: 6px;
  right: 6px;
  height: 6px;
  cursor: s-resize;
}
.handle-e {
  top: 6px;
  bottom: 6px;
  right: 0;
  width: 6px;
  cursor: e-resize;
}
.handle-w {
  top: 6px;
  bottom: 6px;
  left: 0;
  width: 6px;
  cursor: w-resize;
}
.handle-ne {
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  cursor: ne-resize;
}
.handle-nw {
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
  cursor: nw-resize;
}
.handle-se {
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  cursor: se-resize;
}
.handle-sw {
  bottom: 0;
  left: 0;
  width: 10px;
  height: 10px;
  cursor: sw-resize;
}
</style>
