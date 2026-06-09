import { state } from './state.js';
import { renderRace, renderStatut, renderPersonnalite, renderTraits } from './renderer.js';

const steps = [renderRace, renderStatut, renderPersonnalite, renderTraits];

// Fonction pour revenir en arrière
export function goToStep(stepIndex) {
    state.step = stepIndex;
    // On retire tout ce qui a été fait APRÈS cette étape dans l'historique
    state.history = state.history.slice(0, stepIndex);
    update();
}

export function update() {
    const app = document.getElementById('app');
    app.innerHTML = ""; 
    
    // Affichage historique avec bouton "Modifier"
    if (state.history.length > 0) {
        const hDiv = document.createElement('div');
        hDiv.className = "history-container";
        state.history.forEach((h, index) => {
            const div = document.createElement('div');
            div.innerHTML = `✅ ${h.title}: <strong>${h.value}</strong> 
                             <button onclick="window.goToStep(${index})">Modifier</button>`;
            hDiv.appendChild(div);
        });
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

// Rendre la fonction accessible globalement pour le bouton "Modifier"
window.goToStep = goToStep;

update();