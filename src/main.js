import { state } from './state.js';
import { renderRace, renderStatut, renderPersonnalite, renderTraits } from './renderer.js';

// Liste des fonctions d'étape
const steps = [renderRace, renderStatut, renderPersonnalite, renderTraits];

function update() {
    const app = document.getElementById('app');
    
    // 1. Nettoyer l'affichage principal pour éviter les doublons
    app.innerHTML = "";
    
    // 2. Afficher l'historique des choix validés (si présent)
    if (state.history.length > 0) {
        const historyDiv = document.createElement('div');
        historyDiv.className = "history-container";
        state.history.forEach(h => {
            historyDiv.innerHTML += `<div class="summary">✅ ${h.title} : <strong>${h.value}</strong></div>`;
        });
        app.appendChild(historyDiv);
    }

    // 3. Afficher l'étape actuelle
    if (state.step < steps.length) {
        // Créer un conteneur pour l'étape en cours
        const stepContainer = document.createElement('div');
        stepContainer.id = "content";
        app.appendChild(stepContainer);
        
        // Appeler la fonction de l'étape
        steps[state.step](stepContainer, () => {
            state.step++;
            update(); // On relance la boucle de rendu
        });
    } else {
        // Fin du processus
        app.innerHTML += "<h1>Personnage validé !</h1>";
        app.innerHTML += `<button onclick="location.reload()">Recommencer</button>`;
        console.log("Personnage final :", state);
    }
}

// Initialisation
update();