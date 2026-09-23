import {onMounted, onUnmounted} from "vue";

export function useKeyboard() {
    const keys = {};

    function keyDown(event) {
        keys[event.key] = true;
    }

    function keyUp(event) {
        keys[event.key] = false;
    }

    onMounted(() => {
        window.addEventListener("keydown", keyDown);
        window.addEventListener("keyup", keyUp);
    });
    onUnmounted(() => {
        window.removeEventListener("keydown", keyDown);
        window.removeEventListener("keyup", keyUp);
    });

    return { keys };
}