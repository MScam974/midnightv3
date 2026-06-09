import { state } from './state.js';
import { calculerTotalPoints } from './logic.js';

export function renderPersonnalite(container, onLock) {
    container.innerHTML = `<p>Total points : <span id="total-points">${calculerTotalPoints(state.personnalite)}</span>/15</p>`;
    
    for (const [aspect, score] of Object.entries(state.personnalite)) {
        container.innerHTML += `<div>
            <label>${aspect}</label> 
            <input type="number" class="aspect-input" data-aspect="${aspect}" value="${score}">
        </div>`;
    }
    
    container.innerHTML += `<button id="btn-lock" disabled>Verrouiller</button>`;

    // Logique temps réel
    container.querySelectorAll('.aspect-input').forEach(input => {
        input.addEventListener('input', (e) => {
            state.personnalite[e.target.dataset.aspect] = parseInt(e.target.value) || 0;
            const total = calculerTotalPoints(state.personnalite);
            document.getElementById('total-points').innerText = total;
            document.getElementById('btn-lock').disabled = (total !== 15);
        });
    });

    document.getElementById('btn-lock').onclick = () => onLock();
}