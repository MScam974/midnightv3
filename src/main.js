import { state } from './state.js';
import { renderApp } from './renderer.js';

function update() {
    renderApp(document.getElementById('app'), () => {
        state.step++; // Passage à l'étape suivante
        update();     // Rendu de la nouvelle étape
    });
}

update();