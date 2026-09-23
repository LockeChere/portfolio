import {ref} from "vue";

export const scherm = ref("home");

export function setScene(newScene) {
    scherm.value = newScene;
}