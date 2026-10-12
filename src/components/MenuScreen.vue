<template>
  <div class="center-screen">
    <div class="menu-container">
      <div class="menu-brand">
        <div class="brand-pill">OMNIFEED NETWORKS // DÉPARTEMENT DE MODÉRATION 409</div>
        <h1 class="brand-title">CLEAN<span>FEED</span></h1>
        <p class="brand-subtitle">POSTE DE RÉGULATION SOCIÉTALE EN TÉLÉ-TRAVAIL</p>
      </div>

      <div class="briefing-box">
        <div class="briefing-header">AVERTISSEMENT LÉGAL - CONTRAT ART. 11-B</div>
        <p class="briefing-text">
          Votre rôle consiste à réguler le flux d'informations publiques sous cadence chronométrée.
          Toute désobéissance aux directives de nos partenaires annonceurs sera déduite de votre
          solde de subsistance.
        </p>
      </div>

      <div class="menu-actions">
        <button @click="$emit('start')" class="btn-start">
          INITIALISER LE TERMINAL // CONNEXION AGENT
        </button>
      </div>

      <div class="menu-footer-info">
        <span>LATENCE SERVEUR : 14ms (NOEUD-CHARLEROI)</span>
        <span>VERSION : 2.0.0-PROD</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{ (e: "start"): void }>();
</script>
