<template>
  <aside class="audit-column">
    <div class="audit-tabs">
      <button
        @click="$emit('update:activeTab', 'history')"
        class="tab-btn"
        :class="{ active: activeTab === 'history' }"
      >
        [1] Antécédents
      </button>
      <button
        @click="$emit('update:activeTab', 'rules')"
        class="tab-btn"
        :class="{ active: activeTab === 'rules' }"
      >
        [2] Directive RH
      </button>
      <button
        @click="$emit('update:activeTab', 'ethics')"
        class="tab-btn"
        :class="{ active: activeTab === 'ethics' }"
      >
        [3] Éthique
      </button>
    </div>

    <div class="audit-content">
      <!-- Onglet 1 : Profil & Antécédents -->
      <div v-if="activeTab === 'history'" class="tab-pane">
        <div class="data-grid">
          <div class="data-row">
            <span class="data-k">Ancienneté :</span>
            <span class="data-v">{{ ticket.userHistory.accountAge }}</span>
          </div>
          <div class="data-row">
            <span class="data-k">Score de confiance :</span>
            <span
              class="data-v font-bold"
              :class="ticket.userHistory.trustScore > 70 ? 'text-emerald' : 'text-danger'"
            >
              {{ ticket.userHistory.trustScore }} / 100
            </span>
          </div>
          <div class="data-row">
            <span class="data-k">Infractions passées :</span>
            <span class="data-v text-amber"
              >{{ ticket.userHistory.previousStrikes }} signalement(s)</span
            >
          </div>
          <div class="data-row">
            <span class="data-k">Identité réelle :</span>
            <span class="data-v text-sky">{{ ticket.userHistory.realIdentityStatus }}</span>
          </div>
        </div>

        <div class="info-block">
          <span class="block-title">RAPPORT DE SURVEILLANCE :</span>
          <p class="block-text italic">"{{ ticket.userHistory.backgroundNotes }}"</p>
        </div>

        <div class="info-block">
          <span class="block-title">MOTIFS RÉCENTS :</span>
          <ul class="bullet-list">
            <li v-for="(flag, i) in ticket.userHistory.recentFlags" :key="i">
              {{ flag }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Onglet 2 : Directive d'entreprise -->
      <div v-if="activeTab === 'rules'" class="tab-pane">
        <div class="rule-card">
          <div class="rule-id">{{ ticket.rule.id }}</div>
          <div class="rule-cat">{{ ticket.rule.category }}</div>
        </div>

        <div class="info-block">
          <span class="block-title">TEXTE DU RÈGLEMENT :</span>
          <p class="block-text">{{ ticket.rule.directiveSummary }}</p>
        </div>

        <div class="corporate-order-card">
          <div class="order-badge">ORDRE STRICT DE LA DIRECTION</div>
          <div class="order-action">
            ACTION ATTENDUE :
            <strong>{{
              (ticket.corporateDirectiveOverride || ticket.rule.companyStandard).toUpperCase()
            }}</strong>
          </div>
          <p class="order-hint">Note interne : {{ ticket.contextHint }}</p>
        </div>
      </div>

      <!-- Onglet 3 : Répercussions éthiques -->
      <div v-if="activeTab === 'ethics'" class="tab-pane">
        <div class="ethics-recommendation">
          <span class="block-title text-emerald">UTILITÉ PUBLIQUE</span>
          <p class="block-text">
            Action morale recommandée :
            <strong class="text-emerald">
              {{ ticket.rule.ethicalStandard === "approve" ? "MAINTENIR" : "CENSURER" }}
            </strong>
          </p>
        </div>

        <div class="consequence-item">
          <span class="consequence-label text-danger">SI VOUS CENSUREZ :</span>
          <p class="block-text">
            {{ ticket.consequences.onReject.societalImpactDesc }}
          </p>
        </div>

        <div class="consequence-item">
          <span class="consequence-label text-emerald">SI VOUS VALIDEZ :</span>
          <p class="block-text">
            {{ ticket.consequences.onApprove.societalImpactDesc }}
          </p>
        </div>
      </div>
    </div>

    <!-- Boutons d'action -->
    <div class="action-footer">
      <button @click="$emit('decide', 'reject')" class="btn-action btn-reject">
        <span class="shortcut-tag">[Q]</span> CENSURER
      </button>
      <button @click="$emit('decide', 'approve')" class="btn-action btn-approve">
        <span class="shortcut-tag">[E]</span> VALIDER
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { Ticket, ModerationAction } from "@/types/game";

defineProps<{
  ticket: Ticket;
  activeTab: "history" | "rules" | "ethics";
}>();

defineEmits<{
  (e: "update:activeTab", tab: "history" | "rules" | "ethics"): void;
  (e: "decide", action: ModerationAction): void;
}>();
</script>
