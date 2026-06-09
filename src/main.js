import { state } from './state.js';
import { renderPersonnalite } from './renderer.js';

function initApp() {
    const app = document.getElementById('app');
    
    // Exemple : Lancer l'étape Personnalité
    // On définit ce qui se passe quand on verrouille
    renderPersonnalite(app, () => {
        alert("Étape validée !");
        console.log("État final :", state);
    });
}

initApp();