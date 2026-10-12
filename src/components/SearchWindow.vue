<template>
  <div class="search-engine">
    <div class="search-bar-box">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par identifiant (@elena), mot-clé (AeroSteel) ou catégorie..."
        class="search-input"
        @keyup.enter="performSearch"
      />
      <button @click="performSearch" class="search-btn">SCANNER L'INTRANET</button>
    </div>

    <!-- Suggestions de recherche rapide -->
    <div class="quick-keywords">
      <span>Requêtes rapides :</span>
      <button @click="quickSearch(currentTicket.authorHandle)" class="badge-quick">
        {{ currentTicket.authorHandle }}
      </button>
      <button @click="quickSearch(currentTicket.rule.category)" class="badge-quick">
        {{ currentTicket.rule.category }}
      </button>
    </div>

    <!-- Résultats de recherche -->
    <div class="search-results">
      <div v-if="searchResult" class="result-card">
        <div class="result-header">
          <span class="text-sky font-bold">{{ searchResult.title }}</span>
          <span
            class="trust-pill"
            :class="searchResult.trustScore > 70 ? 'text-emerald' : 'text-danger'"
          >
            SCORE DE CONFIANCE : {{ searchResult.trustScore }}/100
          </span>
        </div>

        <div class="result-details">
          <p><strong>Identité :</strong> {{ searchResult.identity }}</p>
          <p><strong>Ancienneté :</strong> {{ searchResult.age }}</p>
          <p>
            <strong>Historique de signalements :</strong>
            {{ searchResult.strikes }} avertissement(s)
          </p>
        </div>

        <div class="result-intel">
          <span class="intel-title">EXTRAIT DU DOSSIER DE SURVEILLANCE :</span>
          <p class="intel-text">"{{ searchResult.notes }}"</p>
        </div>

        <div class="result-flags">
          <span class="intel-title">SIGNALEMENTS DÉTECTÉS :</span>
          <ul>
            <li v-for="(f, idx) in searchResult.flags" :key="idx">{{ f }}</li>
          </ul>
        </div>
      </div>

      <div v-else class="empty-search">
        <p>Saisissez un critère de recherche pour interroger la base centrale de surveillance.</p>
        <p class="empty-hint">
          Tapez le nom de l'auteur actuel pour afficher sa fiche d'antécédents.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Ticket } from "@/types/game";

const props = defineProps<{
  currentTicket: Ticket;
}>();

const searchQuery = ref(props.currentTicket.authorHandle);
const searchResult = ref<any | null>(null);

function performSearch() {
  const query = searchQuery.value.toLowerCase().trim();
  const ticket = props.currentTicket;

  if (
    query.includes(ticket.authorHandle.toLowerCase()) ||
    query.includes(ticket.authorName.toLowerCase()) ||
    query.includes(ticket.rule.category.toLowerCase()) ||
    ticket.content.toLowerCase().includes(query)
  ) {
    searchResult.value = {
      title: `${ticket.authorName} (${ticket.authorHandle})`,
      trustScore: ticket.userHistory.trustScore,
      identity: ticket.userHistory.realIdentityStatus,
      age: ticket.userHistory.accountAge,
      strikes: ticket.userHistory.previousStrikes,
      notes: ticket.userHistory.backgroundNotes,
      flags: ticket.userHistory.recentFlags,
    };
  } else {
    searchResult.value = null;
  }
}

function quickSearch(val: string) {
  searchQuery.value = val;
  performSearch();
}

// Initialiser avec l'auteur actuel
performSearch();
</script>

<style scoped>
.search-engine {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.85rem;
}

.search-bar-box {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  color: #fff;
  padding: 0.65rem 0.85rem;
  border-radius: 6px;
  font-family: ui-monospace, monospace;
  font-size: 0.85rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--c-sky);
}

.search-btn {
  background-color: var(--c-sky);
  color: #000;
  font-weight: 700;
  border: none;
  padding: 0 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
}

.quick-keywords {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-dim);
}

.badge-quick {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--c-sky);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: ui-monospace, monospace;
}

.result-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.result-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 0.5rem;
}

.trust-pill {
  font-weight: 700;
  font-family: ui-monospace, monospace;
}

.result-details p {
  margin: 0.2rem 0;
  color: var(--text-dim);
}

.intel-title {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--c-amber);
  margin-bottom: 0.35rem;
}

.intel-text {
  background-color: #0b1016;
  border: 1px solid var(--border-color);
  padding: 0.75rem;
  border-radius: 4px;
  font-style: italic;
  color: var(--text-main);
}

.result-flags ul {
  padding-left: 1.25rem;
  color: var(--text-dim);
}

.empty-search {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-dim);
}

.empty-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}
</style>
