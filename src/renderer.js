import { state } from './state.js';
import { calculerTotalPoints } from './logic.js';

export function renderApp(container, onNext) {
    container.innerHTML = "";
    
    // 1. Afficher l'historique validé
    state.history.forEach(h => {
        container.innerHTML += `<div class="summary">✅ ${h.title} : <strong>${h.value}</strong></div>`;
    });

    // 2. Rendu de l'étape active
    if (state.step === 0) renderRace(container, onNext);
    else if (state.step === 1) renderPersonnalite(container, onNext);
    // Ajoutez ici les autres étapes (renderTraits, etc.)
}

async function renderRace(container, onNext) {
    const response = await fetch('./data/competences/races.json');
    const races = await response.json();
    
    container.innerHTML += `<h1>1. Choix de la Race</h1>`;
    races.forEach(r => {
        const btn = document.createElement('button');
        btn.innerText = r.nom;
        btn.onclick = () => {
            state.race = r;
            state.history.push({ title: "Race", value: r.nom });
            onNext();
        };
        container.appendChild(btn);
    });
}

function renderPersonnalite(container, onNext) {
    container.innerHTML += `<h1>2. Personnalité</h1>
        <p>Total : <span id="total-points">${calculerTotalPoints(state.personnalite)}</span>/15</p>`;
    
    for (const [aspect, score] of Object.entries(state.personnalite)) {
        container.innerHTML += `<div><label>${aspect}</label> 
            <input type="number" class="aspect-input" data-aspect="${aspect}" value="${score}"></div>`;
    }
    const btn = document.createElement('button');
    btn.id = "btn-lock";
    btn.innerText = "Valider";
    btn.disabled = calculerTotalPoints(state.personnalite) !== 15;
    container.appendChild(btn);

    container.querySelectorAll('.aspect-input').forEach(input => {
        input.addEventListener('input', (e) => {
            state.personnalite[e.target.dataset.aspect] = parseInt(e.target.value) || 0;
            const t = calculerTotalPoints(state.personnalite);
            document.getElementById('total-points').innerText = t;
            document.getElementById('btn-lock').disabled = (t !== 15);
        });
    });

    btn.onclick = () => {
        // --- CORRECTION ICI ---
        // On construit un résumé lisible de la personnalité
        const resume = Object.entries(state.personnalite)
            .map(([aspect, score]) => `${aspect}: ${score}`)
            .join(', ');
        
        state.history.push({ title: "Personnalité", value: resume });
        // ----------------------
        
        onNext();
    };
}