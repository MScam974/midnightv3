import { state } from './state.js';
import { calculerTotalPoints } from './logic.js';

export function renderPersonnalite(container, onLock) {
    // ... votre code HTML ici ...
    // Pour appeler le calcul :
    const total = calculerTotalPoints(state.personnalite);
}