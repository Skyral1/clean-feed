<template>
  <div class="handbook-body">
    <div class="rule-top">
      <span class="rule-tag">{{ ticket.rule.id }}</span>
      <span class="cat-tag">{{ ticket.rule.category }}</span>
    </div>

    <div class="directive-box">
      <span class="box-title">ARTICLE DU RÈGLEMENT CORPORATISTE :</span>
      <p class="box-desc">{{ ticket.rule.directiveSummary }}</p>
    </div>

    <div class="order-box">
      <span class="box-title text-danger">DIRECTIVE INTERNE STRICTE :</span>
      <p class="order-action">
        Action obligatoire pour la rétribution :
        <strong>{{
          (ticket.corporateDirectiveOverride || ticket.rule.companyStandard).toUpperCase()
        }}</strong>
      </p>
      <p class="hint-text">Note stratégique : {{ ticket.contextHint }}</p>
    </div>

    <div class="ethics-box">
      <span class="box-title text-emerald">ANALYSE D'IMPACT SOCIÉTAL :</span>
      <div class="choice-consequence">
        <p>
          <strong>Si vous censurez :</strong>
          {{ ticket.consequences.onReject.societalImpactDesc }}
        </p>
        <p>
          <strong>Si vous validez :</strong>
          {{ ticket.consequences.onApprove.societalImpactDesc }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ticket } from "@/types/game";

defineProps<{
  ticket: Ticket;
}>();
</script>

<style scoped>
.handbook-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.85rem;
}

.rule-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.rule-tag {
  color: var(--c-amber);
  font-weight: 700;
  font-family: ui-monospace, monospace;
}

.cat-tag {
  color: var(--text-dim);
  font-size: 0.75rem;
}

.directive-box,
.order-box,
.ethics-box {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.85rem;
  border-radius: 6px;
}

.box-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  display: block;
  margin-bottom: 0.35rem;
}

.box-desc {
  color: var(--text-dim);
  line-height: 1.5;
}

.order-box {
  border-left: 3px solid var(--c-danger);
  background-color: rgba(239, 68, 68, 0.05);
}

.order-action {
  font-size: 0.95rem;
  color: #fff;
  margin: 0.3rem 0;
}

.hint-text {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.ethics-box {
  border-left: 3px solid var(--c-emerald);
  background-color: rgba(16, 185, 129, 0.05);
}

.choice-consequence {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--text-dim);
}
</style>
