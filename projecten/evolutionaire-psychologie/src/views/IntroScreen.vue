<template>
  <div class="intro-screen" @click="$emit('klaar')">
    <div class="content">

      <p class="tekst-intro">
        Als je gestrest bent, doe je een<br>
        van deze vijf dingen. Altijd. Je<br>
        kunt er niks aan doen.
      </p>

      <div class="cards">

        <div class="card card-fight">
          <div class="pill pill-fight">
            <span class="label label-fight">Fight</span>
          </div>
        </div>

        <div class="card card-flight">
          <div class="pill pill-flight">
            <span class="label label-flight">Flight</span>
          </div>
        </div>

        <div class="card card-freeze">
          <div class="pill pill-freeze">
            <span class="label label-freeze">Freeze</span>
          </div>
        </div>

        <div class="card card-fawn">
          <div class="pill pill-fawn">
            <span class="label label-fawn">Fawn</span>
          </div>
        </div>

        <div class="card card-tend">
          <div class="pill pill-tend">
            <span class="label label-tend">Tend and befriend</span>
          </div>
        </div>

      </div>

      <p class="tekst-straks">Straks ga je ze allemaal herkennen. In jezelf.</p>
      <p class="tekst-tik">tik om verder tegaan →</p>

    </div>
  </div>
</template>

<script setup>
defineEmits(['klaar'])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Grandstander:wght@400;700&family=Kirang+Haerang&display=swap');

.intro-screen {
  width: 100vw;
  height: 100vh;
  background: #3b5621;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Grandstander', cursive;
  cursor: pointer;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 748px;
}

.tekst-intro {
  font-family: 'Kirang Haerang', cursive;
  font-size: 36px;
  color: #fff;
  line-height: 1.35;
  margin-bottom: 8px;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  width: 748px;
  height: 72px;
  background: #AE7F60;
  border: 3px solid #643A1E;
  display: flex;
  align-items: center;
  padding-left: 18px;
  box-sizing: border-box;
}

.card-fight  { border-radius: 4px 80px 3px 40px; }
.card-flight { border-radius: 70px 40px 70px 40px; }
.card-freeze { border-radius: 15px 70px 15px 70px; }
.card-fawn   { border-radius: 15px 30px 40px 60px; }
.card-tend   { border-radius: 15px 60px 15px 70px; }

.pill {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pill-fight  { width: 77px;  height: 33px; background: #9BE755; border-radius: 20px 60px 10px 30px; }
.pill-flight { width: 75px;  height: 34px; background: #FFB454; border-radius: 50px 60px 40px 30px; }
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

.tekst-straks {
  font-family: 'Kirang Haerang', cursive;
  font-size: 26px;
  color: #9BE755;
  margin-top: 8px;
}

.tekst-tik {
  font-size: 14px;
  color: rgba(255,255,255,0.45);
}
</style>
