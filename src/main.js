import { state } from './state.js';
import { renderRace, renderStatut, renderPersonnalite, renderTraits } from './renderer.js';

const steps = [renderRace, renderStatut, renderPersonnalite, renderTraits];

function update() {
    const app = document.getElementById('app');
    app.innerHTML = ""; 
    
    if (state.history.length > 0) {
        const hDiv = document.createElement('div');
        hDiv.className = "history-container";
        state.history.forEach(h => { hDiv.innerHTML += `<div>✅ ${h.title}: ${h.value}</div>`; });
        app.appendChild(hDiv);
    }

    if (state.step < steps.length) {
        const stepDiv = document.createElement('div');
        app.appendChild(stepDiv);
        steps[state.step](stepDiv, () => {
            state.step++;
            update();
        });
    } else {
        app.innerHTML += "<h1>Personnage terminé !</h1>";
    }
}

update();