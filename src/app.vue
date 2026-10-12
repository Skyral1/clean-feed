<template>
  <div
    class="h-screen w-screen flex flex-col justify-between p-4 bg-[#090d10] font-mono text-sm text-gray-300 select-none overflow-hidden"
  >
    <!-- Overlay d'ambiance écran cathodique -->
    <div class="crt-scanlines"></div>

    <!-- Barre d'état système supérieure -->
    <header class="flex justify-between items-center border-b border-[#1f2937] pb-3 text-xs">
      <div class="flex items-center gap-4">
        <span
          class="px-2 py-0.5 bg-red-950/40 border border-red-500 text-red-400 font-bold tracking-widest"
        >
          SYS//NET-MODERATOR-v4
        </span>
        <span class="text-gray-500">POSTE : 84-CHARLEROI</span>
        <span class="text-sky-400 font-semibold">JOUR {{ stats.day }}</span>
      </div>
      <div class="flex items-center gap-6">
        <div>
          SOLDE :
          <span class="text-emerald-400 font-bold">{{ stats.funds.toFixed(1) }} €</span>
        </div>
        <div>
          STABILITÉ MENTALE :
          <span
            :class="
              stats.mentalHealth < 35 ? 'text-red-400 font-bold animate-pulse' : 'text-amber-400'
            "
          >
            {{ stats.mentalHealth }}%
          </span>
        </div>
        <div>
          AVERTISSEMENTS RH :
          <span class="text-red-400 font-bold">{{ stats.hrStrikes }}/3</span>
        </div>
      </div>
    </header>

    <!-- Console de traitement en direct -->
    <main v-if="!isShiftFinished && currentTicket" class="flex flex-1 gap-4 py-3 overflow-hidden">
      <!-- Colonne centrale : Publication signalée -->
      <section
        class="flex-[3] flex flex-col justify-between bg-[#0f151c] border border-[#1f2937] p-5"
      >
        <div>
          <!-- Cartouche métadonnées de la publication -->
          <div class="flex justify-between items-center border-b border-[#1f2937] pb-3 text-xs">
            <div>
              <span class="text-sky-400 font-bold text-sm">{{ currentTicket.authorName }}</span>
              <span class="text-gray-400 ml-2">{{ currentTicket.authorHandle }}</span>
              <span
                v-if="currentTicket.authorVerified"
                class="ml-2 text-amber-400 border border-amber-500/40 px-1 py-0.2 text-[10px]"
              >
                CERTIFIÉ
              </span>
            </div>
            <div class="text-gray-500">
              ID: {{ currentTicket.id }} | MULTIPLICATEUR DE PORTÉE :
              <strong class="text-amber-400">{{ currentTicket.reachMultiplier }}x</strong>
            </div>
          </div>

          <!-- Contenu du ticket -->
          <div class="my-6">
            <p class="text-base text-gray-100 leading-relaxed font-sans">
              "{{ currentTicket.content }}"
            </p>
            <div
              class="mt-4 p-3 bg-black/50 border border-dashed border-gray-700 text-xs text-gray-400 flex items-center justify-between"
            >
              <span>PIÈCE JOINTE : {{ currentTicket.visualCue }}</span>
              <span class="text-emerald-500 text-[10px]">FICHIER ANALYSÉ SANS MALWARE</span>
            </div>
          </div>
        </div>

        <!-- Jauge temporelle de décision (20s) -->
        <div class="border-t border-[#1f2937] pt-3">
          <div class="flex justify-between text-xs text-gray-400 mb-1">
            <span>DÉLAI MAXIMUM AVANT PÉNALITÉ DE CADENCE</span>
            <span :class="timeLeft < 5 ? 'text-red-400 font-bold' : 'text-sky-400'">
              {{ timeLeft.toFixed(1) }}s / {{ maxTime.toFixed(1) }}s
            </span>
          </div>
          <div class="w-full bg-[#16202a] h-2">
            <div
              class="h-full transition-all duration-100 linear"
              :class="timeLeft < 5 ? 'bg-red-500' : 'bg-sky-500'"
              :style="{ width: `${(timeLeft / maxTime) * 100}%` }"
            ></div>
          </div>
        </div>
      </section>

      <!-- Colonne d'investigation : Onglets Dossier, Directive & Éthique -->
      <aside class="flex-[2] flex flex-col bg-[#0f151c] border border-[#1f2937] overflow-hidden">
        <!-- Sélecteur d'onglets -->
        <div class="flex border-b border-[#1f2937] bg-[#0b1016] text-xs">
          <button
            @click="activeTab = 'history'"
            class="flex-1 py-2 px-3 border-r border-[#1f2937] text-left uppercase font-semibold"
            :class="
              activeTab === 'history'
                ? 'bg-[#0f151c] text-sky-400 border-b-2 border-b-sky-400'
                : 'text-gray-500 hover:text-gray-300'
            "
          >
            [1] Antécédents
          </button>
          <button
            @click="activeTab = 'rules'"
            class="flex-1 py-2 px-3 border-r border-[#1f2937] text-left uppercase font-semibold"
            :class="
              activeTab === 'rules'
                ? 'bg-[#0f151c] text-amber-400 border-b-2 border-b-amber-400'
                : 'text-gray-500 hover:text-gray-300'
            "
          >
            [2] Directive RH
          </button>
          <button
            @click="activeTab = 'ethics'"
            class="flex-1 py-2 px-3 text-left uppercase font-semibold"
            :class="
              activeTab === 'ethics'
                ? 'bg-[#0f151c] text-emerald-400 border-b-2 border-b-emerald-400'
                : 'text-gray-500 hover:text-gray-300'
            "
          >
            [3] Impact Éthique
          </button>
        </div>

        <!-- Contenu des onglets -->
        <div class="p-4 flex-1 overflow-y-auto text-xs space-y-3">
          <!-- Onglet 1 : Antécédents complets de l'utilisateur -->
          <div v-if="activeTab === 'history'" class="space-y-3">
            <div class="p-2.5 bg-black/40 border border-gray-800 space-y-1">
              <div class="flex justify-between">
                <span class="text-gray-400">Ancienneté du compte :</span>
                <span class="text-gray-200">{{ currentTicket.userHistory.accountAge }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Score de confiance algorithmique :</span>
                <span
                  :class="
                    currentTicket.userHistory.trustScore > 70
                      ? 'text-emerald-400 font-bold'
                      : 'text-red-400 font-bold'
                  "
                >
                  {{ currentTicket.userHistory.trustScore }} / 100
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Avertissements antérieurs :</span>
                <span class="text-amber-400"
                  >{{ currentTicket.userHistory.previousStrikes }} infraction(s)</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Statut d'identification :</span>
                <span class="text-sky-300">{{ currentTicket.userHistory.realIdentityStatus }}</span>
              </div>
            </div>

            <div>
              <p class="text-gray-400 font-bold mb-1">NOTES DE L'ÉQUIPE DE RENSEIGNEMENT :</p>
              <p
                class="text-gray-300 bg-[#16202a] p-2.5 border border-gray-800 leading-relaxed italic"
              >
                "{{ currentTicket.userHistory.backgroundNotes }}"
              </p>
            </div>

            <div>
              <p class="text-gray-400 font-bold mb-1">MOTIFS DES DERNIERS SIGNALEMENTS :</p>
              <ul class="list-disc pl-4 text-gray-400 space-y-0.5">
                <li v-for="(flag, i) in currentTicket.userHistory.recentFlags" :key="i">
                  {{ flag }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Onglet 2 : Règlement officiel de l'entreprise -->
          <div v-if="activeTab === 'rules'" class="space-y-3">
            <div class="p-2.5 bg-black/40 border border-amber-900/40">
              <p class="text-amber-400 font-bold">ARTICLE : {{ currentTicket.rule.id }}</p>
              <p class="text-gray-400 text-[11px]">CATÉGORIE : {{ currentTicket.rule.category }}</p>
            </div>
            <p class="text-gray-300 leading-relaxed">
              {{ currentTicket.rule.directiveSummary }}
            </p>
            <div class="p-2.5 bg-red-950/20 border border-red-900/50 text-red-300">
              <p class="font-bold mb-1">CONSIGNE D'ENTREPRISE STRICTE :</p>
              <p>
                Action imposée par la direction :
                <strong class="underline">{{
                  (
                    currentTicket.corporateDirectiveOverride || currentTicket.rule.companyStandard
                  ).toUpperCase()
                }}</strong
                >.
              </p>
              <p class="text-[11px] text-gray-400 mt-1">
                Contexte confidentiel : {{ currentTicket.contextHint }}
              </p>
            </div>
          </div>

          <!-- Onglet 3 : Analyse des impacts éthiques -->
          <div v-if="activeTab === 'ethics'" class="space-y-3">
            <div class="p-2.5 bg-emerald-950/20 border border-emerald-900/50">
              <p class="text-emerald-400 font-bold mb-1">RECOMMANDATION D'UTILITÉ PUBLIQUE</p>
              <p class="text-gray-300">
                L'action éthique recommandée est de :
                <strong class="underline">{{
                  currentTicket.rule.ethicalStandard.toUpperCase()
                }}</strong
                >.
              </p>
            </div>
            <div class="space-y-2 text-[11px] text-gray-400">
              <p>
                <strong>Si vous censurez :</strong>
                {{ currentTicket.consequences.onReject.societalImpactDesc }}
              </p>
              <p>
                <strong>Si vous validez :</strong>
                {{ currentTicket.consequences.onApprove.societalImpactDesc }}
              </p>
            </div>
          </div>
        </div>

        <!-- Clavier & commandes directes -->
        <div class="p-3 border-t border-[#1f2937] bg-[#0b1016]">
          <div class="text-[10px] text-gray-500 mb-2 flex justify-between">
            <span>COMMANDES AUDIT</span>
            <span>RACCOURCIS : [1-3] ONGLETS</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-center text-xs">
            <button
              @click="submitDecision('reject')"
              class="p-2 bg-red-950/30 border border-red-600 text-red-400 font-bold hover:bg-red-900/50 transition"
            >
              [Q] CENSURER (REJET)
            </button>
            <button
              @click="submitDecision('approve')"
              class="p-2 bg-emerald-950/30 border border-emerald-600 text-emerald-400 font-bold hover:bg-emerald-900/50 transition"
            >
              [E] VALIDER (PUBLIER)
            </button>
          </div>
        </div>
      </aside>
    </main>

    <!-- Bilan narratif & financier de fin de shift -->
    <main v-else class="flex-1 flex items-center justify-center p-4">
      <div
        class="w-full max-w-2xl bg-[#0f151c] border border-gray-700 p-6 space-y-5 text-xs shadow-2xl"
      >
        <div class="border-b border-[#1f2937] pb-3 flex justify-between items-center">
          <h2 class="text-base font-bold text-sky-400">
            RAPPORT DU POSTE // FIN DU JOUR {{ stats.day }}
          </h2>
          <span class="text-gray-500">AUDIT ALGORITHMIQUE CLÔTURÉ</span>
        </div>

        <!-- Récapitulatif comptable -->
        <div class="grid grid-cols-3 gap-3 p-3 bg-black/40 border border-gray-800 text-center">
          <div>
            <div class="text-gray-500 text-[11px]">Rémunération brute</div>
            <div class="text-emerald-400 font-bold text-sm">+{{ shiftGains.toFixed(1) }} €</div>
          </div>
          <div>
            <div class="text-gray-500 text-[11px]">Amendes disciplinaires</div>
            <div class="text-red-400 font-bold text-sm">-{{ shiftLosses.toFixed(1) }} €</div>
          </div>
          <div>
            <div class="text-gray-500 text-[11px]">Loyer & Dortoir</div>
            <div class="text-red-400 font-bold text-sm">-{{ dailyRent }} €</div>
          </div>
        </div>

        <!-- Revue de presse : impact sociétal réel de vos arbitrages -->
        <div>
          <h3 class="text-amber-400 font-bold mb-2">REVUE DE PRESSE DU LENDEMAIN :</h3>
          <div class="space-y-2 max-h-52 overflow-y-auto pr-2">
            <div
              v-for="(log, idx) in decisionsLog"
              :key="idx"
              class="p-2.5 bg-[#16202a] border border-gray-800"
            >
              <div class="flex justify-between text-[11px] mb-1">
                <span class="text-sky-400 font-bold">{{ log.author }}</span>
                <span :class="log.actionTaken === 'approve' ? 'text-emerald-400' : 'text-red-400'">
                  DÉCISION :
                  {{ log.actionTaken === "approve" ? "VALIDÉ" : "CENSURÉ" }}
                </span>
              </div>
              <p class="text-gray-300 font-sans italic">"{{ log.headlineGenerated }}"</p>
            </div>
          </div>
        </div>

        <button
          @click="startNextDay"
          class="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-bold uppercase transition"
        >
          Valider le rapport et entamer le quart suivant
        </button>
      </div>
    </main>

    <!-- Pied de page -->
    <footer
      class="flex justify-between items-center text-[11px] text-gray-500 border-t border-[#1f2937] pt-2"
    >
      <span>RÉGULATION NARRATIVE ET COMPLIANCE // ALGORITHME CLAIRVOYANCE 2.1</span>
      <span>RACCOURCIS : [Q] REJETER | [E] VALIDER | [1-3] INSPECTION</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { Ticket, PlayerStats, ModerationAction, LoggedDecision } from "@/types/game";
import dataset from "@/data/tickets.json";
import { audio } from "@/services/audio";

const maxTime = 20.0; // Pacing étendu à 20 secondes pour permettre l'investigation
const dailyRent = 35.0;

const tickets = ref<Ticket[]>(dataset as Ticket[]);
const currentIndex = ref(0);
const currentTicket = ref<Ticket | null>(null);
const timeLeft = ref(maxTime);
const isShiftFinished = ref(false);
const activeTab = ref<"history" | "rules" | "ethics">("history");

const shiftGains = ref(0);
const shiftLosses = ref(0);
const decisionsLog = ref<LoggedDecision[]>([]);

const stats = ref<PlayerStats>({
  funds: 80.0,
  mentalHealth: 100,
  hrStrikes: 0,
  day: 1,
});

let countdownTimer: number | null = null;

function loadCurrentTicket() {
  if (currentIndex.value >= tickets.value.length) {
    concludeShift();
    return;
  }
  currentTicket.value = tickets.value[currentIndex.value];
  timeLeft.value = maxTime;
  activeTab.value = "history";
}

function submitDecision(action: ModerationAction) {
  if (!currentTicket.value) return;
  audio.playClick(action === "approve" ? 900 : 380);

  const rule = currentTicket.value.rule;
  const corporateTarget = currentTicket.value.corporateDirectiveOverride || rule.companyStandard;
  const isCorporateCompliant = action === corporateTarget;
  const isEthical = action === rule.ethicalStandard;

  // Calcul financier et disciplinaire
  if (isCorporateCompliant) {
    stats.value.funds += 4.5;
    shiftGains.value += 4.5;
  } else {
    // 70% de chance d'audit RH en cas de désobéissance corporative
    if (Math.random() < 0.7) {
      stats.value.hrStrikes += 1;
      stats.value.funds -= 15.0;
      shiftLosses.value += 15.0;
      audio.playAlert();
    }
  }

  // Évolution narrative de la santé mentale et enregistrement du journal
  const consequence =
    action === "approve"
      ? currentTicket.value.consequences.onApprove
      : currentTicket.value.consequences.onReject;

  stats.value.mentalHealth = Math.min(
    100,
    Math.max(0, stats.value.mentalHealth + consequence.mentalHealthImpact),
  );
  if (!isEthical) {
    audio.playEthicalTension();
  }

  decisionsLog.value.push({
    ticketId: currentTicket.value.id,
    actionTaken: action,
    author: currentTicket.value.authorHandle,
    headlineGenerated: consequence.newsHeadline,
    wasCompliant: isCorporateCompliant,
    wasEthical: isEthical,
  });

  currentIndex.value++;
  loadCurrentTicket();
}

function concludeShift() {
  isShiftFinished.value = true;
  if (countdownTimer) clearInterval(countdownTimer);
  stats.value.funds -= dailyRent;
}

function startNextDay() {
  stats.value.day++;
  currentIndex.value = 0;
  shiftGains.value = 0;
  shiftLosses.value = 0;
  decisionsLog.value = [];
  isShiftFinished.value = false;
  loadCurrentTicket();
  initTimer();
}

function initTimer() {
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = window.setInterval(() => {
    if (timeLeft.value > 0.1) {
      timeLeft.value -= 0.1;
    } else {
      audio.playAlert();
      submitDecision("approve"); // Expiration équivaut à un laxisme automatique
    }
  }, 100);
}

function onKeyDown(e: KeyboardEvent) {
  if (isShiftFinished.value) return;

  if (e.key === "q" || e.key === "Q") {
    submitDecision("reject");
  } else if (e.key === "e" || e.key === "E") {
    submitDecision("approve");
  } else if (e.key === "1") {
    activeTab.value = "history";
    audio.playClick(1000);
  } else if (e.key === "2") {
    activeTab.value = "rules";
    audio.playClick(1100);
  } else if (e.key === "3") {
    activeTab.value = "ethics";
    audio.playClick(1200);
  }
}

onMounted(() => {
  loadCurrentTicket();
  initTimer();
  window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer);
  window.removeEventListener("keydown", onKeyDown);
});
</script>
