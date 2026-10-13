<template>
  <div class="intranet-browser">
    <!-- Barre de navigation type navigateur d'entreprise -->
    <div class="browser-navbar">
      <div class="url-bar">
        <span class="url-protocol">https://intranet.omnifeed.corp/archive/search</span>
      </div>
    </div>

    <!-- Page d'accueil du moteur si aucune recherche -->
    <div v-if="!hasSearched" class="portal-home">
      <div class="portal-logo"><span class="logo-mark">❖</span> OMNI<span>SEARCH</span></div>
      <p class="portal-sub">
        {{ t("search_sub") }}
      </p>

      <form @submit.prevent="executeSearch()" class="search-form">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('search_placeholder')"
          class="interactive-search-input"
          autofocus
        />
        <div class="search-actions">
          <button type="submit" class="btn-portal-search">
            {{ t("search_btn") }}
          </button>
        </div>
      </form>

      <div class="portal-notice">
        {{ t("search_notice") }}
      </div>
    </div>

    <!-- Page de résultats après recherche -->
    <div v-else class="results-screen">
      <!-- Barre de recherche supérieure de résultats -->
      <form @submit.prevent="executeSearch()" class="results-bar">
        <span class="mini-logo">❖</span>
        <input v-model="searchQuery" type="text" class="mini-search-input" />
        <button type="submit" class="mini-search-btn">{{ t("search_scan") }}</button>
        <button type="button" @click="resetHome" class="mini-home-btn" :title="t('search_home')">
          {{ t("search_home") }}
        </button>
      </form>

      <div class="results-meta">
        <span>
          {{ t("search_results_for") }} <strong>"{{ lastExecutedQuery }}"</strong>
        </span>
        <span>{{ matchedRecord ? t("search_found_doc") : t("search_zero_doc") }}</span>
      </div>

      <!-- Fiche officielle trouvée -->
      <div v-if="matchedRecord" class="official-archive-card">
        <div class="card-top">
          <div>
            <h3 class="record-title">{{ matchedRecord.title }}</h3>
            <span class="record-category">{{ matchedRecord.category }}</span>
          </div>
          <span class="risk-badge" :class="riskClass">{{ matchedRecord.riskRating }}</span>
        </div>

        <div class="record-content-box">
          <span class="box-caption">{{ t("search_intel_summary") }}</span>
          <p class="box-text">{{ matchedRecord.summary }}</p>
        </div>

        <div class="directive-box">
          <span class="directive-caption">{{ t("search_directive_caption") }}</span>
          <p class="directive-text">
            {{ matchedRecord.corporateActionDirective }}
          </p>
        </div>
      </div>

      <!-- Écran 0 résultat -->
      <div v-else class="not-found-card">
        <div class="not-found-icon">⚠️</div>
        <h4>{{ t("search_not_found") }}</h4>
        <p>
          {{ t("search_not_found_desc") }}
          <strong>"{{ lastExecutedQuery }}"</strong>.
        </p>
        <p class="not-found-tips">
          {{
            currentLang === "en"
              ? "Check username spelling (@...), person's surname or corporate subsidiary."
              : "Vérifiez l'orthographe du pseudonyme (@...), le patronyme de la personne ou le nom de la filiale."
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import type { Ticket, IntranetRecord } from "@/types/game";
import { t, currentLang } from "@/services/i18n";

const props = defineProps<{
  currentTicket: Ticket;
  initialQuery?: string;
}>();

const searchQuery = ref(props.initialQuery || "");
const lastExecutedQuery = ref("");
const hasSearched = ref(false);
const matchedRecord = ref<IntranetRecord | null>(null);

function executeSearch(queryOverride?: string) {
  const queryToRun = (queryOverride !== undefined ? queryOverride : searchQuery.value).trim();
  if (!queryToRun) return;

  searchQuery.value = queryToRun;
  lastExecutedQuery.value = queryToRun;
  hasSearched.value = true;

  const q = queryToRun.toLowerCase();
  const t = props.currentTicket;

  const keywords = [
    t.authorHandle.toLowerCase(),
    t.authorName.toLowerCase(),
    t.rule.category.toLowerCase(),
    t.id.toLowerCase(),
  ];

  if (t.content.toLowerCase().includes(q) || keywords.some((k) => k.includes(q) || q.includes(k))) {
    matchedRecord.value = t.intranetRecord;
  } else {
    matchedRecord.value = null;
  }
}

function resetHome() {
  hasSearched.value = false;
  searchQuery.value = "";
  matchedRecord.value = null;
}

const riskClass = computed(() => {
  if (!matchedRecord.value) return "";
  if (
    matchedRecord.value.riskRating.includes("Menace") ||
    matchedRecord.value.riskRating.includes("Threat")
  ) {
    return "risk-extreme";
  }
  if (matchedRecord.value.riskRating === "Élevé" || matchedRecord.value.riskRating === "High") {
    return "risk-high";
  }
  return "risk-normal";
});

// Relance la recherche sur le ticket courant lors d'un changement de langue
watch(currentLang, () => {
  if (hasSearched.value) {
    executeSearch(lastExecutedQuery.value);
  }
});

// Écoute les requêtes rapides déclenchées depuis d'autres fenêtres
watch(
  () => props.initialQuery,
  (newVal) => {
    if (newVal) {
      executeSearch(newVal);
    }
  },
);

onMounted(() => {
  if (props.initialQuery) {
    executeSearch(props.initialQuery);
  }
});
</script>

<style scoped>
.intranet-browser {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 0.85rem;
}

.browser-navbar {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.45rem 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.url-bar {
  background-color: #0b0f14;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.35rem 0.65rem;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  color: var(--c-sky);
}

/* Page d'accueil portail */
.portal-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  text-align: center;
}

.portal-logo {
  font-size: 2.2rem;
  font-weight: 900;
  font-family: ui-monospace, monospace;
  letter-spacing: 0.08em;
  color: #fff;
}

.portal-logo span {
  color: var(--c-sky);
}

.logo-mark {
  color: var(--c-sky);
  margin-right: 0.35rem;
}

.portal-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
  max-width: 480px;
  margin: 0.5rem 0 1.75rem 0;
  letter-spacing: 0.04em;
}

.search-form {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.interactive-search-input {
  width: 100%;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  color: #fff;
  padding: 0.85rem 1.15rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: ui-monospace, monospace;
  outline: none;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.interactive-search-input:focus {
  border-color: var(--c-sky);
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.25);
}

.btn-portal-search {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  color: #fff;
  font-weight: 700;
  padding: 0.65rem 1.25rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.15s;
}

.btn-portal-search:hover {
  background-color: var(--c-sky);
  color: #000;
  border-color: var(--c-sky);
}

.portal-notice {
  font-size: 0.68rem;
  color: var(--text-muted);
  margin-top: 3rem;
  font-family: ui-monospace, monospace;
}

/* Page de résultats */
.results-screen {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.results-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--bg-card);
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.mini-logo {
  color: var(--c-sky);
  font-size: 1.2rem;
  margin-left: 0.5rem;
}

.mini-search-input {
  flex: 1;
  background-color: #090d12;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  font-size: 0.85rem;
}

.mini-search-btn,
.mini-home-btn {
  padding: 0.5rem 0.85rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
}

.mini-search-btn {
  background-color: var(--c-sky);
  color: #000;
}

.mini-home-btn {
  background-color: transparent;
  color: var(--text-dim);
  border: 1px solid var(--border-color);
}

.results-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 0.5rem;
}

.official-archive-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.record-title {
  color: #fff;
  font-size: 1.1rem;
  margin: 0;
}

.record-category {
  font-size: 0.75rem;
  color: var(--c-sky);
  margin-top: 0.2rem;
  display: inline-block;
}

.risk-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
}

.risk-extreme {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
}
.risk-high {
  background-color: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid #f59e0b;
}
.risk-normal {
  background-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid #10b981;
}

.box-caption,
.directive-caption {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 0.35rem;
  display: block;
}

.box-caption {
  color: var(--text-muted);
}
.box-text {
  color: var(--text-dim);
  line-height: 1.5;
  margin: 0;
}

.directive-box {
  background-color: rgba(239, 68, 68, 0.08);
  border-left: 3px solid var(--c-danger);
  padding: 0.85rem;
  border-radius: 0 6px 6px 0;
}

.directive-caption {
  color: var(--c-danger);
}
.directive-text {
  color: #fff;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
}

/* Non trouvé */
.not-found-card {
  text-align: center;
  padding: 3rem 1.5rem;
  background-color: var(--bg-card);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.not-found-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.not-found-card h4 {
  color: var(--c-amber);
  margin-bottom: 0.5rem;
}

.not-found-card p {
  color: var(--text-dim);
  font-size: 0.85rem;
  max-width: 420px;
  margin: 0 auto;
}

.not-found-tips {
  font-size: 0.75rem !important;
  color: var(--text-muted) !important;
  margin-top: 1rem !important;
}
</style>
