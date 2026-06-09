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

// On expose la fonction à l'objet global window pour les boutons HTML
window.goToStep = goToStep;

export function update() {
    const app = document.getElementById('app');
    app.innerHTML = ""; 
    
    // Affichage historique avec bouton "Modifier"
    if (state.history.length > 0) {
        const hDiv = document.createElement('div');
        hDiv.className = "history-container";
        state.history.forEach((h, index) => {
            const div = document.createElement('div');
            // Utilisation de la fonction globale goToStep via window
            div.innerHTML = `✅ ${h.title}: <strong>${h.value}</strong> 
                             <button onclick="window.goToStep(${index})">Modifier</button>`;
            hDiv.appendChild(div);
        });
        app.appendChild(hDiv);
    }

    // Affichage de l'étape en cours
    if (state.step < steps.length) {
        const stepDiv = document.createElement('div');
        stepDiv.id = "step-content";
        app.appendChild(stepDiv);
        
        // Exécution de l'étape actuelle
        steps[state.step](stepDiv, () => {
            state.step++;
            update();
        });
    } else {
        app.innerHTML += "<h1>Personnage terminé !</h1>";
        app.innerHTML += `<button onclick="location.reload()">Recommencer</button>`;
    }
}

// Premier lancement
update();