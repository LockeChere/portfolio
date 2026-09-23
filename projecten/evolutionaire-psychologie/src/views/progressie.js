export function finishedScenario(scenario) {
    switch (scenario) {
        case 1:
            finishedScenario1 = true;
            break;
        case 2:
            finishedScenario2 = true;
            break;
        case 3:
            finishedScenario3 = true;
            break;
    }
}

export let finishedScenario1 = false;
export let finishedScenario2 = false;
export let finishedScenario3 = false;