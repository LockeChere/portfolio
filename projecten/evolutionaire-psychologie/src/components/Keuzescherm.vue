<template>
  <div class="choice-screen">
    <div class="timer-box">
      <div class="timer-top">
        <span>Jouw oerbrein doet er ongeveer 200 miliseconden over om keuzes te maken. Kan jij het binnen 15?</span>
        <span>{{ timeLeft.toFixed(1) }}s</span>
      </div>

      <div class="timer-bar">
        <div
            class="timer-fill"
            :style="{ width: timerPercentage + '%' }"
        ></div>
      </div>
    </div>

    <div class="question-card">
      <p class="question-label">Keuze</p>
      <h2 class="question-text">{{ question }}</h2>
    </div>

    <div class="options-list">
      <button
          v-for="(option, index) in options"
          :key="index"
          class="option-btn"
          :class="{ selected: selectedIndex === index }"
          @click="selectOption(index)"
      >
        <img
            class="option-letter"
            :src="letters[index]"
            :alt="`Optie ${index + 1}`"
        />
        <span class="option-text">{{ option.text }}</span>
      </button>
    </div>

    <button
        class="confirm-btn"
        :disabled="selectedIndex === null"
        @click="confirmChoice"
    >
      Bevestig keuze
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import letterA from '../assets/letters/letter-a.png'
import letterB from '../assets/letters/letter-b.png'
import letterC from '../assets/letters/letter-c.png'

const props = defineProps({
  question: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['choice-made'])

const letters = [letterA, letterB, letterC]
const selectedIndex = ref(null)

const totalTime = 15
const timeLeft = ref(totalTime)
let timer = null

const timerPercentage = computed(() => {
  return (timeLeft.value / totalTime) * 100
})

onMounted(() => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value = Math.max(0, timeLeft.value - 0.1)
    } else {
      clearInterval(timer)
    }
  }, 100)
})

onUnmounted(() => {
  clearInterval(timer)
})

function selectOption(index) {
  selectedIndex.value = index
}

function confirmChoice() {
  if (selectedIndex.value === null) return

  clearInterval(timer)

  emit('choice-made', {
    index: selectedIndex.value,
    option: props.options[selectedIndex.value]
  })

  selectedIndex.value = null
}
</script>

<style scoped>
.choice-screen {
  width: 100%;
  max-width: 650px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.timer-box {
  width: 100%;
}

.timer-top {
  display: flex;
  justify-content: space-between;
  color: #e8f5c0;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.timer-bar {
  width: 100%;
  height: 14px;
  background: #AE7F60;
  border: 2px solid #643A1E;
  border-radius: 999px;
  overflow: hidden;
}

.timer-fill {
  height: 100%;
  background: green;
  border-radius: 999px;
  transition: width 0.1s linear;
}

.question-card {
  background: #2a3f17;
  border: 2px solid #6b8f3e;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
}

.question-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #a8c96b;
  margin-bottom: 10px;
}

.question-text {
  color: #e8f5c0;
  font-size: 1.8rem;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 1rem 1.25rem;
  border: 2px solid #643A1E;
  border-radius: 14px;
  background: #AE7F60;
  cursor: pointer;
  text-align: left;
}

.option-btn:hover {
  border-color: #643A1E;
  background: #a86434;
}

.option-letter {
  height: 6vh;
}

.option-btn.selected {
  border-color: #643A1E;
  background: #a86434;
}

.option-text {
  color: #e8f5c0;
  font-size: 1rem;
}

.confirm-btn {
  padding: 0.9rem;
  border-radius: 999px;
  border: none;
  background: #555;
  color: #aaa;
  font-size: 1rem;
  font-weight: 700;
  cursor: not-allowed;
}

.confirm-btn:not(:disabled) {
  background: #7ab33a;
  color: white;
  cursor: pointer;
}

.confirm-btn:not(:disabled):hover {
  background: #8fc94a;
}
</style>