import { state } from './state.js';
import { calculerTotalPoints } from './logic.js';

export function renderStep(container, title, contentHtml, onLock) {
    container.innerHTML = `<h1>${title}</h1>` + contentHtml;
    const lockBtn = container.querySelector('#btn-lock');
    if (lockBtn) {
        lockBtn.onclick = onLock;
    }
}

export function renderPersonnalite(container, onLock) {
    const total = calculerTotalPoints(state.personnalite);
    let html = `<p>Total : <span id="total-points">${total}</span>/15</p>`;
    
    for (const [aspect, score] of Object.entries(state.personnalite)) {
        html += `<div><label>${aspect}</label> 
            <input type="number" class="aspect-input" data-aspect="${aspect}" value="${score}"></div>`;
    }
    html += `<button id="btn-lock" ${total !== 15 ? 'disabled' : ''}>Verrouiller</button>`;
    
    renderStep(container, "2. Personnalité", html, onLock);
    
    container.querySelectorAll('.aspect-input').forEach(input => {
        input.addEventListener('input', (e) => {
            state.personnalite[e.target.dataset.aspect] = parseInt(e.target.value) || 0;
            const t = calculerTotalPoints(state.personnalite);
            document.getElementById('total-points').innerText = t;
            document.getElementById('btn-lock').disabled = (t !== 15);
        });
    });
}