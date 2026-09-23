<script setup>

import {setScene} from "./scherm";
</script>

<template>
  <p>
    Dit is een scenario
  </p>
  <br>
  <button class="start-btn" @click="setScene('map')">
    Ga terug
  </button>
</template>

<style scoped>
  p {
    font-size: 5rem;
  }
  .start-btn {
    cursor: pointer;
    padding: 0;
    margin-top: 1.4rem;
    transition: transform 0.12s ease;
    width: 10rem;
    height: 5rem;
  }
  .start-btn:hover { transform: scale(1.05); }
  .start-btn:active { transform: scale(0.97); }
</style>