
import {clamp} from "./utils";

export const camera = {
    x: 0,
    y: 0,
}

export function updateCamera(player, viewport, map, delta) {
    let targetX = player.x - viewport.width / 2;
    let targetY = player.y - viewport.height / 2;

    const maxX = map.width - viewport.width;
    const maxY = map.height - viewport.height;

    const clampedTargetX = clamp(targetX, 0, maxX);
    const clampedTargetY = clamp(targetY, 0, maxY);

    const smoothing = 1 - Math.pow(0.9, delta / 16.67); // Lerping en niet frame dependent

    camera.x += (clampedTargetX - camera.x) * smoothing;
    camera.y += (clampedTargetY - camera.y) * smoothing;
}