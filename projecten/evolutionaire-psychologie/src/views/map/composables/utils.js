import {ref} from "vue";


export function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

export function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

export function distance(a, b) {
    const ax = a.x + a.width / 2;
    const ay = a.y + a.height / 2;

    const bx = b.x + b.width / 2;
    const by = b.y + b.height / 2;

    return Math.hypot(ax - bx, ay - by);
}
export function getHitbox(object) {
    return {
        x: object.x + object.hitbox.offsetX,
        y: object.y + object.hitbox.offsetY,
        width: object.hitbox.width,
        height: object.hitbox.height,
    };
}

export function preloadObstacleHitboxes(obstacles) {
    for (const obstacle of obstacles) {
        obstacle.hitbox = getHitbox(obstacle);
    }
}

export let infoTekst = ref("Beweeg met WASD of de pijltjestoetsen!")
export let textOnScreen = ref(true);
let started = false;

export function setTextValue(value) {
    infoTekst.value = value;
    setTextOnScreen(true);
    started = true;
}

export function setTextOnScreen(value) {
    // Deze functie kan pas gecalled worden als de eerst "beweeg tekst" aangepast is. Dit om overname van player.js te voorkomen
    if (!started) return;
    textOnScreen.value = value;
}

