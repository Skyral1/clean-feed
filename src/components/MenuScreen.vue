<template>
  <div class="center-screen">
    <div class="menu-container">
      <div class="menu-brand">
        <div class="brand-pill">OMNIFEED NETWORKS // DÉPARTEMENT 409</div>
        <h1 class="brand-title">CLEAN<span>FEED</span></h1>
        <p class="brand-subtitle">POSTE DE MODÉRATION ET SALUBRITÉ DU RÉSEAU NUMÉRIQUE</p>
      </div>

      <div class="briefing-box">
        <div class="briefing-header">DIRECTIVES DU QUART - VERSION 2.1.0</div>
        <p class="briefing-text">
          Votre rôle consiste à réguler le flux d'informations sous surveillance algorithmique.
          Respectez les directives corporatives pour percevoir votre salaire journalier et payer
          votre loyer.
        </p>
        <div class="key-hints">
          <span>⌨️ <strong>Raccourcis :</strong> [Q] Rejeter / [E] Valider</span>
          <span>🧅 <strong>TorNet :</strong> Surveillance RH active pendant la consultation</span>
        </div>
      </div>

      <div class="menu-actions">
        <button @click="$emit('start')" class="btn-start">
          INITIALISER LE TERMINAL // ENTRER EN SERVICE
        </button>

        <a
          href="https://github.com/Skyral1/clean-feed"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-github"
        >
          <span class="gh-icon">⌥</span> VOIR LE CODE SOURCE SUR GITHUB ↗
        </a>
      </div>

      <div class="menu-footer-info">
        <span>NOEUD-CHARLEROI-SECURE // STATUT : EN LIGNE</span>
        <a href="https://github.com/Skyral1/clean-feed/issues" target="_blank" rel="noopener">
          SIGNALER UN BUG
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{ (e: "start"): void }>();
</script>

<style scoped>
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
