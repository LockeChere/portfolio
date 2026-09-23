import {reactive} from "vue";
import {clamp, distance, getHitbox, isColliding, setTextOnScreen, setTextValue} from "./utils";
import {setScene} from "../../scherm";

export const player = reactive({
    x: 950,
    y: 520,
    width: 96, //In pixels
    height: 96, //In pixels
    speed: 5,
    INTERACT_RANGE: 450,
    hitbox: {
        offsetX: 16,
        offsetY: 0,
        width: 64,
        height: 87,
    },
    animation: {
        frame: 0,
        timer: 0,
        speed: 45,
        frames: [
            new URL('../../../assets/world_map/player1.svg', import.meta.url).href,
            new URL('../../../assets/world_map/player2.svg', import.meta.url).href,
            new URL('../../../assets/world_map/player1.svg', import.meta.url).href,
            new URL('../../../assets/world_map/player3.svg', import.meta.url).href,
        ]
    },
    isMoving: false,
});

// Fix voor glitchende animatie
export function preloadAnimationFrames() {
    player.animation.frames.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}


export function updateAnimation (delta) {
    if (!player.isMoving) {
        player.animation.frame = 0;
        return;
    }
    player.animation.timer += delta;


    if (player.animation.timer > player.animation.speed) {
        player.animation.timer = 0;
        player.animation.frame = player.animation.frame + 1;
        if (player.animation.frame >= player.animation.frames.length) {
            player.animation.frame = 0;
        }
    }
}

// Collisions, movement en key handling wordt hier gedaan
export function playerHandling(keys, objects, map, delta) {
    //Kijkt op elke object in de lijst voor collision
    function collides() {
        const playerHitbox = getHitbox(player);
        return objects.some((obj) => isColliding(playerHitbox, obj.hitbox));
    }

    const frameSpeed = player.speed * (delta / 16.67);

    const oldX = player.x;

    if (keys["ArrowLeft"] || keys["a"]) {
        player.x -= frameSpeed;
    }
    if (keys["ArrowRight"] || keys["d"]) {
        player.x += frameSpeed;
    }

    if (collides()) {
        player.x = oldX;
        console.log("Colliding");
    }


    const oldY = player.y;
    if (keys["ArrowUp"] || keys["w"]) {
        player.y -= frameSpeed;
    }
    if (keys["ArrowDown"] || keys["s"]) {
        player.y += frameSpeed;
    }

    if (collides()) {
        player.y = oldY;
        console.log("Colliding");
    }

    //Checkt of de player beweeg voor animatie. Zo ja: speel de animatie
    player.isMoving = !!(keys["ArrowLeft"] || keys["a"] || keys["ArrowRight"] || keys["d"] || keys["ArrowUp"] || keys["w"] || keys["ArrowDown"] || keys["s"]);


    //Border collission
    player.x = clamp(
        player.x,
        0,
        map.width - player.width
    );

    player.y = clamp(
        player.y,
        0,
        map.height - player.height
    );

    function getNearbyInteractable() {
        return objects.find((obj) => {
            return (
                obj.type === "interactable" &&
                distance(player, obj) < player.INTERACT_RANGE
            );
        });
    }


    const nearby = getNearbyInteractable();
    if (nearby) {
        setTextValue(nearby.infoTekst);
    } else {
        setTextOnScreen(false);
    }

    // Als player op spatie drukt
    if (keys[" "]) {
        const target = getNearbyInteractable();

        if (target) {
            console.log(target);
            console.log("Interactable");
            if (typeof target.scene !== "undefined") {
                setScene(target.scene);
            }
        }
    }
}