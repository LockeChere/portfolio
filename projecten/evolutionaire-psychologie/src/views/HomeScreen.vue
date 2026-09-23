<template>
  <div class="homescreen">
    <div class="content">

      <!-- Tagline pill -->
      <div class="tagline-row">
        <img class="highlight" src="../assets/highlight.png" alt="" aria-hidden="true" />
        <span class="tagline">het stress-keuzespel · StudieStap</span>
      </div>

      <!-- Logo -->
      <img class="logo" src="../assets/oerbrein-logo.png" alt="Oerbrein" />

      <!-- Subtitle -->
      <img class="subtitle" src="../assets/subtitle.png" alt="Je brein is 300.000 oud. De samenleving niet." />

      <!-- Button -->
      <button class="start-btn" @click="$emit('start')">
        <img src="../assets/button.png" alt="Start het spel" class="btn-bg" />
      </button>

    </div>
  </div>
</template>

<script setup>
defineEmits(['start'])
</script>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }

.homescreen {
  width: 100vw;
  height: 100vh;
  background-color: #3b5621;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}

.tagline-row {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.highlight {
  width: clamp(160px, 20vw, 300px);
  height: auto;
  display: block;
}

.tagline {
  position: absolute;
  font-family: sans-serif;
  font-size: clamp(0.55rem, 0.85vw, 0.8rem);
  color: rgba(70, 42, 18, 0.9);
  white-space: nowrap;
  letter-spacing: 0.01em;
  font-weight: 600;
}

.logo {
  width: clamp(280px, 42vw, 580px);
  height: auto;
  display: block;
}

.subtitle {
  width: clamp(200px, 28vw, 420px);
  height: auto;
  display: block;
  margin-top: 0.8rem;
}

.start-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-top: 1.4rem;
  transition: transform 0.12s ease;
}
.start-btn:hover { transform: scale(1.05); }
.start-btn:active { transform: scale(0.97); }

.btn-bg {
  width: clamp(140px, 15vw, 210px);
  height: auto;
  display: block;
}
</style>
