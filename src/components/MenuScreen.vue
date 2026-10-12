<template>
  <div class="center-screen">
    <div class="menu-container">
      <!-- En-tête avec sélecteur de langue -->
      <div class="top-nav-bar">
        <div class="brand-pill">{{ t("menu_dept") }}</div>
        <div class="language-switch">
          <button
            class="lang-btn"
            :class="{ active: currentLang === 'fr' }"
            @click="switchLanguage('fr')"
          >
            FR
          </button>
          <span class="lang-divider">|</span>
          <button
            class="lang-btn"
            :class="{ active: currentLang === 'en' }"
            @click="switchLanguage('en')"
          >
            EN
          </button>
        </div>
      </div>

      <div class="menu-brand">
        <h1 class="brand-title">CLEAN<span>FEED</span></h1>
        <p class="brand-subtitle">{{ t("menu_subtitle") }}</p>
      </div>

      <div class="briefing-box">
        <div class="briefing-header">{{ t("menu_briefing_header") }}</div>
        <p class="briefing-text">{{ t("menu_briefing_text") }}</p>
        <div class="key-hints">
          <span
            >⌨️ <strong>{{ t("menu_shortcuts") }}</strong></span
          >
          <span
            >🧅 <strong>{{ t("menu_tornet_hint") }}</strong></span
          >
        </div>
      </div>

      <div class="menu-actions">
        <button @click="$emit('start')" class="btn-start">
          {{ t("menu_btn_start") }}
        </button>

        <a
          href="https://github.com/Skyral1/clean-feed"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-github"
        >
          <span class="gh-icon">⌥</span> {{ t("menu_btn_github") }}
        </a>
      </div>

      <div class="menu-footer-info">
        <span>{{ t("menu_server_status") }}</span>
        <a href="https://github.com/Skyral1/clean-feed/issues" target="_blank" rel="noopener">
          {{ t("menu_report_bug") }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { currentLang, setLanguage, t, type Language } from "@/services/i18n";
import { audio } from "@/services/audio";

defineEmits<{ (e: "start"): void }>();

function switchLanguage(lang: Language) {
  audio.playClick(1100);
  setLanguage(lang);
}
</script>

<style scoped>
.top-nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.language-switch {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
}

.lang-btn {
  background: transparent;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  font-weight: 700;
  padding: 0.2rem 0.35rem;
  border-radius: 3px;
  transition: all 0.15s ease;
}

.lang-btn:hover {
  color: #fff;
}

.lang-btn.active {
  background-color: var(--c-sky);
  color: #07090c;
}

.lang-divider {
  color: var(--border-color);
}

.key-hints {
  margin-top: 0.85rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: var(--c-sky);
  font-family: ui-monospace, monospace;
}

.menu-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-github {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 700;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-family: ui-monospace, monospace;
}

.btn-github:hover {
  background-color: var(--bg-card-hover);
  border-color: var(--c-sky);
  color: var(--c-sky);
}

.gh-icon {
  font-size: 1rem;
}

.menu-footer-info {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: var(--text-muted);
  font-family: ui-monospace, monospace;
}

.menu-footer-info a {
  color: var(--text-muted);
  text-decoration: none;
}

.menu-footer-info a:hover {
  color: var(--c-sky);
  text-decoration: underline;
}
</style>
