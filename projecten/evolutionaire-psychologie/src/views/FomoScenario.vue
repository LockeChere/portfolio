<template>
  <div class="page">
    <div class="fomo-animation">
      <div class="book">📚</div>
      <div class="ticket ticket-1">🎟️</div>
      <div class="ticket ticket-2">🎟️</div>
      <div class="ticket ticket-3">🎟️</div>
      <div class="popcorn">🍿</div>
      <div class="movie">🎬</div>
      <div class="sad-face">😟</div>
    </div>

    <div v-if="stap < introTeksten.length" class="text-card">
      <p class="label">Scenario FOMO</p>
      <h2>{{ introTeksten[stap].titel }}</h2>
      <p class="story-text">{{ introTeksten[stap].tekst }}</p>

      <div class="button-group">
        <button v-if="stap > 0" class="back-btn" @click="vorigeStap">
          Terug
        </button>

        <button class="next-btn" @click="volgendeStap">
          Volgende
        </button>
      </div>
    </div>

    <ChoiceScreen
        v-else
        question="Jouw vrienden vragen je mee naar een film terwijl je eigenlijk moet leren, wat is jouw reactie?"
        :options="opties"
        @choice-made="handleChoice"
    />

    <div v-if="popupZichtbaar" class="popup-overlay">
      <div class="popup">
        <div
            class="reaction-animation"
            :class="popupTitel.toLowerCase().replace(' reactie', '')"
        >
          <span v-if="popupTitel.includes('Fight')">😡</span>
          <span v-else-if="popupTitel.includes('Flight')">🏃</span>
          <span v-else>🧊</span>
        </div>

        <h2>{{ popupTitel }}</h2>
        <p>{{ popupTekst }}</p>

        <button @click="setScene('map')">
          Sluiten
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChoiceScreen from '../components/Keuzescherm.vue'
import {setScene} from "./scherm";

const stap = ref(0)
const gekozen = ref(null)

const popupZichtbaar = ref(false)
const popupTitel = ref('')
const popupTekst = ref('')

const introTeksten = [
  {
    titel: 'Fear Of Missing Out',
    tekst: 'Na school spreken je vrienden af om naar de bioscoop te gaan. Ze sturen foto\'s en berichten in de groepschat. Jij hebt morgen een belangrijke toets en moet thuis blijven om te leren. Terwijl je boeken voor je liggen zie je steeds nieuwe berichten binnenkomen en vraag je je af of je de juiste keuze hebt gemaakt.'
  },
  {
    tekst: 'Nu stuurt iemand een bericht naar jou of je ook wilt komen.'
  },
  {
    tekst: 'Misschien denk je wel: "Ik wil dit moment niet missen met mijn vrienden", maar je moet echt leren voor die toets. Nu moet jij kiezen hoe je reageert.'
  }
]

const opties = [
  {
    text: 'Je raakt geïrriteerd en stuurt een bericht terug: Hou eens op met al die foto’s sturen, ik moet leren.',
    reactie: 'Fight reactie',
    uitleg: 'Je ervaart de situatie als een bedreiging. Je oerbrein probeert de spanning te verminderen door de bron van de stress aan te vallen of weg te duwen.'
  },
  {
    text: 'Je legt je telefoon weg, zet meldingen uit en probeert de groepschat te vermijden.',
    reactie: 'Flight reactie',
    uitleg: 'Je oerbrein probeert de spanning te verminderen door afstand te nemen van de situatie. Door de berichten niet meer te zien, voelt de dreiging minder groot.'
  },
  {
    text: 'Je blijft naar de berichten kijken zonder iets te doen.',
    reactie: 'Freeze reactie',
    uitleg: 'Je oerbrein ziet geen duidelijke oplossing. Daardoor raak je geblokkeerd en lukt het niet goed om een keuze te maken of in actie te komen.'
  }
]

function volgendeStap() {
  stap.value++
}

function vorigeStap() {
  if (stap.value > 0) {
    stap.value--
  }
}

function handleChoice({ option }) {
  gekozen.value = option.text
  popupTitel.value = option.reactie
  popupTekst.value = option.uitleg
  popupZichtbaar.value = true
}
</script>
<style scoped>
.page {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page {
  width: 100vw;
  background: #3b561f;
  min-height: 100vh;
  padding: 2rem;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.text-card {
  width: 100%;
  max-width: 650px;
  background: #2a3f17;
  border: 2px solid #6b8f3e;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
}

.label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #a8c96b;
  margin-bottom: 10px;
}

.text-card h2 {
  color: #e8f5c0;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.story-text {
  color: #d4eaa0;
  line-height: 1.6;
  font-size: 1.1rem;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 2rem;
}

.back-btn,
.next-btn {
  flex: 1;
  padding: 0.9rem;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}

.back-btn {
  background: transparent;
  border: 2px solid #6b8f3e;
  color: #d4eaa0;
}

.next-btn {
  border: 2px solid #643A1E;
  background: #AE7F60;
  color: white;
}

.next-btn:hover {
  border-color: #643A1E;
  background: #a86434;
}

.resultaat {
  margin-top: 1rem;
  color: #e8f5c0;
  font-size: 1.1rem;
}

/* ---------- FOMO CINEMA ANIMATION ---------- */

.fomo-animation {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.book {
  position: absolute;
  left: 6%;
  bottom: 10%;
  font-size: 100px;
  animation: studyPulse 2s ease-in-out infinite;
}

.movie {
  position: absolute;
  top: 10%;
  right: 8%;
  font-size: 90px;
  animation: movieBounce 2s ease-in-out infinite;
}

.popcorn {
  position: absolute;
  top: 22%;
  right: 14%;
  font-size: 80px;
  animation: movieBounce 2s ease-in-out infinite;
  animation-delay: .4s;
}

.sad-face {
  position: absolute;
  bottom: 12%;
  right: 15%;
  font-size: 90px;
  animation: sadShake 4s ease-in-out infinite;
}

.ticket {
  position: absolute;
  left: 12%;
  bottom: 18%;
  font-size: 70px;
  opacity: 0;
}

.ticket-1 {
  animation: ticketFly 6s linear infinite;
}

.ticket-2 {
  animation: ticketFly 6s linear infinite;
  animation-delay: 2s;
}

.ticket-3 {
  animation: ticketFly 6s linear infinite;
  animation-delay: 4s;
}

@keyframes ticketFly {
  0% {
    transform: translate(0,0) rotate(0deg);
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  50% {
    transform: translate(500px,-250px) rotate(20deg);
    opacity: .9;
  }

  100% {
    transform: translate(900px,-500px) rotate(45deg);
    opacity: 0;
  }
}

@keyframes studyPulse {
  0%,100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.08);
  }
}

@keyframes movieBounce {
  0%,100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-15px);
  }
}

@keyframes sadShake {
  0%,100% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(-6deg);
  }

  75% {
    transform: rotate(6deg);
  }
}

/* Zorg dat je scherm boven de animatie blijft */

.text-card,
.choice-screen,
.resultaat {
  position: relative;
  z-index: 10;
}

/* ---------- POPUP ---------- */

.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup {
  width: min(500px,90%);
  background: #a86434;;
  border: 2px solid #643A1E;
  border-radius: 20px;
  padding: 2rem;
  color: white;
  text-align: center;
  animation: popup .25s ease;
}

.popup h2 {
  color: white;
  margin-bottom: 1rem;
}

.popup p {
  line-height: 1.6;
  color: white;
}

.popup button {
  margin-top: 1.5rem;
  background: #42230d;;
  color: white;
  border: none;
  padding: .9rem 2rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: bold;
}

@keyframes popup {
  from {
    opacity: 0;
    transform: scale(.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ---------- FIGHT / FLIGHT / FREEZE POPUP ANIMATION ---------- */

.reaction-animation {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 90px;
  margin-bottom: 20px;
}

.reaction-animation.fight {
  animation: fightShake .45s infinite;
}

.reaction-animation.flight {
  animation: flightRun .8s infinite alternate;
}

.reaction-animation.freeze {
  animation: freezePulse 1.2s infinite;
}

@keyframes fightShake {
  0%,100% {
    transform: translateX(0) rotate(0deg);
  }

  20% {
    transform: translateX(-12px) rotate(-8deg);
  }

  40% {
    transform: translateX(12px) rotate(8deg);
  }

  60% {
    transform: translateX(-8px) rotate(-5deg);
  }

  80% {
    transform: translateX(8px) rotate(5deg);
  }
}

@keyframes flightRun {
  0% {
    transform: translateX(-30px);
  }

  100% {
    transform: translateX(30px);
  }
}

@keyframes freezePulse {
  0%,100% {
    transform: scale(1);
    filter: brightness(1);
  }

  50% {
    transform: scale(.82);
    filter: brightness(1.8);
  }
}
</style>