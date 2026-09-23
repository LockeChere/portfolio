<template>
  <HomeScreen
    v-if="scherm === 'home'"
    @start="scherm = 'intro'"
  />
  <IntroScreen
    v-else-if="scherm === 'intro'"
    @klaar="scherm = 'map'"
  />
  <WorldMap
      v-else-if="scherm === 'map'"
  />
  <GroepsdrukScenario
    v-else-if="scherm === 'groepsdruk'"
    @klaar="scherm = 'end'"
    @map="scherm = 'map'"
  />
  <FomoScenario
      v-else-if="scherm === 'FOMO'"
      @klaar="scherm = 'end'"
      @map="scherm = 'map'"
  />
  <EndScreen
    v-else-if="scherm === 'end'"
    @opnieuw="scherm = 'home'"
    @terug="scherm = 'map'"
  />
  <SampleScenario
    v-else-if="scherm === 'sample-scenario'"
  />
</template>

<script setup>
import HomeScreen         from './views/HomeScreen.vue'
import IntroScreen        from './views/IntroScreen.vue'
import GroepsdrukScenario from './views/GroepsdrukScenario.vue'
import EndScreen          from './views/EndScreen.vue'
import WorldMap from "./views/map/WorldMap.vue";
import SampleScenario from "./views/SampleScenario.vue";
import FomoScenario from "./views/FomoScenario.vue";

import {scherm} from "./views/scherm";

</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { overflow: hidden; }
</style>
