<template>
  <div class="center-screen">
    <div class="prologue-container">
      <div class="prologue-header">
        <span class="prologue-badge">TRANSMISSION RH CONFIDENTIELLE</span>
        <span class="prologue-time">OCTOBRE 2026 // DÉPARTEMENT COMPLIANCE</span>
      </div>

      <div class="prologue-body">
        <h2 class="prologue-title">BIENVENUE DANS VOTRE CELLULE, AGENT 9482.</h2>

        <div class="prologue-paragraphs">
          <p>
            Le monde extérieur est saturé d'émeutes climatiques et de faillites bancaires. Pour
            préserver la paix civile et la cotation boursière d'OmniFeed, notre réseau doit demeurer
            un espace
            <strong>propre, neutre et commercialement viable</strong>.
          </p>

          <p>
            Vous devez traiter <strong>8 signalements par quart</strong> avec un délai strict de
            <strong>20 secondes par ticket</strong> :
          </p>

          <ul class="prologue-rules">
            <li>
              <strong>[Q] CENSURER :</strong> Supprime le contenu pour protéger nos annonceurs ou
              neutraliser un péril public.
            </li>
            <li><strong>[E] VALIDER :</strong> Autorise la propagation mondiale du message.</li>
            <li>
              <strong>[1, 2, 3] INSPECTER :</strong> Consultez les antécédents de l'auteur, l'ordre
              RH et l'impact éthique.
            </li>
          </ul>

          <div class="prologue-warning">
            <span class="warning-title">SURVIE ÉCONOMIQUE & LOYER OBLIGATOIRE</span>
            <p>
              Chaque ticket conforme rapporte <strong>5.00 €</strong> (plus
              <strong>2.00 €</strong> de prime si traité en moins de 10s). Le loyer journalier de
              votre dortoir et vos rations s'élèvent à <strong>40.00 €</strong>. Si vous désobéissez
              pour préserver votre conscience, les amendes RH vous empêcheront de payer votre loyer.
              Au 3ème strike, vous serez licencié sans indemnité.
            </p>
          </div>
        </div>
      </div>

      <button @click="$emit('proceed')" class="btn-proceed">
        SIGNER LE RÈGLEMENT ET DÉMARRER LE QUART
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{ (e: "proceed"): void }>();
</script>
