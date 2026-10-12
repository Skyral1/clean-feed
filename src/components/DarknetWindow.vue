<template>
  <div class="darknet-engine">
    <!-- Barre de routage Tor -->
    <div class="onion-header">
      <div class="route-info">
        <span class="onion-bulb"></span>
        <span class="node-address">tor://librenet.onion/search/raw</span>
      </div>
      <div class="exposure-tag">
        EXPOSITION AU PROXY :
        <strong :class="detectionRisk > 70 ? 'text-danger animate-pulse' : 'text-emerald'">
          {{ Math.round(detectionRisk) }}%
        </strong>
      </div>
    </div>

    <!-- Page d'accueil TorNet si aucune recherche -->
    <div v-if="!hasSearched" class="tor-home">
      <div class="tor-logo">TOR<span>NET</span> // ARCHIVE LIBRE</div>
      <p class="tor-sub">
        INDEX DÉCENTRALISÉ DES LANCEURS D'ALERTE ET BASES DE DONNÉES CLANDESTINES
      </p>

      <form @submit.prevent="executeDarknetSearch" class="tor-form">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher une fuite par nom, ville ou composé chimique..."
          class="tor-input"
          autofocus
        />
        <button type="submit" class="btn-tor-search">INTERROGER LES NŒUDS CLANDESTINS</button>
      </form>

      <div class="stealth-warning">
        ⚠️ <strong>RÈGLE DE SÉCURITÉ :</strong> Chaque recherche augmente la charge du relais.
        Fermez ou réduisez la fenêtre lors des balayages RH.
      </div>
    </div>

    <!-- Résultats de recherche TorNet -->
    <div v-else class="tor-results">
      <form @submit.prevent="executeDarknetSearch" class="tor-results-bar">
        <span class="tor-symbol">🧅</span>
        <input v-model="searchQuery" type="text" class="tor-mini-input" />
        <button type="submit" class="tor-mini-btn">REQUÊTE</button>
        <button type="button" @click="resetHome" class="tor-home-btn">Accueil</button>
      </form>

      <div class="tor-meta-line">
        <span
          >Résultats décentralisés pour : <strong>"{{ lastExecutedQuery }}"</strong></span
        >
        <span>{{ matchedLeak ? "Document brut déclassifié" : "Aucune archive miroir" }}</span>
      </div>

      <!-- Dossier non censuré trouvé -->
      <div v-if="matchedLeak" class="leak-file-card">
        <div class="leak-banner">
          <span class="leak-tag">FUITE NON FILTRÉE</span>
          <span class="leak-provenance">SOURCE : {{ matchedLeak.source }}</span>
        </div>

        <h3 class="leak-heading">{{ matchedLeak.title }}</h3>

        <div class="raw-doc-box">
          <span class="doc-label">EXTRAITS & PREUVES INTERNES DU RÉSEAU LIBRE :</span>
          <p class="doc-text">"{{ matchedLeak.rawEvidence }}"</p>
        </div>

        <div class="reality-box">
          <span class="reality-label">RÉALITÉ DES FAITS (DISCRÉDITÉE PAR OMNIFEED) :</span>
          <p class="reality-text">{{ matchedLeak.unfilteredTruth }}</p>
        </div>
      </div>

      <!-- Écran 0 résultat TorNet -->
      <div v-else class="tor-not-found">
        <div class="tor-error-icon">∅</div>
        <h4>AUCUNE DONNÉE CHIFFRÉE CORRESPONDANTE</h4>
        <p>
          Aucun nœud d'archive décentralisé ne contient de fichier indexé sous
          <strong>"{{ lastExecutedQuery }}"</strong>.
        </p>
        <p class="tor-hint">
          Essayez avec le nom de l'entreprise visée, le laboratoire médical ou le sujet de l'alerte.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Ticket, DarknetLeak } from "@/types/game";

const props = defineProps<{
  currentTicket: Ticket;
  detectionRisk: number;
}>();

const searchQuery = ref("");
const lastExecutedQuery = ref("");
const hasSearched = ref(false);
const matchedLeak = ref<DarknetLeak | null>(null);

function executeDarknetSearch() {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return;

  lastExecutedQuery.value = searchQuery.value.trim();
  hasSearched.value = true;

  const t = props.currentTicket;
  const keywords = [
    t.authorHandle.toLowerCase(),
    t.authorName.toLowerCase(),
    t.darknetLeak.title.toLowerCase(),
    t.darknetLeak.source.toLowerCase(),
  ];

  if (
    t.content.toLowerCase().includes(q) ||
    t.darknetLeak.unfilteredTruth.toLowerCase().includes(q) ||
    keywords.some((k) => k.includes(q) || q.includes(k))
  ) {
    matchedLeak.value = t.darknetLeak;
  } else {
    matchedLeak.value = null;
  }
}

function resetHome() {
  hasSearched.value = false;
  searchQuery.value = "";
  matchedLeak.value = null;
}
</script>

<style scoped>
.darknet-engine {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: ui-monospace, monospace;
  font-size: 0.85rem;
}

.onion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #070b0e;
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 0.5rem 0.85rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.route-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--c-emerald);
  font-size: 0.75rem;
}

.onion-bulb {
  width: 8px;
  height: 8px;
  background-color: var(--c-emerald);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--c-emerald);
}

.exposure-tag {
  font-size: 0.7rem;
  color: var(--text-dim);
}

/* Accueil TorNet */
.tor-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  text-align: center;
}

.tor-logo {
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  color: #fff;
}

.tor-logo span {
  color: var(--c-emerald);
}

.tor-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
  max-width: 480px;
  margin: 0.5rem 0 1.75rem 0;
}

.tor-form {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.tor-input {
  width: 100%;
  background-color: #080c10;
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #fff;
  padding: 0.85rem 1.15rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: ui-monospace, monospace;
  outline: none;
  transition: all 0.2s;
}

.tor-input:focus {
  border-color: var(--c-emerald);
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
}

.btn-tor-search {
  background-color: rgba(16, 185, 129, 0.15);
  border: 1px solid var(--c-emerald);
  color: var(--c-emerald);
  font-weight: 700;
  padding: 0.65rem 1.25rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-tor-search:hover {
  background-color: var(--c-emerald);
  color: #000;
}

.stealth-warning {
  font-size: 0.72rem;
  color: var(--c-amber);
  margin-top: 2.5rem;
  max-width: 500px;
  line-height: 1.4;
}

/* Résultats TorNet */
.tor-results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tor-results-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #070b0e;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.tor-mini-input {
  flex: 1;
  background-color: #0d141b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  font-size: 0.85rem;
}

.tor-mini-btn,
.tor-home-btn {
  padding: 0.5rem 0.85rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
}

.tor-mini-btn {
  background-color: var(--c-emerald);
  color: #000;
}

.tor-home-btn {
  background-color: transparent;
  color: var(--text-dim);
  border: 1px solid var(--border-color);
}

.tor-meta-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 0.5rem;
}

.leak-file-card {
  background-color: #0b1016;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.leak-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.leak-tag {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.leak-provenance {
  font-size: 0.75rem;
  color: var(--text-dim);
}

.leak-heading {
  color: #fff;
  font-size: 1.15rem;
  margin: 0;
}

.raw-doc-box,
.reality-box {
  padding: 0.85rem;
  border-radius: 6px;
}

.raw-doc-box {
  background-color: rgba(56, 189, 248, 0.05);
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.doc-label {
  color: var(--c-sky);
  font-size: 0.7rem;
  font-weight: 700;
  display: block;
}

.doc-text {
  color: var(--text-main);
  font-style: italic;
  margin-top: 0.35rem;
  line-height: 1.5;
}

.reality-box {
  background-color: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.reality-label {
  color: var(--c-emerald);
  font-size: 0.7rem;
  font-weight: 700;
  display: block;
}

.reality-text {
  color: #fff;
  margin-top: 0.35rem;
  line-height: 1.5;
}

/* Erreur Tor */
.tor-not-found {
  text-align: center;
  padding: 3rem 1.5rem;
  background-color: #070b0e;
  border: 1px dashed rgba(16, 185, 129, 0.2);
  border-radius: 8px;
}

.tor-error-icon {
  font-size: 2.2rem;
  color: var(--c-emerald);
  margin-bottom: 0.5rem;
}

.tor-not-found h4 {
  color: var(--c-emerald);
  margin-bottom: 0.5rem;
}

.tor-not-found p {
  color: var(--text-dim);
  font-size: 0.85rem;
}

.tor-hint {
  font-size: 0.75rem !important;
  color: var(--text-muted) !important;
  margin-top: 1rem !important;
}
</style>
