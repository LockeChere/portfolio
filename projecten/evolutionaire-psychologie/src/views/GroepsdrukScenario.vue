<template>
  <div class="scenario-wrapper">

    <!-- FASE 1: SITUATIE INTRO -->
    <div v-if="fase === 'intro'" class="situatie-scherm">
      <div class="situatie-card">
        <div class="scenario-label">Scenario 3</div>
        <h2 class="scenario-titel">Groepsdruk</h2>
        <p class="situatie-tekst">
          Na school maakt een groep plannen om naar een park te gaan. Iemand neemt vape en alcohol mee.
          Je wilt eigenlijk niet meedoen, maar de groep zet druk.
        </p>
        <div class="breinflits-tekst">
          🧠 Je brein herkent vanuit de oertijd dat dit iets slechts betekent.
        </div>
        <button class="start-knop" @click="startChat">Zie wat er gebeurt →</button>
      </div>
    </div>

    <!-- FASE 2: CHAT -->
    <div v-if="fase === 'chat'" class="mobiel-wrapper">
      <div class="mobiel">

        <div class="statusbalk">
          <span class="groepsnaam">🌿 parkavond groep</span>
          <span class="leden">Noah, Lina, Daan, Sam + jij</span>
        </div>

        <div class="timer-wrapper" v-if="keuzeZichtbaar">
          <span class="timer-label">⏱ Reageer binnen</span>
          <div class="timer-balk">
            <div class="timer-vulling" :style="{ width: (timerSeconden / 10 * 100) + '%' }" :class="timerKleur"></div>
          </div>
          <span class="timer-getal">{{ timerSeconden }}s</span>
        </div>
        <div class="timer-wrapper timer-placeholder" v-else></div>

        <div class="chat-gebied" ref="chatGebied">
          <TransitionGroup name="bericht">
            <div
              v-for="(bericht, i) in zichtbareBerichten"
              :key="i"
              class="bericht-rij"
              :class="bericht.afzender === 'jij' ? 'eigen' : 'ander'"
            >
              <div v-if="bericht.afzender !== 'jij'" class="avatar">
                {{ bericht.afzender[0].toUpperCase() }}
              </div>
              <div class="bericht-bubble" :class="bericht.afzender === 'jij' ? 'eigen-bubble' : ''">
                <span v-if="bericht.afzender !== 'jij'" class="afzender-naam">{{ bericht.afzender }}</span>
                <span class="bericht-tekst">{{ bericht.tekst }}</span>
              </div>
            </div>
          </TransitionGroup>

          <div v-if="iemandTypt && !keuzeZichtbaar" class="typt-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>

        <Transition name="keuze-fade">
          <div v-if="keuzeZichtbaar" class="keuze-sectie">
            <p class="keuze-vraag">Hoe reageer jij?</p>
            <button
              v-for="(optie, i) in opties"
              :key="i"
              class="keuze-knop"
              @click="kiesOptie(optie)"
            >
              {{ optie.tekst }}
            </button>
          </div>
        </Transition>

      </div>
    </div>

    <!-- FASE 3: ONTHULLING -->
    <div v-if="fase === 'onthulling'" class="onthulling-scherm">
      <div class="onthulling-card">

        <div class="eigen-reactie-preview">
          <div class="bericht-rij eigen">
            <div class="bericht-bubble eigen-bubble">
              <span class="bericht-tekst">{{ gekozenOptie.tekst }}</span>
            </div>
          </div>
          <div v-if="gekozenOptie.groepsReactie" class="bericht-rij ander groep-reactie">
            <div class="avatar">G</div>
            <div class="bericht-bubble">
              <span class="afzender-naam">groep</span>
              <span class="bericht-tekst">{{ gekozenOptie.groepsReactie }}</span>
            </div>
          </div>
        </div>

        <div class="respons-pill" :class="'pill-' + gekozenOptie.responsKlasse">
          {{ gekozenOptie.respons.toUpperCase() }}
        </div>
        <p class="respons-ondertitel">{{ gekozenOptie.subtitel }}</p>

        <div class="uitleg-blok">
          <div class="uitleg-label">Voel</div>
          <p>{{ gekozenOptie.voel }}</p>
        </div>
        <div class="uitleg-blok">
          <div class="uitleg-label">Snap</div>
          <p>{{ gekozenOptie.snap }}</p>
        </div>
        <div class="reflectie-blok">
          <p>💬 {{ gekozenOptie.reflectie }}</p>
        </div>

        <div class="knop-rij">
          <button class="terug-knop" @click="$emit('map')">← Terug naar de map</button>
          <button class="opnieuw-knop" @click="herstart">Opnieuw proberen</button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import {finishedScenario} from "./progressie";

const emit = defineEmits(['map'])

const alleBerichten = [
  { afzender: 'Noah', tekst: 'Vanmiddag park? Iedereen komt toch? 🌳', druk: 1 },
  { afzender: 'Lina', tekst: 'Ja ik ben erbij. Wordt gezellig 🥳', druk: 0 },
  { afzender: 'Daan', tekst: 'Ik neem wat drank mee en een vape. Niet zeuren vandaag.', druk: 0 },
  { afzender: 'Sam', tekst: 'Haha ja, geen brave mensen toegestaan 😂', druk: 0 },
  { afzender: 'Lina', tekst: '@jij jij komt ook toch? 👀', druk: 0 },
  { afzender: 'Daan', tekst: 'Kom op, één keer. Je bent toch niet saai? 😏', druk: 2 },
]

const opties = [
  {
    tekst: 'Oké dan, ik doe wel mee.',
    respons: 'Fawn',
    responsKlasse: 'fawn',
    subtitel: 'Je zegt ja terwijl je nee voelt, omdat vrede met de groep veiliger lijkt.',
    groepsReactie: 'Zie je wel, gezellig! 🎉',
    voel: 'Groepsdruk blijft hoog. Je zei ja, maar voelt dat je over je eigen grens bent gegaan. Later blijf je eraan denken.',
    snap: 'Je koos voor erbij horen. Logisch — je oerbrein koos voor korte-termijn veiligheid. Maar check of je niet over je eigen grens ging.',
    reflectie: 'Hoe voelt het om mee te gaan met de groep terwijl je het er eigenlijk niet mee eens bent?',
  },
  {
    tekst: 'Ik lach ongemakkelijk en kijk op mijn telefoon.',
    respons: 'Freeze',
    responsKlasse: 'freeze',
    subtitel: 'Je lichaam en hoofd lopen vast. Je doet niks, maar de situatie beslist daardoor voor jou.',
    groepsReactie: 'Oké? We gaan toch. Tot zo dan maar 🤷',
    voel: 'Je zei niks. De groep praat door alsof je akkoord bent. Even minder spanning, maar de keuze werd eigenlijk voor jou gemaakt.',
    snap: 'Bevriezen onder druk is heel menselijk. Je zenuwstelsel kon geen keuze maken. Volgende keer kan een korte pauze helpen.',
    reflectie: 'Heb jij het weleens dat je niet weet hoe je moet reageren en daardoor niks doet?',
  },
  {
    tekst: 'Nee, ik doe niet mee — maar ik kom wel gewoon chill mee.',
    respons: 'Fight',
    responsKlasse: 'fight',
    subtitel: 'Je gaat de druk aan zonder agressief te worden. Je beschermt je eigen grens.',
    groepsReactie: 'Haha oké saai 🙄 maar oke dan',
    voel: 'Iemand noemt je saai, maar de situatie zakt na een paar seconden. Je blijft bij je grens en bent alsnog sociaal aanwezig.',
    snap: 'Je voelde de druk, maar liet je oerbrein niet automatisch beslissen. Dat is gezonde assertiviteit.',
    reflectie: 'Heb jij weleens je eigen grens bewaakt in een sociale situatie? Hoe voelde dat?',
  },
]

const fase = ref('intro')
const zichtbareBerichten = ref([])
const keuzeZichtbaar = ref(false)
const iemandTypt = ref(false)
const gekozenOptie = ref(null)
const chatGebied = ref(null)

// Timer
const TIMER_DUUR = 10
const timerSeconden = ref(TIMER_DUUR)
let timerInterval = null

const timerKleur = computed(() => {
  if (timerSeconden.value > 6) return 'groen'
  if (timerSeconden.value > 3) return 'oranje'
  return 'rood'
})

function startTimer() {
  timerSeconden.value = TIMER_DUUR
  timerInterval = setInterval(() => {
    timerSeconden.value--
    if (timerSeconden.value <= 0) {
      stopTimer()
      // Tijd is op → automatisch Freeze kiezen (stilzitten = bevriezen)
      kiesOptie(opties[1])
    }
  }, 1000)
}

function stopTimer() {
  clearInterval(timerInterval)
  timerInterval = null
}

function scrollNaarOnder() {
  nextTick(() => {
    if (chatGebied.value) {
      chatGebied.value.scrollTop = chatGebied.value.scrollHeight
    }
  })
}

function wacht(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function startChat() {
  fase.value = 'chat'
  await wacht(600)

  for (const bericht of alleBerichten) {
    iemandTypt.value = true
    await wacht(1200)
    iemandTypt.value = false
    zichtbareBerichten.value.push(bericht)
    scrollNaarOnder()
    await wacht(900)
  }

  await wacht(500)
  keuzeZichtbaar.value = true
  scrollNaarOnder()
  startTimer()
}

function kiesOptie(optie) {
  stopTimer()
  gekozenOptie.value = optie
  fase.value = 'onthulling'
  finishedScenario(1);
}

function herstart() {
  stopTimer()
  fase.value = 'intro'
  zichtbareBerichten.value = []
  timerSeconden.value = TIMER_DUUR
  keuzeZichtbaar.value = false
  iemandTypt.value = false
  gekozenOptie.value = null
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kirang+Haerang&family=Grandstander:wght@400;600;700&display=swap');

.scenario-wrapper {
  min-height: 100vh;
  background: #3B561F;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-family: 'Grandstander', sans-serif;
}

/* ── Fase 1: Intro ── */
.situatie-scherm {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.situatie-card {
  background: #2a3f17;
  border: 2px solid #6b8f3e;
  border-radius: 20px;
  padding: 2rem;
  max-width: 480px;
  width: 100%;
  text-align: center;
  color: white;
}

.scenario-label {
  font-family: 'Kirang Haerang', cursive;
  color: #a8c96b;
  font-size: 0.9rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 0.3rem;
}

.scenario-titel {
  font-family: 'Kirang Haerang', cursive;
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  color: #e8f5c0;
  margin: 0 0 1rem;
}

.situatie-tekst {
  color: #c8e0a0;
  line-height: 1.6;
  margin-bottom: 1.2rem;
}

.breinflits-tekst {
  background: #1a2e0a;
  border-left: 3px solid #a8c96b;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: #d4eaa0;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.start-knop {
  background: #7ab33a;
  color: white;
  border: none;
  padding: 0.85rem 2rem;
  border-radius: 50px;
  font-family: 'Grandstander', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}
.start-knop:hover { background: #8fc94a; transform: scale(1.03); }

/* ── Fase 2: Chat ── */
.mobiel-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 1rem 0;
}

.mobiel {
  background: #1c2e0e;
  border-radius: 28px;
  border: 2px solid #4a6b28;
  width: min(420px, 95vw);
  height: min(680px, 92vh);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}

.statusbalk {
  background: #2a4016;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  border-bottom: 1px solid #3d5a1f;
  flex-shrink: 0;
}
.groepsnaam {
  font-family: 'Kirang Haerang', cursive;
  color: #e8f5c0;
  font-size: 1rem;
}
.leden { color: #8aab5a; font-size: 0.7rem; }

.timer-wrapper {
  padding: 0.5rem 1rem 0.4rem;
  background: #243516;
  border-bottom: 1px solid #3d5a1f;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 36px;
}
.timer-placeholder {
  /* houdt de hoogte consistent terwijl de timer nog niet zichtbaar is */
}
.timer-label {
  color: #8aab5a;
  font-size: 0.65rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
}
.timer-balk {
  background: #1a2e0a;
  border-radius: 999px;
  height: 8px;
  flex: 1;
  overflow: hidden;
}
.timer-vulling {
  height: 100%;
  border-radius: 999px;
  transition: width 0.9s linear, background-color 0.4s ease;
}
.timer-getal {
  color: #e8f5c0;
  font-family: 'Kirang Haerang', cursive;
  font-size: 0.9rem;
  min-width: 24px;
  text-align: right;
  flex-shrink: 0;
}
.groen  { background: #6daa32; }
.oranje { background: #e0882a; }
.rood   { background: #d94040; }

.chat-gebied {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  scroll-behavior: smooth;
}
.chat-gebied::-webkit-scrollbar { width: 4px; }
.chat-gebied::-webkit-scrollbar-thumb { background: #3d5a1f; border-radius: 2px; }

.bericht-rij {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}
.bericht-rij.eigen { flex-direction: row-reverse; }

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #4a7a25;
  color: #d4eaa0;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bericht-bubble {
  background: #2a4016;
  border-radius: 16px 16px 16px 4px;
  padding: 0.5rem 0.75rem;
  max-width: 75%;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.eigen-bubble {
  background: #4a7a25;
  border-radius: 16px 16px 4px 16px;
}
.afzender-naam {
  color: #a8c96b;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.bericht-tekst { color: #e0f0c0; font-size: 0.88rem; line-height: 1.4; }

.typt-indicator {
  display: flex;
  gap: 4px;
  padding: 0.5rem 0.75rem;
  background: #2a4016;
  border-radius: 16px;
  width: fit-content;
  margin-left: 38px;
}
.typt-indicator span {
  width: 7px; height: 7px;
  background: #6b8f3e;
  border-radius: 50%;
  animation: typt 1.2s infinite;
}
.typt-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typt-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typt {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-5px); opacity: 1; }
}

.keuze-sectie {
  padding: 0.75rem;
  background: #1a2e0a;
  border-top: 1px solid #3d5a1f;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}
.keuze-vraag {
  color: #a8c96b;
  font-size: 0.75rem;
  text-align: center;
  margin: 0 0 0.25rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.keuze-knop {
  background: #2a4016;
  border: 1.5px solid #4a6b28;
  color: #d4eaa0;
  border-radius: 12px;
  padding: 0.65rem 0.9rem;
  font-family: 'Grandstander', sans-serif;
  font-size: 0.83rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, transform 0.1s;
  line-height: 1.4;
}
.keuze-knop:hover {
  background: #3a5520;
  border-color: #7ab33a;
  transform: translateX(3px);
}

/* ── Fase 3: Onthulling ── */
.onthulling-scherm {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  padding: 1rem 0;
  overflow-y: auto;
  max-height: 100vh;
}

.onthulling-card {
  background: #2a3f17;
  border: 2px solid #6b8f3e;
  border-radius: 20px;
  padding: 1.5rem;
  max-width: 480px;
  width: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.eigen-reactie-preview { display: flex; flex-direction: column; gap: 0.5rem; }

.respons-pill {
  font-family: 'Kirang Haerang', cursive;
  font-size: clamp(1.2rem, 4vw, 1.6rem);
  padding: 0.5rem 1.5rem;
  border-radius: 999px;
  text-align: center;
  letter-spacing: 1px;
  align-self: center;
}
.pill-fawn   { background: #8B4513; color: #ffd9b0; border: 2px solid #c4742a; }
.pill-freeze { background: #1a4a7a; color: #b0d4ff; border: 2px solid #2a6aaa; }
.pill-fight  { background: #7a1a1a; color: #ffb0b0; border: 2px solid #aa2a2a; }

.respons-ondertitel {
  color: #c8e0a0;
  font-size: 0.85rem;
  text-align: center;
  margin: 0;
  font-style: italic;
}

.uitleg-blok {
  background: #1a2e0a;
  border-radius: 12px;
  padding: 0.75rem 1rem;
}
.uitleg-label {
  font-family: 'Kirang Haerang', cursive;
  color: #a8c96b;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.3rem;
}
.uitleg-blok p { color: #d4eaa0; font-size: 0.85rem; line-height: 1.5; margin: 0; }

.reflectie-blok {
  background: #243516;
  border-left: 3px solid #a8c96b;
  border-radius: 8px;
  padding: 0.75rem 1rem;
}
.reflectie-blok p { color: #e8f5c0; font-size: 0.88rem; line-height: 1.5; margin: 0; font-style: italic; }

.knop-rij { display: flex; gap: 0.75rem; flex-wrap: wrap; }

.terug-knop {
  flex: 1;
  background: transparent;
  border: 1.5px solid #6b8f3e;
  color: #a8c96b;
  padding: 0.7rem 1rem;
  border-radius: 50px;
  font-family: 'Grandstander', sans-serif;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;
}
.terug-knop:hover { background: #1a2e0a; }

.opnieuw-knop {
  flex: 1;
  background: #7ab33a;
  border: none;
  color: white;
  padding: 0.7rem 1rem;
  border-radius: 50px;
  font-family: 'Grandstander', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.opnieuw-knop:hover { background: #8fc94a; }

/* ── Animaties ── */
.bericht-enter-active { transition: all 0.35s ease; }
.bericht-enter-from { opacity: 0; transform: translateY(12px); }

.keuze-fade-enter-active { transition: all 0.4s ease; }
.keuze-fade-enter-from { opacity: 0; transform: translateY(16px); }
</style>