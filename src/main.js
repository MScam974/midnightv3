import { state } from './state.js';
import { renderRace, renderStatut, renderPersonnalite, renderTraits } from './renderer.js';

function update() {
    const app = document.getElementById('app');
    
    // 0: Race, 1: Statut, 2: Caractère, 3: Vices/Vertus
    const steps = [renderRace, renderStatut, renderPersonnalite, renderTraits];
    
    if (state.step < steps.length) {
        steps[state.step](app, () => {
            state.step++;
            update();
        });
    } else {
        app.innerHTML = "<h1>Personnage validé !</h1>";
        console.log("Personnage final :", state);
    }
}

update();