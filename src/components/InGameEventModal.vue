<template>
	<div v-if="event" class="event-modal-backdrop">
		<div class="event-card" :class="event.type">
			<div class="event-header">
				<span class="event-tag"
					>ALERTE SYSTÈME // {{ event.type.toUpperCase() }}</span
				>
				<span class="event-icon">⚡</span>
			</div>

			<h3 class="event-title">{{ event.title }}</h3>
			<p class="event-desc">{{ event.description }}</p>

			<div class="event-actions">
				<button
					v-for="(choice, idx) in event.choices"
					:key="idx"
					class="choice-button"
					@click="choice.action"
				>
					{{ choice.label }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { GameEvent } from "@/types/game";

defineProps<{
	event: GameEvent | null;
}>();
</script>

<style scoped>
.event-modal-backdrop {
	position: absolute;
	inset: 0;
	background: rgba(8, 12, 18, 0.75);
	backdrop-filter: blur(5px);
	z-index: 9998;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1.5rem;
}

.event-card {
	width: 100%;
	max-width: 460px;
	background: var(--bg-card);
	border: 1px solid var(--border-color);
	border-radius: 8px;
	padding: 1.5rem;
	box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.event-card.ddos {
	border-color: var(--c-danger);
	box-shadow: 0 0 25px rgba(239, 68, 68, 0.35);
}

.event-card.leak {
	border-color: var(--c-emerald);
	box-shadow: 0 0 25px rgba(16, 185, 129, 0.35);
}

.event-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-family: ui-monospace, monospace;
	font-size: 0.75rem;
	font-weight: 700;
	color: var(--c-amber);
}

.event-title {
	color: #fff;
	font-size: 1.15rem;
	font-weight: 800;
}

.event-desc {
	font-size: 0.85rem;
	color: var(--text-dim);
	line-height: 1.5;
}

.event-actions {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin-top: 0.5rem;
}

.choice-button {
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid var(--border-color);
	color: #fff;
	padding: 0.75rem;
	border-radius: 4px;
	cursor: pointer;
	font-weight: 700;
	font-size: 0.82rem;
	transition: all 0.15s ease;
}

.choice-button:hover {
	background: var(--c-sky);
	color: #07090c;
	border-color: var(--c-sky);
}
</style>
