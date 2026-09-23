<template>
  <div class="end-screen">

    <div class="btn-terug" @click="$emit('terug')">
      <span class="btn-terug-tekst">Terug naar de map</span>
    </div>

    <div class="uitgespeeld-wrap">
      <div class="uitgespeeld-blob"></div>
      <span class="uitgespeeld-tekst">Je hebt 'm uitgespeeld!</span>
    </div>

    <div class="content">

      <h1 class="titel">Een heel oud brein.</h1>

      <p class="body-tekst">
        Vijf knoppen. Drie situaties. Eén heel oud brein. Je koos niet
        altijd — soms koos je oerbrein voor jou. En dat is precies het
        punt: je kunt het niet uitzetten, maar je kunt het wél leren
        herkennen.
      </p>

      <div class="sr-banner">
        <p class="sr-vraag">Welke van de vijf stressresponses herken jij het meest in jezelf?</p>
        <div class="sr-pills">
          <div class="pill pill-fight"><span class="label label-fight">Fight</span></div>
          <div class="pill pill-flight"><span class="label label-flight">Flight</span></div>
          <div class="pill pill-freeze"><span class="label label-freeze">Freeze</span></div>
          <div class="pill pill-fawn"><span class="label label-fawn">Fawn</span></div>
          <div class="pill pill-tend"><span class="label label-tend">Tend and befriend</span></div>
        </div>
      </div>

      <div class="btn-opnieuw" @click="$emit('opnieuw')">
        <span class="btn-opnieuw-tekst">Opnieuw Spelen</span>
      </div>

    </div>
  </div>
</template>

<script setup>
defineEmits(['opnieuw', 'terug'])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Grandstander:wght@400;700&family=Kirang+Haerang&display=swap');

.end-screen {
  width: 100vw;
  height: 100vh;
  background: #3b5621;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Grandstander', cursive;
  overflow: hidden;
  position: relative;
  padding: 0 24px;
  box-sizing: border-box;
}

/* ── Terug naar de map ── */
.btn-terug {
  position: absolute;
  top: 3vh;
  left: 3vw;
  width: clamp(160px, 18vw, 278px);
  height: clamp(40px, 6vh, 66px);
  background: #AE7F60;
  border-radius: 20px 50px 10px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.btn-terug-tekst {
  font-family: 'Kirang Haerang', cursive;
  font-size: clamp(14px, 2vw, 28px);
  color: #453124;
  text-align: center;
  line-height: 1;
}

/* ── "Je hebt 'm uitgespeeld!" ── */
.uitgespeeld-wrap {
  position: absolute;
  top: 10vh;
  left: 50%;
  transform: translateX(-50%) rotate(2.06deg);
  width: clamp(200px, 40vw, 560px);
  height: clamp(36px, 5vh, 60px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.uitgespeeld-blob {
  position: absolute;
  inset: 0;
  background: radial-gradient(35.99% 49.41% at 50.1% 50.52%, #AE7F60 0%, rgba(174,127,96,0.4) 68.75%, rgba(174,127,96,0) 100%);
  border-radius: 50%;
}
.uitgespeeld-tekst {
  position: relative;
  font-family: 'Grandstander', cursive;
  font-size: clamp(12px, 1.4vw, 20px);
  color: #453124;
  z-index: 1;
}

/* ── Main content ── */
.content {
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 2vh, 24px);
  width: min(748px, 90vw);
  margin-top: 6vh;
}

.titel {
  font-family: 'Kirang Haerang', cursive;
  font-size: clamp(24px, 4vw, 45px);
  color: #F4FBE7;
  font-weight: 400;
  line-height: 1;
}

.body-tekst {
  font-family: 'Grandstander', cursive;
  font-size: clamp(14px, 2.2vw, 30px);
  color: #F4FBE7;
  line-height: 1.3;
}

/* ── Stressresponses banner ── */
.sr-banner {
  width: 100%;
  background: #AE7F60;
  border: 3px solid #643A1E;
  border-radius: 30px 60px 22px 70px;
  box-sizing: border-box;
  padding: clamp(10px, 2vh, 18px) clamp(12px, 2vw, 24px);
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1.5vh, 14px);
}

.sr-vraag {
  font-family: 'Grandstander', cursive;
  font-size: clamp(12px, 1.5vw, 22px);
  color: #F4FBE7;
  line-height: 1.2;
}

.sr-pills {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(6px, 1vw, 10px);
  align-items: center;
}

.pill {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.pill-fight  { width: 77px;  height: 33px; background: #9BE755; border-radius: 20px 60px 10px 30px; }
.pill-flight { width: 75px;  height: 34px; background: #FFB454; border-radius: 50px 60px 20px 30px; }
.pill-freeze { width: 73px;  height: 34px; background: #5CF3F6; border-radius: 60px 30px 10px 30px; }
.pill-fawn   { width: 73px;  height: 34px; background: #846134; border-radius: 30px 60px 30px 60px; }
.pill-tend   { width: 185px; height: 34px; background: #9BE755; border-radius: 60px 22px 40px 10px; }

.label {
  font-family: 'Kirang Haerang', cursive;
  font-size: 20px;
  line-height: 1;
}
.label-fight  { color: #11331F; }
.label-flight { color: #4A2A06; }
.label-freeze { color: #266061; }
.label-fawn   { color: #4A2A06; }
.label-tend   { color: #11331F; font-size: 18px; }

/* ── Opnieuw spelen ── */
.btn-opnieuw {
  width: clamp(160px, 18vw, 278px);
  height: clamp(40px, 6vh, 66px);
  background: #AE7F60;
  border-radius: 15px 50px 1px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.btn-opnieuw-tekst {
  font-family: 'Kirang Haerang', cursive;
  font-size: clamp(14px, 2vw, 28px);
  color: #453124;
  text-align: center;
  line-height: 1;
}
</style>
