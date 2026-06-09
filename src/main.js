import { state } from './state.js';
import { renderPersonnalite } from './renderer.js';

function init() {
    const app = document.getElementById('app');
    
    function navigate() {
        if (state.step === 0) {
            // Logique Race ici...
            state.step = 1; // On passe à personnalité pour le test
        }
        
        if (state.step === 1) {
            renderPersonnalite(app, () => {
                state.history.push({ title: "Personnalité", value: "Validée" });
                state.step++;
                navigate();
            });
        }
    }
    navigate();
}

init();