<script setup>
import {onMounted, onUnmounted, reactive, ref} from "vue";
import {useKeyboard} from "./composables/useKeyboard";
import {
  player,
  playerHandling,
  preloadAnimationFrames,
  updateAnimation
} from "./composables/player";
import {camera, updateCamera} from "./composables/camera";
import {
  distance,
  infoTekst,
  preloadObstacleHitboxes,
  textOnScreen
} from "./composables/utils";
import {finishedScenario1, finishedScenario2, finishedScenario3} from "../progressie";

let debugMode = false;

const {keys} = useKeyboard()

let map = {
  width: 2000,
  height: 2000,
};

const viewport = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
});

const worldTransform = ref('')

const objects = [
    {type: "interactable",
      x: 1450,
      y: 430,
      width: 600,
      height: 600,
      label: "Peer pressure",
      scene: "groepsdruk",
      image: new URL('../../assets/world_map/School.svg', import.meta.url).href,
      hitbox: {
        offsetX: 95,
        offsetY: 10,
        width: 400,
        height: 440,
      },
      infoTekst: "Je bent nu op school. Druk op de spatiebalk om het scenario te openen",
      finishedScenario: finishedScenario1
    },
    {type: "interactable",
      x: 995,
      y: 1200,
      width: 700,
      height: 700,
      label: "FOMO",
      scene: "FOMO",
      image: new URL('../../assets/world_map/Thuis.svg', import.meta.url).href,
      hitbox: {
        offsetX: 110,
        offsetY: 10,
        width: 470,
        height: 510,
      },
      infoTekst: "Je bent nu thuis. Druk op de spatiebalk om het scenario te openen",
      finishedScenario: finishedScenario2
    },
  {type: "interactable",
    x: -55,
    y: 1535,
    width: 550,
    height: 550,
    label: "Huiswerk",
    scene: "sample-scenario",
    image: new URL('../../assets/world_map/Bibliotheek.svg', import.meta.url).href,
    hitbox: {
      offsetX: 70,
      offsetY: 10,
      width: 390,
      height: 510,
    },
    infoTekst: "Je bent nu bij de bibliotheek. Druk op de spatiebalk om het scenario te openen",
    finishedScenario: finishedScenario3
  },
  {type: "normal",
    x: 1100,
    y: 0,
    width: 500,
    height: 460,
    label: "Obstakel",
    image: "",
    hitbox: {
      offsetX: 0,
      offsetY: 0,
      width: 500,
      height: 460,
    },
  },
];

function onResize() {
  viewport.width = window.innerWidth;
  viewport.height = window.innerHeight;
}

let animationFrame;
let lastTime = performance.now();
let fps = 0;
function gameLoop(time) {
  const delta = time - lastTime;
  const now = performance.now();
  const diff = now - lastTime;
  fps = Math.round(1000 / diff);
  lastTime = now;

  updateAnimation(delta);

  playerHandling(keys, objects, map, delta);
  updateCamera(player, viewport, map, delta);
  worldTransform.value = `translate(${-camera.x}px, ${-camera.y}px)`;



  animationFrame = window.requestAnimationFrame(gameLoop);
}

onMounted(() => {
  window.addEventListener("resize", onResize);
  preloadAnimationFrames();
  preloadObstacleHitboxes(objects);

  requestAnimationFrame(gameLoop);
});

onUnmounted(() => {

  cancelAnimationFrame(animationFrame);
});

</script>

<template>
  <div v-if="debugMode" class = "debug">
    X: {{player.x}}
    Y: {{player.y}}
    FPS: {{fps}}
  </div>
  <div class = "info-tekst"
   :class="{ onScreen: textOnScreen }"
   :style="{
          left: viewport.width / 2 + 'px',
          top: viewport.height - 150 + 'px',
        }">
    {{ infoTekst }}
  </div>
  <div class="game">
    <div class="world" :style="{
       width: map.width + 'px',
       height: map.height + 'px',
       transform: worldTransform
    }">
      <div class="player"
       :class="{ debug: debugMode }"
       :style="{
          backgroundImage: `url(${player.animation.frames[player.animation.frame]})`,
          width: player.width + 'px',
          height: player.height + 'px',
          left: player.x + 'px',
          top: player.y + 'px',
        }"
      ></div>
      <div v-if="debugMode" class="hitbox-debug" :style="{
        width: player.hitbox.width + 'px',
        height: player.hitbox.height + 'px',
        left: player.x + player.hitbox.offsetX + 'px',
        top: player.y + player.hitbox.offsetY + 'px',
      }"
      ></div>
      <div
          v-for="(object, i) in objects"
          :key="i"
          style="position: absolute; left: 0; top: 0;"
      >
        <div v-if="debugMode" class="hitbox-debug" :style="{
        width: object.hitbox.width + 'px',
        height: object.hitbox.height + 'px',
        transform: `translate(${object.x + object.hitbox.offsetX}px,
                          ${object.y + object.hitbox.offsetY}px)`,
        }"
        ></div>
        <div
            v-if="object.type === 'interactable'"
            class="interactable-building"
            :class="{ active: distance(player, object) < player.INTERACT_RANGE, debug: debugMode }"
            :style="{
              left: object.x + 'px',
              top: object.y + 'px',
              width: object.width + 'px',
              height: object.height + 'px',
            }">
          <img :src="object.image" class="building-image" :class="{ active: distance(player, object) < player.INTERACT_RANGE, finished: object.finishedScenario}" alt="building image">
<!--          <div-->
<!--              class="interact-ring"-->
<!--              :class="{ active: distance(player, object) < player.INTERACT_RANGE, debug: debugMode }"-->
<!--              :style="{ width: player.INTERACT_RANGE * 2 + 'px',-->
<!--                        height: player.INTERACT_RANGE * 2 + 'px',-->
<!--                        left: object.hitbox.offsetX + object.hitbox.width / 2 + 'px',-->
<!--                        top: object.hitbox.offsetY + object.hitbox.height / 2 + 'px',-->
<!--                        transform: 'translate(-50%, -50%) scale(0.8)',-->
<!--                        }"-->
<!--          >-->
<!--            <div class="interact-text" :class="{ active: distance(player, object) < player.INTERACT_RANGE }">-->
<!--              Druk op Spatie om het scenario te spelen!-->
<!--            </div>-->
<!--          </div>-->
        </div>
        <div
            v-else-if="object.type === 'normal'"
            class="normal-object"
            :style="{
              transform: `translate(${object.x}px, ${object.y}px)`,
              width: object.width + 'px',
              height: object.height + 'px'
          }">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Grandstander:wght@400;700&family=Kirang+Haerang&display=swap');

.world {
  position: relative;
  overflow: hidden;
  background-image: url("../../assets/world_map/Map.svg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  will-change: transform;
  transform: translateZ(0);
}

.debug {
  position: fixed;
  top: 10px;
  left: 10px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 10px;
  font-family: monospace;
  z-index: 9999;
}

.info-tekst {
  position: absolute;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 10px;
  font-family: 'Grandstander', cursive;
  font-size: 3rem;
  text-align: center;
  z-index: 9999;
  transform: translateX(-50%);
  opacity: 0;
  transition: 0.25s ease-out;
}

.info-tekst.onScreen {
  opacity: 1;
}

.player {
  position: absolute;

  /* background-image: url("../../assets/world_map/player1.svg"); */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.player.debug {
  /* Debug */
  border-color: green;
  border-style: solid;
  background: rgba(0,0,0,0);;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.hitbox-debug {
  position: absolute;
  border: 2px solid red;
  pointer-events: none;
  box-sizing: border-box;
}

.interactable-building {
  position: absolute;
  color: white;
  transition: 0.5s ease;
  transform: rotate(0);
  outline-style: none;
  outline-color: transparent;
  outline-width: 2px;
}

.building-image {
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition: 0.25s ease;
}
.building-image.active {
  filter: drop-shadow(0 0 8px white);
}
.building-image.finished {
  filter: drop-shadow(0 0 10px gold) drop-shadow(0 0 8px white);
}
.interactable-building.active {
  transform: rotate(-5deg);
}

.interactable-building.debug {
  /* Debug */
  border-color: green;
  border-style: solid;
  background-size: contain;
  background-color: rgba(0,0,0,0);;
}

.normal-object {
  position: absolute;
  color: white;
}

.normal-object.debug {
  /* Debug */
  border-color: green;
  border-style: solid;
  background-size: contain;
  background-color: rgba(0,0,0,0);
}

/* .interact-ring {
  position: absolute;
  border: 2px solid transparent;
  border-radius: 50%;
  pointer-events: none;
  transition: 0.15s ease;
  scale: 0.8;
  transform-origin: center;
} */

/*.interact-ring.debug { */
  /* Debug */
/*
  border-color: orange;
  border-style: solid;
  background-size: contain;
  background-color: rgba(0,0,0,0);
}

.interact-ring.active {
  border-color: yellow;
  scale: 1;
}

.interact-text {
  position: absolute;
  pointer-events: none;
  display: none;
  top: -25%;
  left: 50%;
  transform: translate(-50%, -50%);

  font-size: 15px;
  color: white;
  font-family: sans-serif;
  font-weight: bold;
  white-space: nowrap;

  transition: 0.15s ease;
}

.interact-text.active {
  display: block;
} */
</style>